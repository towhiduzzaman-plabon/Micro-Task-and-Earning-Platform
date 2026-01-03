import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth, requireRole } from '@/middleware/auth'
import { Withdrawal } from '@/types'

export const GET = requireAuth(async (req, user) => {
  try {
    const db = await getDatabase()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    let query: any = {}

    if (user.role === 'worker') {
      query.worker_email = user.email
    } else if (user.role === 'admin') {
      if (status) {
        query.status = status
      }
    }

    const withdrawals = await db
      .collection('withdrawals')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    const formattedWithdrawals = withdrawals.map((w) => ({
      ...w,
      _id: w._id.toString(),
    }))

    return NextResponse.json(formattedWithdrawals)
  } catch (error: any) {
    console.error('Get withdrawals error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get withdrawals' }, { status: 500 })
  }
})

export const POST = requireRole(['worker'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const { withdrawal_coin, payment_system, account_number } = await req.json()

    if (!withdrawal_coin || !payment_system || !account_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const coinAmount = parseFloat(withdrawal_coin)
    const withdrawalAmount = coinAmount / 20 // 20 coins = 1 dollar

    // Check minimum withdrawal (200 coins = 10 dollars)
    if (coinAmount < 200) {
      return NextResponse.json(
        { error: 'Minimum withdrawal is 200 coins (10 dollars)' },
        { status: 400 }
      )
    }

    // Check if user has enough coins
    if (user.coin < coinAmount) {
      return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 })
    }

    // Create withdrawal request
    const newWithdrawal = {
      worker_email: user.email,
      worker_name: user.name,
      withdrawal_coin: coinAmount,
      withdrawal_amount: withdrawalAmount,
      payment_system: payment_system,
      account_number: account_number,
      status: 'pending',
      withdraw_date: new Date(),
      createdAt: new Date(),
    }

    await db.collection('withdrawals').insertOne(newWithdrawal)

    // Create notification for admin
    await db.collection('notifications').insertOne({
      message: `${user.name} has requested a withdrawal of $${withdrawalAmount.toFixed(2)}`,
      toEmail: 'admin@example.com', // You can set admin email in env
      actionRoute: '/dashboard/withdraw-requests',
      createdAt: new Date(),
      read: false,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Create withdrawal error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create withdrawal' }, { status: 500 })
  }
})



