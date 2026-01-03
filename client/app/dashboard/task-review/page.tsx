'use client'

import { useEffect, useState } from 'react'
import { Submission } from '@/types'
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { getApiUrl } from '@/lib/api'

export default function TaskReviewPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/submissions?status=pending'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Filter by buyer email (should be done on backend)
        setSubmissions(data.submissions || data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl(`/api/submissions/${submissionId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'approve' }),
      })

      if (response.ok) {
        toast.success('Submission approved')
        fetchSubmissions()
        setSelectedSubmission(null)
      } else {
        toast.error('Failed to approve submission')
      }
    } catch (error) {
      console.error('Error approving submission:', error)
      toast.error('Failed to approve submission')
    }
  }

  const handleReject = async (submissionId: string) => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl(`/api/submissions/${submissionId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'reject' }),
      })

      if (response.ok) {
        toast.success('Submission rejected')
        fetchSubmissions()
        setSelectedSubmission(null)
      } else {
        toast.error('Failed to reject submission')
      }
    } catch (error) {
      console.error('Error rejecting submission:', error)
      toast.error('Failed to reject submission')
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
      <h1 className="text-3xl font-bold mb-8">Tasks To Review</h1>
      {submissions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No pending submissions</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Worker Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payable Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{submission.worker_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{submission.task_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{submission.payable_amount} Coins</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleApprove(submission._id!)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleReject(submission._id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTimes />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Submission Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Worker</p>
                <p className="font-semibold">{selectedSubmission.worker_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Task</p>
                <p className="font-semibold">{selectedSubmission.task_title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payable Amount</p>
                <p className="font-semibold">{selectedSubmission.payable_amount} Coins</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submission Details</p>
                <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {selectedSubmission.submission_details}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleApprove(selectedSubmission._id!)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <FaCheck className="mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(selectedSubmission._id!)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                  <FaTimes className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




