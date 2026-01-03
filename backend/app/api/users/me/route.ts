import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import admin from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = await admin.auth().verifyIdToken(token)
    const db = await getDatabase()
    const user = await db.collection('users').findOne({ email: decodedToken.email })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove _id and convert to plain object
    const { _id, ...userData } = user
    return NextResponse.json({ ...userData, _id: _id.toString() })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get user' }, { status: 500 })
  }
}




