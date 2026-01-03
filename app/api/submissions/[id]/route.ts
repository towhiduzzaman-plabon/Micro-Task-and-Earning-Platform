import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth, requireRole } from '@/middleware/auth'
import { ObjectId } from 'mongodb'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()
    const id = req.url.split('/').pop()

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    const submission = await db.collection('submissions').findOne({ _id: new ObjectId(id) })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...submission,
      _id: submission._id.toString(),
    })
  } catch (error: any) {
    console.error('Get submission error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get submission' }, { status: 500 })
  }
})

export const PUT = requireRole(['buyer'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const id = req.url.split('/').pop()
    const { action } = await req.json() // 'approve' or 'reject'

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid submission ID' }, { status: 400 })
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const submission = await db.collection('submissions').findOne({ _id: new ObjectId(id) })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (submission.buyer_email !== user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (action === 'approve') {
      // Update submission status
      await db.collection('submissions').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'approved' } }
      )

      // Increase worker's coin
      await db.collection('users').updateOne(
        { email: submission.worker_email },
        { $inc: { coin: submission.payable_amount } }
      )

      // Create notification for worker
      await db.collection('notifications').insertOne({
        message: `You have earned ${submission.payable_amount} coins from ${user.name} for completing ${submission.task_title}`,
        toEmail: submission.worker_email,
        actionRoute: '/dashboard/my-submissions',
        createdAt: new Date(),
        read: false,
      })
    } else if (action === 'reject') {
      // Update submission status
      await db.collection('submissions').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'rejected' } }
      )

      // Increase required workers for the task
      await db.collection('tasks').updateOne(
        { _id: new ObjectId(submission.task_id) },
        { $inc: { required_workers: 1 } }
      )

      // Create notification for worker
      await db.collection('notifications').insertOne({
        message: `Your submission for ${submission.task_title} has been rejected by ${user.name}`,
        toEmail: submission.worker_email,
        actionRoute: '/dashboard/my-submissions',
        createdAt: new Date(),
        read: false,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update submission error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update submission' }, { status: 500 })
  }
})




