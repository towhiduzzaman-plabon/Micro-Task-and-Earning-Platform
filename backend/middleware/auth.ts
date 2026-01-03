import { NextRequest, NextResponse } from 'next/server'
import admin from '@/lib/firebase-admin'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/types'

export async function verifyToken(token: string): Promise<User | null> {
  try {
    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      console.error('❌ Firebase Admin is not initialized. Please configure Firebase Admin credentials.')
      return null
    }

    const decodedToken = await admin.auth().verifyIdToken(token)
    const db = await getDatabase()
    const user = await db.collection('users').findOne({ email: decodedToken.email })
    return user as User | null
  } catch (error: any) {
    console.error('❌ Token verification error:', error.message || error)
    if (error.code === 'auth/argument-error') {
      console.error('Invalid token format or Firebase Admin not properly configured')
    }
    return null
  }
}

export function requireAuth(handler: (req: NextRequest, user: User) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, user)
  }
}

export function requireRole(roles: string[]) {
  return (handler: (req: NextRequest, user: User) => Promise<NextResponse>) => {
    return requireAuth(async (req, user) => {
      if (!roles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return handler(req, user)
    })
  }
}




