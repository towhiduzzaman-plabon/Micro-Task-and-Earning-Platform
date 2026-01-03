import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/middleware/auth'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()

    const [users, payments] = await Promise.all([
      db.collection('users').find({}).toArray(),
      db.collection('payments').find({}).toArray(),
    ])

    const totalWorkers = users.filter((u) => u.role === 'worker').length
    const totalBuyers = users.filter((u) => u.role === 'buyer').length
    const totalCoins = users.reduce((sum, u) => sum + (u.coin || 0), 0)
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0)

    return NextResponse.json({
      totalWorkers,
      totalBuyers,
      totalCoins,
      totalPayments,
    })
  } catch (error: any) {
    console.error('Get admin stats error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get stats' }, { status: 500 })
  }
})




