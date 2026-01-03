import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth } from '@/middleware/auth'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()

    const [tasks, payments] = await Promise.all([
      db.collection('tasks').find({ buyer_email: user.email }).toArray(),
      db.collection('payments').find({ buyer_email: user.email }).toArray(),
    ])

    const totalTasks = tasks.length
    const pendingTasks = tasks.reduce((sum, task) => sum + (task.required_workers || 0), 0)
    const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount_paid || 0), 0)

    return NextResponse.json({
      totalTasks,
      pendingTasks,
      totalPayments,
    })
  } catch (error: any) {
    console.error('Get buyer stats error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get stats' }, { status: 500 })
  }
})




