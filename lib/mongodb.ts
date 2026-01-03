import { MongoClient, Db, ServerApiVersion } from 'mongodb'

// Use environment variable or fallback to provided connection string
// Make sure to include database name in the connection string
const defaultUri = 'mongodb+srv://micro_DBuser:dbUser1234@cluster0.tre4bde.mongodb.net/microtask-platform?retryWrites=true&w=majority'
const uri: string = process.env.MONGODB_URI || defaultUri

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  // Extract database name from connection string or default to 'microtask-platform'
  let dbName = 'microtask-platform'
  
  try {
    // Parse database name from URI (format: mongodb+srv://.../database?options)
    const uriParts = uri.split('/')
    if (uriParts.length > 3) {
      const dbPart = uriParts[uriParts.length - 1].split('?')[0]
      if (dbPart && dbPart.length > 0) {
        dbName = dbPart
      }
    }
  } catch (error) {
    console.warn('Could not parse database name from URI, using default:', dbName)
  }
  
  return client.db(dbName)
}

// Test connection function
export async function testConnection(): Promise<boolean> {
  try {
    const client = await clientPromise
    await client.db('admin').command({ ping: 1 })
    console.log('✅ Successfully connected to MongoDB!')
    return true
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    return false
  }
}

export default clientPromise



