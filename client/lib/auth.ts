import { auth } from './firebase'
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { User } from '@/types'
import { getApiUrl } from './api'

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    if (!auth) {
      console.warn('⚠️ Firebase auth is not initialized. Please check your .env.local configuration.')
      setLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken()
          localStorage.setItem('access-token', token)
          
          // Fetch user data from database
          const response = await fetch(getApiUrl('/api/users/me'), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const data = await response.json()
            setUserData(data)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      } else {
        localStorage.removeItem('access-token')
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, userData, loading }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access-token')
  }
  return null
}

