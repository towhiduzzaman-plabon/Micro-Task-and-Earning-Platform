import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const workers = await db
      .collection('users')
      .find({ role: 'worker' })
      .sort({ coin: -1 })
      .limit(6)
      .toArray()

    const formattedWorkers = workers.map((worker) => ({
      _id: worker._id.toString(),
      name: worker.name,
      photoURL: worker.photoURL,
      coin: worker.coin || 0,
    }))

    return NextResponse.json(formattedWorkers)
  } catch (error: any) {
    console.error('Get best workers error:', error)
    // Return empty array instead of error to prevent page crash
    return NextResponse.json([])
  }
}



