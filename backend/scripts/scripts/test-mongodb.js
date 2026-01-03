// Test MongoDB Connection Script
const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = process.env.MONGODB_URI || 'mongodb+srv://micro_DBuser:dbUser1234@cluster0.tre4bde.mongodb.net/microtask-platform?retryWrites=true&w=majority'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server
    await client.connect()
    console.log('Connecting to MongoDB...')
    
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log('✅ Pinged your deployment. You successfully connected to MongoDB!')
    
    // Test database access
    const db = client.db('microtask-platform')
    const collections = await db.listCollections().toArray()
    console.log(`✅ Database 'microtask-platform' is accessible`)
    console.log(`📊 Collections found: ${collections.length}`)
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '))
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
    console.log('Connection closed.')
  }
}

run().catch(console.dir)


