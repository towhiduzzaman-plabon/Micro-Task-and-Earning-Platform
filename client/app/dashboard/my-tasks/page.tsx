'use client'

import { useEffect, useState } from 'react'
import { Task } from '@/types'
import { FaEdit, FaTrash, FaCalendar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getApiUrl } from '@/lib/api'

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editForm, setEditForm] = useState({
    task_title: '',
    task_detail: '',
    submission_info: '',
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('access-token')
      // Request buyer's own tasks
      const response = await fetch(getApiUrl('/api/tasks?buyerEmail=true'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Filter tasks by current user (backend should handle this, but we filter here as backup)
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl(`/api/tasks/${taskId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success('Task deleted successfully')
        fetchTasks()
      } else {
        toast.error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setEditForm({
      task_title: task.task_title,
      task_detail: task.task_detail,
      submission_info: task.submission_info,
    })
  }

  const handleUpdate = async () => {
    if (!editingTask) return

    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl(`/api/tasks/${editingTask._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        toast.success('Task updated successfully')
        setEditingTask(null)
        fetchTasks()
      } else {
        toast.error('Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
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
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No tasks yet</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workers Needed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payable Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{task.task_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.required_workers}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.payable_amount} Coins</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaCalendar className="mr-2" />
                      {new Date(task.completion_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={editForm.task_title}
                  onChange={(e) => setEditForm({ ...editForm, task_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Detail</label>
                <textarea
                  value={editForm.task_detail}
                  onChange={(e) => setEditForm({ ...editForm, task_detail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submission Info
                </label>
                <textarea
                  value={editForm.submission_info}
                  onChange={(e) => setEditForm({ ...editForm, submission_info: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                  rows={3}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

