import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_AUTHENTICATION_APP_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

// Initialize Firebase (only on client side)
if (typeof window !== 'undefined') {
  try {
    // Check if config is available
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      console.warn('⚠️ Firebase configuration is missing. Please check your .env.local file.')
      console.warn('Required variables: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID')
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
    console.error('Make sure all Firebase environment variables are set in .env.local')
  }
}

export { app, auth, db }

