import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/middleware/auth'
import { ObjectId } from 'mongodb'

export const PUT = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()
    const id = req.url.split('/').pop()

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 })
    }

    await db.collection('notifications').updateOne(
      { _id: new ObjectId(id), toEmail: user.email },
      { $set: { read: true } }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json({ error: error.message || 'Failed to mark notification as read' }, { status: 500 })
  }
})


