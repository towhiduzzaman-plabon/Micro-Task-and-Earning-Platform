'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Task } from '@/types'
import { FaCoins, FaUsers, FaCalendar, FaArrowLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getApiUrl } from '@/lib/api'

export default function TaskDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [submissionDetails, setSubmissionDetails] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTask()
    }
  }, [params.id])

  const fetchTask = async () => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl(`/api/tasks/${params.id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTask(data)
      } else {
        toast.error('Task not found')
        router.push('/dashboard/task-list')
      }
    } catch (error) {
      console.error('Error fetching task:', error)
      toast.error('Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submissionDetails.trim()) {
      toast.error('Please provide submission details')
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/submissions'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_id: params.id,
          submission_details: submissionDetails,
        }),
      })

      if (response.ok) {
        toast.success('Task submitted successfully!')
        router.push('/dashboard/my-submissions')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit task')
      }
    } catch (error) {
      console.error('Error submitting task:', error)
      toast.error('Failed to submit task')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!task) {
    return <div className="text-center py-12">Task not found</div>
  }

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-primary-600 hover:text-primary-700"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {task.task_image_url && (
          <img
            src={task.task_image_url}
            alt={task.task_title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-3xl font-bold mb-4">{task.task_title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <FaCoins className="mr-2 text-primary-600" />
            <span className="font-semibold">{task.payable_amount} Coins</span>
          </div>
          <div className="flex items-center">
            <FaUsers className="mr-2 text-primary-600" />
            <span>{task.required_workers} Workers Needed</span>
          </div>
          <div className="flex items-center">
            <FaCalendar className="mr-2 text-primary-600" />
            <span>Due: {new Date(task.completion_date).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Task Details</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{task.task_detail}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Submission Requirements</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{task.submission_info}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Submit Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission Details
            </label>
            <textarea
              value={submissionDetails}
              onChange={(e) => setSubmissionDetails(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder:text-black placeholder:opacity-70"
              rows={6}
              placeholder="Enter your submission details, proof, or screenshot URL..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting || task.required_workers === 0}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Task'}
          </button>
          {task.required_workers === 0 && (
            <p className="text-red-500 text-sm mt-2 text-center">This task is full</p>
          )}
        </form>
      </div>
    </div>
  )
}



