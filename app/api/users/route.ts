import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireRole } from '@/middleware/auth'
import { ObjectId } from 'mongodb'

export const GET = requireRole(['admin'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const users = await db.collection('users').find({}).toArray()

    const formattedUsers = users.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }))

    return NextResponse.json(formattedUsers)
  } catch (error: any) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get users' }, { status: 500 })
  }
})

export const PUT = requireRole(['admin'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const { userId, role } = await req.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['worker', 'buyer', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 })
  }
})

export const DELETE = requireRole(['admin'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    await db.collection('users').deleteOne({ _id: new ObjectId(userId) })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 })
  }
})




