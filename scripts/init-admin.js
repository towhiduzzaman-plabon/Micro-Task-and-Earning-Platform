// Script to initialize admin user
// Run this after setting up MongoDB and Firebase
// Usage: node scripts/init-admin.js

const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-task-platform'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User'

async function initAdmin() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email: ADMIN_EMAIL })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    await db.collection('users').insertOne({
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: 'admin',
      coin: 0,
      createdAt: new Date(),
    })

    console.log('Admin user created successfully!')
    console.log(`Email: ${ADMIN_EMAIL}`)
    console.log('Note: You need to create this user in Firebase Authentication manually')
  } catch (error) {
    console.error('Error initializing admin:', error)
  } finally {
    await client.close()
  }
}

initAdmin()




