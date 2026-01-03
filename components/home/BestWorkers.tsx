'use client'

import { useEffect, useState } from 'react'
import { User } from '@/types'
import { FaCoins } from 'react-icons/fa'

export default function BestWorkers() {
  const [workers, setWorkers] = useState<User[]>([])

  useEffect(() => {
    fetchBestWorkers()
  }, [])

  const fetchBestWorkers = async () => {
    try {
      const response = await fetch('/api/users/best-workers')
      if (response.ok) {
        const data = await response.json()
        setWorkers(data)
      }
    } catch (error) {
      console.error('Error fetching best workers:', error)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Top Workers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No workers yet</div>
          ) : (
            workers.map((worker) => (
              <div
                key={worker._id}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition"
              >
                <div className="mb-4">
                  {worker.photoURL ? (
                    <img
                      src={worker.photoURL}
                      alt={worker.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                      {worker.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{worker.name}</h3>
                <div className="flex items-center justify-center space-x-2 text-primary-600">
                  <FaCoins />
                  <span className="font-bold">{worker.coin} Coins</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}




