import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth, requireRole } from '@/middleware/auth'
import { Submission } from '@/types'
import { ObjectId } from 'mongodb'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(req.url)
    const workerEmail = searchParams.get('workerEmail')
    const buyerEmail = searchParams.get('buyerEmail')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query: any = {}

    if (user.role === 'worker') {
      query.worker_email = user.email
    } else if (user.role === 'buyer') {
      query.buyer_email = user.email
    }

    if (workerEmail) {
      query.worker_email = workerEmail
    }
    if (buyerEmail) {
      query.buyer_email = buyerEmail
    }
    if (status) {
      query.status = status
    }

    const skip = (page - 1) * limit

    const [submissions, total] = await Promise.all([
      db
        .collection('submissions')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('submissions').countDocuments(query),
    ])

    const formattedSubmissions = submissions.map((sub) => ({
      ...sub,
      _id: sub._id.toString(),
    }))

    return NextResponse.json({
      submissions: formattedSubmissions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: any) {
    console.error('Get submissions error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get submissions' }, { status: 500 })
  }
})

export const POST = requireRole(['worker'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const { task_id, submission_details } = await req.json()

    if (!task_id || !submission_details) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get task details
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(task_id) })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.required_workers <= 0) {
      return NextResponse.json({ error: 'Task is full' }, { status: 400 })
    }

    // Check if user already submitted
    const existingSubmission = await db
      .collection('submissions')
      .findOne({ task_id, worker_email: user.email })

    if (existingSubmission) {
      return NextResponse.json({ error: 'You have already submitted this task' }, { status: 400 })
    }

    // Create submission
    const newSubmission = {
      task_id,
      task_title: task.task_title,
      payable_amount: task.payable_amount,
      worker_email: user.email,
      worker_name: user.name,
      buyer_name: task.buyer_name,
      buyer_email: task.buyer_email,
      submission_details,
      status: 'pending',
      createdAt: new Date(),
    }

    await db.collection('submissions').insertOne(newSubmission)

    // Decrease required workers
    await db.collection('tasks').updateOne(
      { _id: new ObjectId(task_id) },
      { $inc: { required_workers: -1 } }
    )

    // Create notification for buyer
    await db.collection('notifications').insertOne({
      message: `${user.name} has submitted a task: ${task.task_title}`,
      toEmail: task.buyer_email,
      actionRoute: '/dashboard/task-review',
      createdAt: new Date(),
      read: false,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Create submission error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create submission' }, { status: 500 })
  }
})



