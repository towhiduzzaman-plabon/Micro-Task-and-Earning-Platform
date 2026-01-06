import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

// Allow runtime injection via window.__FIREBASE_CONFIG__ when NEXT_PUBLIC_* env vars are not available at build-time
const envConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_AUTHENTICATION_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

// Initialize Firebase (only on client side)
if (typeof window !== 'undefined') {
  try {
    // Prefer envConfig if available, otherwise check for runtime-injected config
    const runtimeConfig = (window as any).__FIREBASE_CONFIG__ || {}
    const firebaseConfig = {
      apiKey: envConfig.apiKey || runtimeConfig.apiKey || '',
      authDomain: envConfig.authDomain || runtimeConfig.authDomain || '',
      projectId: envConfig.projectId || runtimeConfig.projectId || '',
      storageBucket: envConfig.storageBucket || runtimeConfig.storageBucket || '',
      messagingSenderId: envConfig.messagingSenderId || runtimeConfig.messagingSenderId || '',
      appId: envConfig.appId || runtimeConfig.appId || '',
    }

    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      console.warn('⚠️ Firebase configuration is missing. Please check your environment variables (NEXT_PUBLIC_FIREBASE_* or server FIREBASE_*).')
    } else {
      // Initialize Firebase if not already initialized
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig)
        console.log('✅ Firebase initialized successfully')
      } else {
        app = getApps()[0]
      }
      
      auth = getAuth(app)
      db = getFirestore(app)
    }
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error.message || error)
    console.error('Make sure all Firebase environment variables are set in .env.local or provided at runtime')
  }
}

export const isFirebaseConfigured = !!(envConfig.apiKey || (typeof window !== 'undefined' && !!(window as any).__FIREBASE_CONFIG__?.apiKey))

export { app, auth, db }

