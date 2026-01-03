// Test script to verify buyer registration gets 50 coins
// This is just for verification - actual registration happens through the API

require('dotenv').config({ path: '.env.local' })
const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://micro_DBuser:dbUser1234@cluster0.tre4bde.mongodb.net/microtask-platform?retryWrites=true&w=majority'

async function testRegistration() {
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
    
    // Check recent buyer registrations
    console.log('\n📊 Checking recent buyer registrations...\n')
    const buyers = await db.collection('users')
      .find({ role: 'buyer' })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()
    
    if (buyers.length === 0) {
      console.log('⚠️  No buyers found in database')
      console.log('   Please register a buyer account through the website first')
    } else {
      console.log(`Found ${buyers.length} buyer(s):\n`)
      buyers.forEach((buyer, index) => {
        console.log(`${index + 1}. ${buyer.name} (${buyer.email})`)
        console.log(`   Role: ${buyer.role}`)
        console.log(`   Coins: ${buyer.coin} ${buyer.coin === 50 ? '✅' : '❌ (Expected 50)'}`)
        console.log(`   Created: ${buyer.createdAt}`)
        console.log('')
      })
    }
    
    // Check recent worker registrations
    console.log('📊 Checking recent worker registrations...\n')
    const workers = await db.collection('users')
      .find({ role: 'worker' })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()
    
    if (workers.length === 0) {
      console.log('⚠️  No workers found in database')
    } else {
      console.log(`Found ${workers.length} worker(s):\n`)
      workers.forEach((worker, index) => {
        console.log(`${index + 1}. ${worker.name} (${worker.email})`)
        console.log(`   Role: ${worker.role}`)
        console.log(`   Coins: ${worker.coin} ${worker.coin === 10 ? '✅' : '❌ (Expected 10)'}`)
        console.log(`   Created: ${worker.createdAt}`)
        console.log('')
      })
    }
    
    // Summary
    console.log('\n📋 Summary:')
    console.log('   - Buyers should have 50 coins')
    console.log('   - Workers should have 10 coins')
    console.log('   - If coins are incorrect, check the registration API route')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
    console.log('\n✅ Connection closed')
  }
}

testRegistration()


