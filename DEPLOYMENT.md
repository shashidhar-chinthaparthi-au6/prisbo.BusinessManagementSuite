# Deployment Guide - Prisbo Business Management Suite

## Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prisbo?retryWrites=true&w=majority
NEXTAUTH_SECRET=generate-a-random-secret-key-here-minimum-32-characters
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

**Important:**
- Generate a secure `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` with your production domain
- Never commit `.env.local` to version control

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for Vercel)
5. Get your connection string and update `MONGODB_URI`

### 3. Create Admin User

Run the seed script to create an admin user:

```bash
node scripts/seed.js
```

Or manually create a user in MongoDB with:
- Email: admin@prisbo.com (or your choice)
- Password: (hashed with bcrypt)
- Role: admin

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (will be auto-filled, but verify)
5. Click "Deploy"

### Step 3: Post-Deployment

1. Verify your site is accessible
2. Test login functionality
3. Create your admin user if not done already
4. Test all modules (CRM, Projects, Analytics, Team)

## Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` in environment variables

## Performance Optimization

- Images: Use Next.js Image component for optimized images
- Caching: Vercel automatically handles caching
- Database: Use MongoDB Atlas connection pooling
- Monitoring: Set up Vercel Analytics

## Security Checklist

- ✅ Environment variables are secure
- ✅ MongoDB connection uses authentication
- ✅ NextAuth secret is strong and random
- ✅ HTTPS is enabled (automatic on Vercel)
- ✅ Rate limiting is configured (if needed)
- ✅ CORS is properly configured

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check IP whitelist in MongoDB Atlas
   - Verify connection string format
   - Ensure database user has proper permissions

2. **NextAuth Errors**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Clear browser cookies and try again

3. **Build Errors**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

## Support

For issues or questions, contact: support@prisboservices.com
