'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getApiUrl } from '@/lib/api'
import { FaGoogle, FaUser, FaEnvelope, FaLock, FaImage, FaUserTag, FaEye, FaEyeSlash } from 'react-icons/fa'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photoURL: '',
    role: 'worker' as 'worker' | 'buyer',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePassword = (password: string) => {
    // At least 6 characters, one uppercase, one lowercase, one number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
    return re.test(password)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Name is required' }))
      return
    }

    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }))
      return
    }

    if (!validatePassword(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 6 characters with uppercase, lowercase, and number',
      }))
      return
    }

    setLoading(true)

    try {
      // Create Firebase user
      if (!auth) {
        toast.error('Firebase is not initialized. Please check your configuration.')
        setLoading(false)
        return
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      // Update profile with name and photo
      if (formData.photoURL || formData.name) {
        await updateProfile(userCredential.user, {
          displayName: formData.name,
          photoURL: formData.photoURL || undefined,
        })
      }

      // Get token
      const token = await userCredential.user.getIdToken()
      localStorage.setItem('access-token', token)

      // Register user in database
      const response = await axios.post(
        getApiUrl('/api/auth/register'),
        {
          email: formData.email,
          name: formData.name,
          photoURL: formData.photoURL || userCredential.user.photoURL,
          role: formData.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        const userData = response.data.user
        const coinsReceived = userData?.coin || (formData.role === 'buyer' ? 50 : 10)
        toast.success(`Registration successful! You received ${coinsReceived} coins!`)
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      if (error.code === 'auth/email-already-in-use') {
        setErrors((prev) => ({ ...prev, email: 'Email already exists' }))
        toast.error('Email already exists')
      } else {
        toast.error('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      if (!auth) {
        toast.error('Firebase is not initialized. Please check your configuration.')
        setLoading(false)
        return
      }
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const token = await result.user.getIdToken()
      localStorage.setItem('access-token', token)

      // Register user in database
      const response = await axios.post(
        getApiUrl('/api/auth/register'),
        {
          email: result.user.email,
          name: result.user.displayName || 'User',
          photoURL: result.user.photoURL || '',
          role: 'worker', // Default role for Google sign-up
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        const userData = response.data.user
        const coinsReceived = userData?.coin || 10 // Google sign-up defaults to worker (10 coins)
        toast.success(`Registration successful! You received ${coinsReceived} coins!`)
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Google sign-up error:', error)
      toast.error('Google sign-up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join us and start earning or posting tasks today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <FaUser className="inline mr-2 text-primary-600" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-black placeholder:text-black placeholder:opacity-70"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.name}
              </p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <FaEnvelope className="inline mr-2 text-primary-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-black placeholder:text-black placeholder:opacity-70"
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.email}
              </p>}
            </div>

            {/* Profile Picture URL Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <FaImage className="inline mr-2 text-primary-600" />
                Profile Picture URL <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-black placeholder:text-black placeholder:opacity-70"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use default avatar</p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <FaLock className="inline mr-2 text-primary-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none pr-12 text-black placeholder:text-black placeholder:opacity-70"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span> {errors.password}
              </p>}
              <p className="text-xs text-gray-500 mt-1">Must contain uppercase, lowercase, and number (min 6 characters)</p>
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <FaUserTag className="inline mr-2 text-primary-600" />
                I want to
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none bg-white text-black font-medium"
              >
                <option value="worker" className="text-black">Worker</option>
                <option value="buyer" className="text-black">Buyer</option>
              </select>
              <div className="mt-2 p-3 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-sm text-gray-800 font-medium">
                  {formData.role === 'worker' ? (
                    <>
                      <span className="text-primary-700 font-semibold">👷 Worker:</span> You&apos;ll receive <span className="font-bold text-primary-600">10 coins</span> to start completing tasks and earning money!
                    </>
                  ) : (
                    <>
                      <span className="text-primary-700 font-semibold">🛒 Buyer:</span> You&apos;ll receive <span className="font-bold text-primary-600">50 coins</span> to post tasks and get work done!
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <FaGoogle className="w-5 h-5 mr-3 text-[#4285F4]" />
              <span className="font-semibold text-gray-700">Sign up with Google</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors">
              Sign in here
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}



