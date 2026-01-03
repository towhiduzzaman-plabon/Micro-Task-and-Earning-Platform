'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AddTaskPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    task_title: '',
    task_detail: '',
    required_workers: '',
    payable_amount: '',
    completion_date: '',
    submission_info: '',
    task_image_url: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Task created successfully!')
        router.push('/dashboard/my-tasks')
      } else {
        const error = await response.json()
        if (error.error.includes('Insufficient coins')) {
          toast.error('Not enough coins. Please purchase coins first.')
          router.push('/dashboard/purchase-coin')
        } else {
          toast.error(error.error || 'Failed to create task')
        }
      }
    } catch (error) {
      console.error('Error creating task:', error)
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const totalPayable = parseFloat(formData.required_workers || '0') * parseFloat(formData.payable_amount || '0')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add New Task</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              name="task_title"
              value={formData.task_title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder:text-black placeholder:opacity-70"
              placeholder="e.g., Watch my YouTube video and make a comment"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Detail</label>
            <textarea
              name="task_detail"
              value={formData.task_detail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder:text-black placeholder:opacity-70"
              rows={4}
              placeholder="Detailed description of the task..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Workers</label>
              <input
                type="number"
                name="required_workers"
                value={formData.required_workers}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payable Amount (Coins per Worker)
              </label>
              <input
                type="number"
                name="payable_amount"
                value={formData.payable_amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {totalPayable > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Total Payable: <span className="font-bold">{totalPayable} Coins</span>
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Completion Date</label>
            <input
              type="date"
              name="completion_date"
              value={formData.completion_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Submission Info</label>
            <textarea
              name="submission_info"
              value={formData.submission_info}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder:text-black placeholder:opacity-70"
              rows={3}
              placeholder="What workers need to submit (e.g., screenshot, proof, comment link...)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Image URL</label>
            <input
              type="url"
              name="task_image_url"
              value={formData.task_image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-black placeholder:text-black placeholder:opacity-70"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating Task...' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  )
}



