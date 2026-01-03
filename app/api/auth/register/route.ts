import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import admin from '@/lib/firebase-admin'
import { User } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedToken = await admin.auth().verifyIdToken(token)
    const { email, name, photoURL, role } = await req.json()

    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['worker', 'buyer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const db = await getDatabase()
    const existingUser = await db.collection('users').findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Assign coins based on role
    const initialCoins = role === 'worker' ? 10 : 50

    const newUser = {
      email,
      name,
      photoURL: photoURL || '',
      role: role as 'worker' | 'buyer',
      coin: initialCoins,
      createdAt: new Date(),
    }

    await db.collection('users').insertOne(newUser)

    console.log(`✅ User registered: ${name} (${email}) as ${role} with ${initialCoins} coins`)

    return NextResponse.json({ success: true, user: newUser })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 })
  }
}



