# MicroTask - Micro Tasking and Earning Platform

A full-stack Next.js application for micro-tasking and earning platform where workers can complete tasks to earn money, buyers can post tasks, and admins can manage the platform.

## 🌐 Live Site
**Front-end Live Site Link:** [Your Live Site URL Here]
> Update this after deployment to Vercel/Netlify/Firebase

## 👤 Admin Credentials
- **Email:** admin@microtask.com
- **Password:** Admin@123456

## 📋 Features

### 🏠 Home Page
- **Hero Section:** Interactive slider with three banners showcasing platform features
- **Best Workers:** Displays top 6 workers with maximum coins
- **How It Works:** Step-by-step guide for users
- **Features Section:** Highlights platform benefits
- **Statistics Section:** Shows platform metrics
- **Testimonials:** User feedback in a beautiful slider format

### 👤 User Authentication
- **Registration:** Email/password and Google Sign-In options
- **Login:** Secure authentication with Firebase
- **Role-based Access:** Worker, Buyer, and Admin roles
- **Initial Coins:** Workers get 10 coins, Buyers get 50 coins on registration
- **Input Validation:** Email format and password strength validation

### 👷 Worker Dashboard
- **Home:** Statistics showing total submissions, pending submissions, and total earnings
- **Task List:** Browse all available tasks with filtering
- **Task Details:** View task information and submit work
- **My Submissions:** Track all submissions with status (pending/approved/rejected) and pagination
- **Withdrawals:** Request withdrawals (minimum 200 coins = $10), view withdrawal history

### 🛒 Buyer Dashboard
- **Home:** Statistics showing total tasks, pending tasks, and total payments
- **Add New Tasks:** Create tasks with image upload, set requirements and deadlines
- **My Tasks:** Manage created tasks (update/delete)
- **Task Review:** Review and approve/reject worker submissions
- **Purchase Coin:** Buy coins using Stripe payment integration
- **Payment History:** View all payment transactions

### 👨‍💼 Admin Dashboard
- **Home:** Platform-wide statistics (total workers, buyers, coins, payments)
- **Manage Users:** View, update roles, and delete users
- **Manage Tasks:** View and delete tasks
- **Withdraw Requests:** Approve worker withdrawal requests

### 🔔 Notification System
- Real-time notifications for task submissions, approvals, rejections, and withdrawals
- Notification popup with click-to-navigate functionality
- Unread notification badge

### 💳 Payment Integration
- **Stripe Integration:** Secure payment processing for coin purchases
- **Dummy Payment:** Fallback option for testing
- **Coin Packages:** Multiple purchase options (10, 150, 500, 1000 coins)

### 🖼️ Image Upload
- ImageBB integration for image uploads
- Support for profile pictures and task images

### 🔒 Security Features
- Role-based authorization middleware
- Secure token-based authentication
- Protected API routes
- Input validation and sanitization

### 📱 Responsive Design
- Fully responsive for mobile, tablet, and desktop
- Mobile-friendly navigation
- Responsive dashboard layouts
- Touch-optimized interactions

## 🛠️ Technology Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB (Native Driver)
- **Authentication:** Firebase Authentication
- **Payment:** Stripe
- **Image Upload:** ImageBB
- **UI Components:** React Icons, Framer Motion, React Hot Toast
- **Sliders:** React Responsive Carousel, Swiper

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/microtask-client.git
cd microtask-client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_AUTHENTICATION_APP_ID=your_firebase_app_id

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=your_firebase_admin_project_id
FIREBASE_ADMIN_PRIVATE_KEY=your_firebase_admin_private_key
FIREBASE_ADMIN_CLIENT_EMAIL=your_firebase_admin_client_email

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# ImageBB
IMGBB_API_KEY=your_imgbb_api_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Client Side (Firebase/Netlify)
1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase Hosting or Netlify

### Server Side
The API routes are part of the Next.js application and will be deployed with the client.

## 📝 Key Business Logic

- **Coin System:** 
  - Workers earn coins by completing tasks
  - Buyers purchase coins (10 coins = $1)
  - Workers withdraw coins (20 coins = $1)
  - Platform earns from the difference

- **Task System:**
  - Buyers create tasks and pay upfront
  - Workers submit tasks for review
  - Buyers approve/reject submissions
  - Approved workers receive coins

- **Withdrawal System:**
  - Minimum withdrawal: 200 coins ($10)
  - Admin approves withdrawals
  - Coins deducted upon approval

## 🔗 Repository Links

### Client Side GitHub Repository Link:
```
[Your GitHub Repository Link Here]
Example: https://github.com/yourusername/microtask-client
```

### Server Side GitHub Repository Link:
```
[Same Repository - API Routes are in app/api/]
Note: This is a full-stack Next.js app, so client and server are in the same repository.
Example: https://github.com/yourusername/microtask-client
```

**📝 To update these links:**
1. See `QUICK_DEPLOY.md` for fast deployment guide
2. See `GITHUB_SETUP.md` for detailed GitHub setup
3. See `DEPLOYMENT_INFO_TEMPLATE.md` to fill in your links
4. Update the links in this README after deployment

## 👥 Roles

1. **Worker:** Completes tasks, earns coins, withdraws money
2. **Buyer:** Creates tasks, reviews submissions, purchases coins
3. **Admin:** Manages users, tasks, and approves withdrawals

## 📊 Database Collections

- `users` - User information and coin balance
- `tasks` - Task details and requirements
- `submissions` - Worker task submissions
- `withdrawals` - Withdrawal requests
- `payments` - Payment history
- `notifications` - User notifications

## 🎨 Design Features

- Modern and clean UI
- Smooth animations with Framer Motion
- Responsive carousel sliders
- Interactive hover effects
- Professional color scheme
- Accessible design patterns

## 🔐 Security

- JWT token-based authentication
- Role-based access control
- Secure API endpoints
- Input validation
- Protected routes

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

This is a project assessment. For questions or issues, please contact the development team.

## 📄 License

This project is created for assessment purposes.

---

**Note:** Make sure to update the environment variables, repository links, and live site URL before deployment.



