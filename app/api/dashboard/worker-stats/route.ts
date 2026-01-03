import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/middleware/auth'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()

    const [totalSubmissions, pendingSubmissions, approvedSubmissions] = await Promise.all([
      db.collection('submissions').countDocuments({ worker_email: user.email }),
      db.collection('submissions').countDocuments({ worker_email: user.email, status: 'pending' }),
      db.collection('submissions')
        .find({ worker_email: user.email, status: 'approved' })
        .toArray(),
    ])

    const totalEarnings = approvedSubmissions.reduce(
      (sum, sub) => sum + (sub.payable_amount || 0),
      0
    )

    return NextResponse.json({
      totalSubmissions,
      pendingSubmissions,
      totalEarnings,
    })
  } catch (error: any) {
    console.error('Get worker stats error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get stats' }, { status: 500 })
  }
})




