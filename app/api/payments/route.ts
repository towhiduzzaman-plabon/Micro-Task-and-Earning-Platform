import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { requireAuth, requireRole } from '@/middleware/auth'
import { Payment } from '@/types'

export const GET = requireRole(['buyer'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const payments = await db
      .collection('payments')
      .find({ buyer_email: user.email })
      .sort({ createdAt: -1 })
      .toArray()

    const formattedPayments = payments.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }))

    return NextResponse.json(formattedPayments)
  } catch (error: any) {
    console.error('Get payments error:', error)
    return NextResponse.json({ error: error.message || 'Failed to get payments' }, { status: 500 })
  }
})

export const POST = requireRole(['buyer'])(async (req, user) => {
  try {
    const db = await getDatabase()
    const { coin_amount, amount_paid, payment_id } = await req.json()

    if (!coin_amount || !amount_paid || !payment_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create payment record
    const newPayment = {
      buyer_email: user.email,
      buyer_name: user.name,
      coin_amount: parseFloat(coin_amount),
      amount_paid: parseFloat(amount_paid),
      payment_id: payment_id,
      createdAt: new Date(),
    }

    await db.collection('payments').insertOne(newPayment)

    // Increase buyer's coin
    await db.collection('users').updateOne(
      { email: user.email },
      { $inc: { coin: parseFloat(coin_amount) } }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Create payment error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create payment' }, { status: 500 })
  }
})



