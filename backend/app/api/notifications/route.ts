import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/middleware/auth'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()
    const notifications = await db
      .collection('notifications')
      .find({ toEmail: user.email })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    const formattedNotifications = notifications.map((n) => ({
      ...n,
      _id: n._id.toString(),
    }))

    return NextResponse.json(formattedNotifications)
  } catch (error: any) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get notifications' }, { status: 500 })
  }
})




