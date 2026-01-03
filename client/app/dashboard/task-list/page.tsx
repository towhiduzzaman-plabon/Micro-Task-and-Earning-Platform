'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task } from '@/types'
import { FaEye, FaCoins, FaUsers, FaCalendar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getApiUrl } from '@/lib/api'

export default function TaskListPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/tasks?requiredWorkers=true'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTasks(data.filter((task: Task) => task.required_workers > 0))
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
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
      <h1 className="text-3xl font-bold mb-8">Available Tasks</h1>
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No tasks available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {task.task_image_url && (
                <img
                  src={task.task_image_url}
                  alt={task.task_title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{task.task_title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{task.task_detail}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCoins className="mr-2 text-primary-600" />
                    <span>{task.payable_amount} Coins</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2 text-primary-600" />
                    <span>{task.required_workers} Workers Needed</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendar className="mr-2 text-primary-600" />
                    <span>{new Date(task.completion_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/dashboard/task-details/${task._id}`)}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center"
                >
                  <FaEye className="mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}




