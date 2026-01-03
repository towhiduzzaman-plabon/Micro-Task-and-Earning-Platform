'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { FaUser, FaSignOutAlt, FaCoins } from 'react-icons/fa'
import Logo from './Logo'

export default function Navbar() {
  const { user, userData } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition">
                  Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-primary-600 transition">
                  Register
                </Link>
                <a
                  href="https://github.com/yourusername/microtask-client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Join as Developer
                </a>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                  Dashboard
                </Link>
                {userData && (
                  <div className="flex items-center space-x-2 text-primary-600">
                    <FaCoins className="text-lg" />
                    <span className="font-semibold">{userData.coin} Coins</span>
                  </div>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition">
                    {userData?.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt={userData.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <FaUser className="text-lg" />
                    )}
                    <span className="hidden lg:block">{userData?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
                <a
                  href="https://github.com/yourusername/microtask-client"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Join as Developer
                </a>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            {!user ? (
              <>
                <Link href="/login" className="block py-2 text-gray-700">Login</Link>
                <Link href="/register" className="block py-2 text-gray-700">Register</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-700">Dashboard</Link>
                <button onClick={handleLogout} className="block py-2 text-gray-700 w-full text-left">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

