# Vercel Deployment Guide

This guide will help you deploy the Anti-AI Analyzer application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Node.js**: Version 18 or higher

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository structure looks like this:
```
Anti-AI/
├── frontend/          # Next.js application
├── backend/           # Express.js API (for reference)
├── vercel.json        # Vercel configuration
├── package.json       # Root package.json
└── README.md
```

### 2. Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API Configuration
NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app

# Database (if using external database)
DATABASE_URL=your-database-connection-string

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the root directory:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `anti-ai-analyzer`
   - Directory: `./` (root)
   - Override settings: `N`

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: `Next.js`
   - Root Directory: `./frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 4. Configure Environment Variables in Vercel

1. Go to your project dashboard in Vercel
2. Navigate to Settings → Environment Variables
3. Add the following variables:
   - `JWT_SECRET`: Your secret key for JWT tokens
   - `NEXT_PUBLIC_API_URL`: Your Vercel deployment URL
   - `DATABASE_URL`: Your database connection string (if using external DB)

### 5. Custom Domain (Optional)

1. Go to your project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Configure DNS settings as instructed

## Database Setup

### Option 1: Vercel Postgres (Recommended)

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string to your environment variables
4. Update the API routes to use the database

### Option 2: MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to your environment variables

### Option 3: Supabase

1. Create a Supabase account
2. Create a new project
3. Get your connection string
4. Add it to your environment variables

## API Routes Structure

The application uses Next.js API routes for the backend:

```
frontend/app/api/
├── health/route.ts           # Health check
├── auth/
│   ├── register/route.ts     # User registration
│   └── login/route.ts        # User login
├── mistakes/route.ts         # Mistake reports
└── analytics/
    └── dashboard/route.ts    # Dashboard analytics
```

## Post-Deployment

### 1. Test Your Application

Visit your deployed URL and test:
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays data
- [ ] Mistake reporting works
- [ ] Analytics are working

### 2. Monitor Performance

1. Go to your Vercel dashboard
2. Check the Analytics tab for:
   - Page views
   - Performance metrics
   - Error rates

### 3. Set Up Monitoring

Consider setting up:
- **Sentry**: For error tracking
- **Google Analytics**: For user analytics
- **Vercel Analytics**: Built-in analytics

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `frontend/package.json`
   - Ensure TypeScript types are installed
   - Verify environment variables are set

2. **API Routes Not Working**
   - Check that routes are in the correct directory structure
   - Verify environment variables are accessible
   - Check Vercel function logs

3. **Database Connection Issues**
   - Verify connection string is correct
   - Check if database is accessible from Vercel
   - Ensure proper authentication

### Debugging

1. **Check Function Logs**:
   - Go to your Vercel dashboard
   - Navigate to Functions tab
   - Check logs for errors

2. **Local Testing**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Environment Variables**:
   - Verify all variables are set in Vercel dashboard
   - Check that `NEXT_PUBLIC_` prefix is used for client-side variables

## Performance Optimization

1. **Enable Edge Functions**:
   - Update `vercel.json` to use edge functions for better performance

2. **Optimize Images**:
   - Use Next.js Image component
   - Configure image optimization

3. **Enable Caching**:
   - Add appropriate cache headers
   - Use ISR for static pages

## Security Considerations

1. **Environment Variables**:
   - Never commit secrets to Git
   - Use Vercel's environment variable system
   - Rotate secrets regularly

2. **API Security**:
   - Implement rate limiting
   - Add CORS headers
   - Validate all inputs

3. **Authentication**:
   - Use secure JWT tokens
   - Implement proper session management
   - Add CSRF protection

## Scaling

As your application grows:

1. **Database**: Consider upgrading to a managed database service
2. **CDN**: Vercel automatically provides global CDN
3. **Monitoring**: Set up comprehensive monitoring
4. **Backup**: Implement regular database backups

## Support

If you encounter issues:

1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
3. Check Vercel community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## Next Steps

After successful deployment:

1. Set up a custom domain
2. Configure SSL certificates
3. Set up monitoring and analytics
4. Implement CI/CD pipeline
5. Add automated testing
6. Set up staging environment 