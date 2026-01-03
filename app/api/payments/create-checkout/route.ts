import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export const POST = requireAuth(async (req, user) => {
  try {
    const { coinAmount, amount } = await req.json()

    if (!coinAmount || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${coinAmount} Coins`,
              description: 'MicroTask Platform Coins',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/purchase-coin?success=true&coinAmount=${coinAmount}&amount=${amount}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/purchase-coin?canceled=true`,
      metadata: {
        buyer_email: user.email,
        coin_amount: coinAmount.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Create checkout error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create checkout' }, { status: 500 })
  }
})



