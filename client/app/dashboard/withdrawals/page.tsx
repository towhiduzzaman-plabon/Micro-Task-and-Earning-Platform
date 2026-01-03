'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { FaCoins, FaDollarSign } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getApiUrl } from '@/lib/api'

export default function WithdrawalsPage() {
  const { userData } = useAuth()
  const [withdrawalCoin, setWithdrawalCoin] = useState('')
  const [paymentSystem, setPaymentSystem] = useState('stripe')
  const [accountNumber, setAccountNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [withdrawals, setWithdrawals] = useState<any[]>([])

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/withdrawals'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setWithdrawals(data)
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
    }
  }

  const calculateWithdrawalAmount = (coins: string) => {
    if (!coins || isNaN(parseFloat(coins))) return 0
    return parseFloat(coins) / 20 // 20 coins = 1 dollar
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const coinAmount = parseFloat(withdrawalCoin)
    const withdrawalAmount = calculateWithdrawalAmount(withdrawalCoin)

    if (coinAmount < 200) {
      toast.error('Minimum withdrawal is 200 coins (10 dollars)')
      return
    }

    if (!userData || userData.coin < coinAmount) {
      toast.error('Insufficient coins')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/withdrawals'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          withdrawal_coin: coinAmount,
          payment_system: paymentSystem,
          account_number: accountNumber,
        }),
      })

      if (response.ok) {
        toast.success('Withdrawal request submitted successfully!')
        setWithdrawalCoin('')
        setAccountNumber('')
        fetchWithdrawals()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit withdrawal')
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error)
      toast.error('Failed to submit withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const totalEarnings = userData.coin
  const withdrawalAmount = calculateWithdrawalAmount(withdrawalCoin)
  const canWithdraw = totalEarnings >= 200

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Withdrawals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Withdrawal Information</h2>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaCoins className="text-primary-600 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-xl font-bold">{totalEarnings} Coins</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaDollarSign className="text-green-600 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Withdrawal Amount</p>
                  <p className="text-xl font-bold">
                    ${(totalEarnings / 20).toFixed(2)} (20 coins = $1)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!canWithdraw ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                You need at least 200 coins (10 dollars) to withdraw.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coins to Withdraw
                </label>
                <input
                  type="number"
                  value={withdrawalCoin}
                  onChange={(e) => setWithdrawalCoin(e.target.value)}
                  min="200"
                  max={totalEarnings}
                  placeholder="Enter coins to withdraw (min 200)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder:text-black placeholder:opacity-70"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Withdrawal Amount ($)
                </label>
                <input
                  type="number"
                  value={withdrawalAmount.toFixed(2)}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment System
                </label>
                <select
                  value={paymentSystem}
                  onChange={(e) => setPaymentSystem(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black bg-white"
                >
                  <option value="stripe" className="text-black">Stripe</option>
                  <option value="bkash" className="text-black">Bkash</option>
                  <option value="rocket" className="text-black">Rocket</option>
                  <option value="nagad" className="text-black">Nagad</option>
                  <option value="other" className="text-black">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder:text-black placeholder:opacity-70"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Request Withdrawal'}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Withdrawal History</h2>
          {withdrawals.length === 0 ? (
            <div className="text-center py-8 text-gray-700">No withdrawal requests yet</div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                    <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">${withdrawal.withdrawal_amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-700">{withdrawal.withdrawal_coin} Coins</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        withdrawal.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : withdrawal.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">Payment: {withdrawal.payment_system}</p>
                  <p className="text-sm text-gray-900">
                    Date: {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



