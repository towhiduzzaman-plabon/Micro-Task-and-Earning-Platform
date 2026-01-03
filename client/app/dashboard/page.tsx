'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { FaTasks, FaClock, FaCoins } from 'react-icons/fa'
import { getApiUrl } from '@/lib/api'

export default function DashboardHome() {
  const { userData } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    if (userData) {
      fetchStats()
    }
  }, [userData])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access-token')
      const endpoint =
        userData?.role === 'worker'
          ? '/api/dashboard/worker-stats'
          : userData?.role === 'buyer'
          ? '/api/dashboard/buyer-stats'
          : '/api/dashboard/admin-stats'

      const response = await fetch(getApiUrl(endpoint), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (userData.role === 'worker') {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Worker Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Submissions</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalSubmissions || 0}</p>
              </div>
              <FaTasks className="text-4xl text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending Submissions</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingSubmissions || 0}</p>
              </div>
              <FaClock className="text-4xl text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalEarnings || 0} Coins</p>
              </div>
              <FaCoins className="text-4xl text-green-600" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userData.role === 'buyer') {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Buyer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalTasks || 0}</p>
              </div>
              <FaTasks className="text-4xl text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks || 0}</p>
              </div>
              <FaClock className="text-4xl text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Payments</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalPayments || 0}</p>
              </div>
              <FaCoins className="text-4xl text-green-600" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userData.role === 'admin') {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Workers</p>
                <p className="text-3xl font-bold text-primary-600">{stats.totalWorkers || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Buyers</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalBuyers || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Coins</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalCoins || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Payments</p>
                <p className="text-3xl font-bold text-purple-600">${stats.totalPayments || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}




