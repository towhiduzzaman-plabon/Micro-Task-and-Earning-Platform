# Micro-Task Earning Platform - Backend

This is the backend API server for the Micro-Task Earning Platform.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Firebase Admin SDK credentials
- Stripe account (for payments)
- ImageBB account (for image uploads)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory (see `.env.example` for reference):
```env
MONGODB_URI=your_mongodb_connection_string
FIREBASE_ADMIN_PROJECT_ID=your_firebase_admin_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_admin_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_admin_client_email
STRIPE_SECRET_KEY=your_stripe_secret_key
IMGBB_API_KEY=your_imgbb_api_key
PORT=3001
```

3. Place your Firebase Admin SDK JSON file in the root directory (optional, if not using env vars):
```
micro-task-earning-platf-54f97-firebase-adminsdk-fbsvc-93877452b5.json
```

### Running the Server

Development mode:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

Production mode:
```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── app/
│   └── api/          # API routes
├── lib/              # Server libraries (MongoDB, Firebase Admin)
├── middleware/       # Authentication middleware
├── types/            # TypeScript type definitions
└── scripts/          # Utility scripts
```

## 🔌 API Endpoints

All API endpoints are under `/api/*`:

- `/api/auth/register` - User registration
- `/api/users/*` - User management
- `/api/tasks/*` - Task management
- `/api/submissions/*` - Submission management
- `/api/payments/*` - Payment processing
- `/api/withdrawals/*` - Withdrawal management
- `/api/notifications/*` - Notifications
- `/api/dashboard/*` - Dashboard statistics
- `/api/upload` - Image upload

## 🔒 Authentication

All API routes require Firebase JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🚢 Deployment

The backend can be deployed independently. Make sure to:
1. Set all environment variables in your hosting platform
2. Configure CORS if needed (for cross-origin requests from client)
3. Ensure MongoDB connection is accessible from your hosting environment


