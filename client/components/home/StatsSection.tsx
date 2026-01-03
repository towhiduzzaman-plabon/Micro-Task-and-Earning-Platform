'use client'

import { useEffect, useState } from 'react'
import { FaUsers, FaTasks, FaCoins, FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { getApiUrl } from '@/lib/api'

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalCoins: 0,
    completedTasks: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(getApiUrl('/api/stats'))
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    // Set default values if API fails
      setStats({
        totalUsers: 1250,
        totalTasks: 3500,
        totalCoins: 50000,
        completedTasks: 2800,
      })
    }
  }

  const statItems = [
    { icon: <FaUsers />, value: stats.totalUsers, label: 'Active Users' },
    { icon: <FaTasks />, value: stats.totalTasks, label: 'Total Tasks' },
    { icon: <FaCoins />, value: stats.totalCoins, label: 'Coins Distributed' },
    { icon: <FaCheckCircle />, value: stats.completedTasks, label: 'Completed Tasks' },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4 flex justify-center">{item.icon}</div>
              <div className="text-4xl font-bold mb-2">{item.value.toLocaleString()}</div>
              <div className="text-xl opacity-90">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}




