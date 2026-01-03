import admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'

if (!admin.apps.length) {
  try {
    // Try to load from JSON file first (if exists)
    const jsonFilePath = path.join(process.cwd(), 'micro-task-earning-platf-54f97-firebase-adminsdk-fbsvc-93877452b5.json')
    
    if (fs.existsSync(jsonFilePath)) {
      // Load from JSON file
      const serviceAccount = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
      console.log('Firebase Admin SDK initialized from JSON file')
    } else {
      // Fallback to environment variables
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
      
      if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !privateKey || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        console.warn('Firebase Admin SDK credentials not found. Some server-side features may not work.')
        console.warn('Please either:')
        console.warn('1. Place the JSON file in the project root: micro-task-earning-platf-54f97-firebase-adminsdk-fbsvc-93877452b5.json')
        console.warn('2. Or set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_PRIVATE_KEY, and FIREBASE_ADMIN_CLIENT_EMAIL in .env.local')
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            privateKey: privateKey,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          }),
        })
        console.log('Firebase Admin SDK initialized from environment variables')
      }
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error)
  }
}

export default admin

