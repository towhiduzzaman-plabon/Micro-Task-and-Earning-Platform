'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { isFirebaseConfigured } from '@/lib/firebase'

export default function FirebaseBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('hideFirebaseBanner') === '1'
      setVisible(!isFirebaseConfigured && !dismissed)
    } catch (e) {
      setVisible(!isFirebaseConfigured)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="w-full bg-amber-100 border-t border-b border-amber-300 text-amber-900 py-2 px-4 text-sm flex items-center justify-between">
      <div>
        <strong className="font-semibold">Firebase not configured.</strong>{' '}
        Some features (auth, Google sign-in) are disabled. Set your
        <span className="font-medium"> NEXT_PUBLIC_FIREBASE_* </span>env variables in your Vercel project settings.
      </div>
      <div className="flex items-center space-x-2">
        <a
          href="https://vercel.com/docs/concepts/projects/environment-variables"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          How to set
        </a>
        <button
          onClick={() => {
            localStorage.setItem('hideFirebaseBanner', '1')
            setVisible(false)
          }}
          className="text-sm px-3 py-1 rounded bg-amber-200 hover:bg-amber-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
