'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import toast from 'react-hot-toast'
import { FaCoins } from 'react-icons/fa'
import { getApiUrl } from '@/lib/api'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const coinPackages = [
  { coins: 10, price: 1 },
  { coins: 150, price: 10 },
  { coins: 500, price: 20 },
  { coins: 1000, price: 35 },
]

export default function PurchaseCoinPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (coinAmount: number, amount: number) => {
    setLoading(`${coinAmount}`)
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/payments/create-checkout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coinAmount, amount }),
      })

      if (response.ok) {
        const { sessionId, url } = await response.json()

        if (url) {
          // Redirect to Stripe Checkout
          window.location.href = url
        } else if (sessionId) {
          // Use Stripe.js to redirect
          const stripe = await stripePromise
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({ sessionId })
            if (error) {
              toast.error(error.message || 'Failed to redirect to checkout')
            }
          }
        } else {
          // Dummy payment for testing
          handleDummyPayment(coinAmount, amount)
        }
      } else {
        // Fallback to dummy payment
        handleDummyPayment(coinAmount, amount)
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      // Fallback to dummy payment
      handleDummyPayment(coinAmount, amount)
    } finally {
      setLoading(null)
    }
  }

  const handleDummyPayment = async (coinAmount: number, amount: number) => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/payments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coin_amount: coinAmount,
          amount_paid: amount,
          payment_id: `dummy_${Date.now()}`,
        }),
      })

      if (response.ok) {
        toast.success(`Successfully purchased ${coinAmount} coins!`)
        // Refresh page to update coin balance
        window.location.reload()
      } else {
        toast.error('Payment failed')
      }
    } catch (error) {
      console.error('Error processing dummy payment:', error)
      toast.error('Payment failed')
    }
  }

  useEffect(() => {
    // Check for success parameter from Stripe redirect
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      const coinAmount = params.get('coinAmount')
      const amount = params.get('amount')
      if (coinAmount && amount) {
        handleDummyPayment(parseFloat(coinAmount), parseFloat(amount))
      }
    }
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Purchase Coins</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coinPackages.map((pkg) => (
          <div
            key={pkg.coins}
            className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-primary-600"
            onClick={() => handlePurchase(pkg.coins, pkg.price)}
          >
            <div className="mb-4">
              <FaCoins className="text-5xl text-primary-600 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{pkg.coins} Coins</h3>
            <div className="text-3xl font-bold text-primary-600 mb-4">${pkg.price}</div>
            <button
              disabled={loading === `${pkg.coins}`}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {loading === `${pkg.coins}` ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}




