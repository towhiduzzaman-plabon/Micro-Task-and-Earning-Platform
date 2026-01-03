import admin from 'firebase-admin'
import path from 'path'
import fs from 'fs'

// Initialize Firebase Admin SDK
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
      console.log('✅ Firebase Admin SDK initialized from JSON file')
    } else {
      // Fallback to environment variables
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
      
      if (!projectId || !privateKey || !clientEmail) {
        console.warn('⚠️ Firebase Admin SDK credentials not found!')
        console.warn('Please either:')
        console.warn('1. Place the JSON file in backend root: micro-task-earning-platf-54f97-firebase-adminsdk-fbsvc-93877452b5.json')
        console.warn('2. Or set these in backend/.env.local:')
        console.warn('   - FIREBASE_ADMIN_PROJECT_ID')
        console.warn('   - FIREBASE_ADMIN_PRIVATE_KEY')
        console.warn('   - FIREBASE_ADMIN_CLIENT_EMAIL')
        console.warn('⚠️ Server-side authentication features will not work until Firebase Admin is configured!')
      } else {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: projectId,
            privateKey: privateKey,
            clientEmail: clientEmail,
          }),
        })
        console.log('✅ Firebase Admin SDK initialized from environment variables')
      }
    }
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization error:', error.message || error)
    console.error('Please check your Firebase Admin configuration')
  }
} else {
  console.log('✅ Firebase Admin SDK already initialized')
}

export default admin

