# Prisbo – Business Management Suite

Complete business management SaaS platform for CRM, projects, teams, and analytics.

## Features

- **CRM Module**: Manage customers and leads with status tracking
- **Project Management**: Track projects, tasks, and deadlines
- **Analytics Dashboard**: Business insights with charts and metrics
- **Team Collaboration**: Manage team members and activity logs
- **Role-Based Access**: Admin, Manager, and User roles
- **Secure Authentication**: NextAuth.js with JWT sessions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions & API Routes
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: NextAuth.js (Auth.js)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Business Management Suite"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string and NextAuth secret:
```
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating the First Admin User

You'll need to create an admin user manually in MongoDB or use a seed script. Here's a sample script:

```javascript
// scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await User.create({
    name: 'Admin User',
    email: 'admin@prisbo.com',
    password: hashedPassword,
    role: 'admin',
  });
  
  console.log('Admin user created!');
  process.exit(0);
}

seed();
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── customers/        # CRM module
│   ├── projects/         # Project management
│   ├── analytics/        # Analytics dashboard
│   ├── team/             # Team management
│   └── login/            # Authentication
├── components/            # React components
├── lib/                   # Utilities and configs
├── models/                # MongoDB models
└── types/                 # TypeScript types
```

## Brand Colors

- **Primary**: Navy Blue (#1e3a8a)
- **Secondary**: Red (#dc2626)
- **Neutrals**: White, Light Gray (#f3f4f6), Gray (#6b7280), Dark Gray (#1f2937)

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NEXTAUTH_SECRET`: A secure random string
- `NEXTAUTH_URL`: Your production URL (e.g., https://yourdomain.com)

## License

Proprietary - Prisbo Services

## Website

https://www.prisboservices.com
# prisbo.BusinessManagementSuite
