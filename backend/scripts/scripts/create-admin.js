const { MongoClient, ServerApiVersion } = require('mongodb')
const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const jsonFilePath = path.join(process.cwd(), 'micro-task-earning-platf-54f97-firebase-adminsdk-fbsvc-93877452b5.json')
    
    if (fs.existsSync(jsonFilePath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'))
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
      console.log('✅ Firebase Admin SDK initialized from JSON file')
    } else {
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
      
      if (process.env.FIREBASE_ADMIN_PROJECT_ID && privateKey && process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            privateKey: privateKey,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          }),
        })
        console.log('✅ Firebase Admin SDK initialized from environment variables')
      } else {
        console.error('❌ Firebase Admin SDK credentials not found')
        process.exit(1)
      }
    }
  } catch (error) {
    console.error('❌ Firebase admin initialization error:', error)
    process.exit(1)
  }
}

const uri = process.env.MONGODB_URI || 'mongodb+srv://micro_DBuser:dbUser1234@cluster0.tre4bde.mongodb.net/microtask-platform?retryWrites=true&w=majority'

async function createAdmin() {
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  })

  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db('microtask-platform')
    
    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ role: 'admin' })
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:')
      console.log('   Email:', existingAdmin.email)
      console.log('   Name:', existingAdmin.name)
      return
    }

    // Admin credentials
    const adminEmail = 'admin@microtask.com'
    const adminPassword = 'Admin@123456'
    const adminName = 'Admin User'

    // Create Firebase user
    let firebaseUser
    try {
      firebaseUser = await admin.auth().createUser({
        email: adminEmail,
        password: adminPassword,
        displayName: adminName,
        emailVerified: true,
      })
      console.log('✅ Firebase user created:', firebaseUser.uid)
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('⚠️  Firebase user already exists, fetching...')
        firebaseUser = await admin.auth().getUserByEmail(adminEmail)
      } else {
        throw error
      }
    }

    // Create admin user in MongoDB
    const adminUser = {
      email: adminEmail,
      name: adminName,
      photoURL: '',
      role: 'admin',
      coin: 1000, // Admin gets 1000 coins by default
      createdAt: new Date(),
      firebaseUid: firebaseUser.uid,
    }

    const result = await db.collection('users').insertOne(adminUser)
    
    console.log('')
    console.log('🎉 Admin user created successfully!')
    console.log('================================')
    console.log('📧 Admin Email:', adminEmail)
    console.log('🔑 Admin Password:', adminPassword)
    console.log('👤 Admin Name:', adminName)
    console.log('💰 Initial Coins:', adminUser.coin)
    console.log('================================')
    console.log('')
    console.log('⚠️  IMPORTANT: Save these credentials securely!')
    console.log('')

  } catch (error) {
    console.error('❌ Error creating admin:', error)
    throw error
  } finally {
    await client.close()
    console.log('Connection closed.')
  }
}

createAdmin().catch(console.error)


