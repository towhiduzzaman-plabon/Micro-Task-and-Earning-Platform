'use client'

import { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimesCircle, FaDollarSign, FaCoins } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface Withdrawal {
  _id: string
  worker_email: string
  worker_name: string
  withdrawal_coin: number
  withdrawal_amount: number
  payment_system: string
  account_number: string
  status: string
  createdAt: string
}

export default function WithdrawRequestsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch('/api/withdrawals?status=pending', {
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
      toast.error('Failed to load withdrawal requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (withdrawalId: string) => {
    if (!confirm('Are you sure you want to approve this withdrawal request?')) return

    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(`/api/withdrawals/${withdrawalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'approve' }),
      })

      if (response.ok) {
        toast.success('Withdrawal approved successfully')
        fetchWithdrawals()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to approve withdrawal')
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error)
      toast.error('Failed to approve withdrawal')
    }
  }

  const handleReject = async (withdrawalId: string) => {
    if (!confirm('Are you sure you want to reject this withdrawal request? The worker will keep their coins.')) return

    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(`/api/withdrawals/${withdrawalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'reject' }),
      })

      if (response.ok) {
        toast.success('Withdrawal rejected successfully')
        fetchWithdrawals()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to reject withdrawal')
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error)
      toast.error('Failed to reject withdrawal')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Withdraw Requests</h1>
      {withdrawals.length === 0 ? (
        <div className="text-center py-12 text-gray-700">No pending withdrawal requests</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Worker Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Withdrawal Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Coins
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Payment System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Account Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{withdrawal.worker_name}</div>
                    <div className="text-sm text-gray-700">{withdrawal.worker_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FaDollarSign className="mr-1" />
                      {withdrawal.withdrawal_amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <FaCoins className="mr-1" />
                      {withdrawal.withdrawal_coin}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{withdrawal.payment_system}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{withdrawal.account_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleApprove(withdrawal._id)}
                        className="text-green-600 hover:text-green-900 flex items-center px-3 py-1 rounded-md hover:bg-green-50 transition-colors"
                      >
                        <FaCheckCircle className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(withdrawal._id)}
                        className="text-red-600 hover:text-red-900 flex items-center px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <FaTimesCircle className="mr-2" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}



