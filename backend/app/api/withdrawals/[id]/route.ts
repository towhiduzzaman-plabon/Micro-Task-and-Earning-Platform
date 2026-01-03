import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireRole } from '@/middleware/auth'
import { ObjectId } from 'mongodb'

export const PUT = requireRole(['admin'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const id = req.url.split('/').pop()
    const { action } = await req.json() // 'approve' or 'reject'

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid withdrawal ID' }, { status: 400 })
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "approve" or "reject"' }, { status: 400 })
    }

    const withdrawal = await db.collection('withdrawals').findOne({ _id: new ObjectId(id) })

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 400 })
    }

    const newStatus = action === 'approve' ? 'approved' : 'rejected'

    // Update withdrawal status
    await db.collection('withdrawals').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: newStatus } }
    )

    // Only decrease worker's coin if approved
    if (action === 'approve') {
      await db.collection('users').updateOne(
        { email: withdrawal.worker_email },
        { $inc: { coin: -withdrawal.withdrawal_coin } }
      )
    }

    // Create notification for worker
    const notificationMessage = action === 'approve'
      ? `Your withdrawal request of $${withdrawal.withdrawal_amount.toFixed(2)} has been approved`
      : `Your withdrawal request of $${withdrawal.withdrawal_amount.toFixed(2)} has been rejected`

    await db.collection('notifications').insertOne({
      message: notificationMessage,
      toEmail: withdrawal.worker_email,
      actionRoute: '/dashboard/withdrawals',
      createdAt: new Date(),
      read: false,
    })

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error: any) {
    console.error('Process withdrawal error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process withdrawal' }, { status: 500 })
  }
})



