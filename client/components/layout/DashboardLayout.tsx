'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { getApiUrl } from '@/lib/api'
import { FaHome, FaTasks, FaPlusCircle, FaUsers, FaCoins, FaHistory, FaSignOutAlt, FaBell, FaBars, FaTimes } from 'react-icons/fa'
import { UserRole } from '@/types'
import Logo from './Logo'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  roles: UserRole[]
}

const navigation: NavItem[] = [
  { name: 'Home', href: '/dashboard', icon: <FaHome />, roles: ['worker', 'buyer', 'admin'] },
  { name: 'Task List', href: '/dashboard/task-list', icon: <FaTasks />, roles: ['worker'] },
  { name: 'Approved Submissions', href: '/dashboard/approved-submissions', icon: <FaTasks />, roles: ['worker'] },
  { name: 'My Submissions', href: '/dashboard/my-submissions', icon: <FaTasks />, roles: ['worker'] },
  { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: <FaCoins />, roles: ['worker'] },
  { name: 'Add New Tasks', href: '/dashboard/add-task', icon: <FaPlusCircle />, roles: ['buyer'] },
  { name: "My Task's", href: '/dashboard/my-tasks', icon: <FaTasks />, roles: ['buyer'] },
  { name: 'Task To Review', href: '/dashboard/task-review', icon: <FaTasks />, roles: ['buyer'] },
  { name: 'Purchase Coin', href: '/dashboard/purchase-coin', icon: <FaCoins />, roles: ['buyer'] },
  { name: 'Payment History', href: '/dashboard/payment-history', icon: <FaHistory />, roles: ['buyer'] },
  { name: 'Manage Users', href: '/dashboard/manage-users', icon: <FaUsers />, roles: ['admin'] },
  { name: 'Manage Tasks', href: '/dashboard/manage-tasks', icon: <FaTasks />, roles: ['admin'] },
  { name: 'Withdraw Requests', href: '/dashboard/withdraw-requests', icon: <FaCoins />, roles: ['admin'] },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showNotifications && !target.closest('.notification-popup') && !target.closest('button')) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (userData?.email) {
      fetchNotifications()
    }
  }, [userData])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access-token')
      const response = await fetch(getApiUrl('/api/notifications'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('access-token')
      await fetch(getApiUrl(`/api/notifications/${notificationId}`), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      fetchNotifications() // Refresh notifications
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth)
      }
      localStorage.removeItem('access-token')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || !userData) {
    return null
  }

  const filteredNav = navigation.filter((item) => item.roles.includes(userData.role))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-md lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-primary-600"
              >
                <FaBell className="text-xl" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="notification-popup absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-lg">Notifications</h3>
                      {notifications.filter((n) => !n.read).length > 0 && (
                        <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                          {notifications.filter((n) => !n.read).length} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-gray-700 text-center text-sm">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 hover:bg-primary-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-blue-50 border-l-4 border-primary-600' : 'bg-white'
                          }`}
                          onClick={() => {
                            if (!notif.read) {
                              markAsRead(notif._id)
                            }
                            router.push(notif.actionRoute)
                            setShowNotifications(false)
                          }}
                        >
                          <p className="text-sm text-gray-900 font-medium leading-relaxed">{notif.message}</p>
                          <p className="text-xs text-gray-600 mt-2">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {filteredNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                          isActive
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <header className="bg-white shadow-md hidden lg:block">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <Logo />
                </Link>
                <div className="flex items-center space-x-2">
                  <FaCoins className="text-primary-600 text-xl" />
                  <span className="font-semibold text-gray-700">
                    Available Coin: <span className="text-primary-600">{userData.coin}</span>
                  </span>
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">{userData.role.toUpperCase()}</span> |{' '}
                  <span>{userData.name}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt={userData.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    {userData.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-primary-600"
                  >
                    <FaBell className="text-xl" />
                    {notifications.filter((n) => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="notification-popup absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-200">
                      <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 text-lg">Notifications</h3>
                          {notifications.filter((n) => !n.read).length > 0 && (
                            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                              {notifications.filter((n) => !n.read).length} new
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-gray-700 text-center text-sm">No notifications</div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className={`p-4 hover:bg-primary-50 cursor-pointer transition-colors ${
                                !notif.read ? 'bg-blue-50 border-l-4 border-primary-600' : 'bg-white'
                              }`}
                              onClick={() => {
                                if (!notif.read) {
                                  markAsRead(notif._id)
                                }
                                router.push(notif.actionRoute)
                                setShowNotifications(false)
                              }}
                            >
                              <p className="text-sm text-gray-900 font-medium leading-relaxed">{notif.message}</p>
                              <p className="text-xs text-gray-600 mt-2">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

