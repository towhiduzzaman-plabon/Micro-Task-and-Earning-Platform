import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth, requireRole } from '@/middleware/auth'
import { ObjectId } from 'mongodb'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()
    const id = req.url.split('/').pop()

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 })
    }

    const task = await db.collection('tasks').findOne({ _id: new ObjectId(id) })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...task,
      _id: task._id.toString(),
    })
  } catch (error: any) {
    console.error('Get task error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get task' }, { status: 500 })
  }
})

export const PUT = requireRole(['buyer'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const id = req.url.split('/').pop()
    const { task_title, task_detail, submission_info } = await req.json()

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 })
    }

    const task = await db.collection('tasks').findOne({ _id: new ObjectId(id) })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.buyer_email !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          task_title: task_title || task.task_title,
          task_detail: task_detail || task.task_detail,
          submission_info: submission_info || task.submission_info,
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update task error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update task' }, { status: 500 })
  }
})

export const DELETE = requireRole(['buyer', 'admin'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const id = req.url.split('/').pop()

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 })
    }

    const task = await db.collection('tasks').findOne({ _id: new ObjectId(id) })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check authorization
    if (user.role === 'buyer' && task.buyer_email !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Calculate refund amount for uncompleted tasks
    const pendingSubmissions = await db
      .collection('submissions')
      .countDocuments({ task_id: id, status: 'pending' })

    const completedWorkers = task.required_workers - (task.required_workers - pendingSubmissions)
    const refundAmount = (task.required_workers - completedWorkers) * task.payable_amount

    // Refund coins to buyer if task is deleted
    if (user.role === 'buyer' && refundAmount > 0) {
      await db.collection('users').updateOne(
        { email: task.buyer_email },
        { $inc: { coin: refundAmount } }
      )
    }

    // Delete task and related submissions
    await Promise.all([
      db.collection('tasks').deleteOne({ _id: new ObjectId(id) }),
      db.collection('submissions').deleteMany({ task_id: id }),
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete task error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete task' }, { status: 500 })
  }
})




