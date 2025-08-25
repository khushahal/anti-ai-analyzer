# 🚀 AI Analyzer - Full Stack Platform

A comprehensive platform for analyzing AI tools, detecting mistakes, and providing real-time insights with user reporting and voting systems.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔍 **AI Mistake Detection**
- **User Reporting System**: Submit detailed AI mistake reports
- **Voting System**: Upvote/downvote reports with real-time updates
- **Categorization**: Factual errors, logical fallacies, bias issues, context errors
- **Severity Levels**: Low, medium, high impact classification
- **Verification System**: Admin/moderator verification workflow

### 📊 **Analytics & Dashboard**
- **Real-time Analytics**: Live performance monitoring
- **AI Tool Comparison**: Side-by-side performance metrics
- **Trending Reports**: Most popular and impactful mistakes
- **User Statistics**: Personal analytics and history
- **Interactive Charts**: Visual data representation

### 🔐 **Authentication & User Management**
- **JWT Authentication**: Secure login/logout system
- **User Profiles**: Personal preferences and statistics
- **Role-based Access**: User, moderator, admin roles
- **Password Management**: Reset and change functionality

### 🌐 **SEO Optimized**
- **Dedicated Routes**: Separate URLs for each section
- **Meta Tags**: Comprehensive SEO metadata
- **Sitemap**: Automatic sitemap generation
- **Social Sharing**: Open Graph and Twitter cards

### ⚡ **Real-time Features**
- **Socket.IO Integration**: Live updates and notifications
- **Live Feed**: Real-time mistake reports and activity
- **Instant Voting**: Real-time vote count updates
- **Live Analytics**: Real-time performance metrics

## 🛠 Tech Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Interactive data visualization
- **Lucide React**: Modern icon library
- **Framer Motion**: Smooth animations
- **Socket.IO Client**: Real-time communication

### **Backend**
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **Socket.IO**: Real-time bidirectional communication
- **Express Validator**: Input validation
- **Helmet**: Security middleware
- **Rate Limiting**: API protection

### **Development Tools**
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server
- **Concurrently**: Run multiple commands

## 📁 Project Structure

```
anti-ai-analyzer/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── page.tsx         # Home/Dashboard
│   │   ├── mistakes/        # Mistake analysis pages
│   │   ├── realtime/        # Real-time feed pages
│   │   ├── comparison/      # AI comparison pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── sitemap.ts       # SEO sitemap
│   │   └── robots.ts        # SEO robots.txt
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── MistakeAnalysis.tsx
│   │   ├── RealTimeFeed.tsx
│   │   ├── AIComparison.tsx
│   │   ├── AuthModal.tsx    # Authentication modal
│   │   ├── MistakeReportModal.tsx
│   │   ├── VotingComponent.tsx
│   │   └── ...
│   ├── package.json         # Frontend dependencies
│   └── ...
├── backend/                 # Express.js backend API
│   ├── models/              # MongoDB models
│   │   ├── User.js          # User model
│   │   ├── MistakeReport.js # Mistake report model
│   │   └── AITool.js        # AI tool model
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User management
│   │   ├── mistakes.js      # Mistake reports
│   │   ├── aiTools.js       # AI tools
│   │   └── analytics.js     # Analytics
│   ├── middleware/          # Express middleware
│   │   ├── auth.js          # Authentication middleware
│   │   └── errorHandler.js  # Error handling
│   ├── server.js            # Main server file
│   ├── config.env           # Environment variables
│   └── package.json         # Backend dependencies
├── package.json             # Root package.json
└── README.md               # Project documentation
```

## 🚀 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB (local or cloud)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/anti-ai-team/anti-ai-analyzer.git
   cd anti-ai-analyzer
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy backend environment file
   cp backend/config.env.example backend/config.env
   
   # Edit the configuration
   nano backend/config.env
   ```

4. **Start MongoDB** (if using local)
   ```bash
   mongod
   ```

5. **Run the development servers**
   ```bash
   npm run dev
   ```

### Manual Installation

If you prefer to install frontend and backend separately:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start both servers
cd ..
npm run dev
```

### Vercel Deployment

For production deployment to Vercel, see the [Deployment Guide](./DEPLOYMENT.md).

**Quick Vercel Setup**:
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

The application will be automatically deployed and available at your Vercel URL.

## ⚙️ Configuration

### Environment Variables

Create `backend/config.env`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/anti-ai-analyzer

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Configuration

The frontend will automatically connect to the backend API at `http://localhost:5000`.

## 🎯 Usage

### Development

```bash
# Run both frontend and backend
npm run dev

# Run only backend
npm run dev:backend

# Run only frontend
npm run dev:frontend
```

### Production

```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Available Scripts

```bash
npm run dev              # Start development servers
npm run build            # Build frontend for production
npm run start            # Start production server
npm run test             # Run all tests
npm run lint             # Lint all code
npm run install:all      # Install all dependencies
```

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
POST /api/auth/logout       # Logout user
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update user profile
PUT  /api/auth/password    # Change password
```

### Mistake Reports Endpoints

```
GET    /api/mistakes              # Get all reports
POST   /api/mistakes              # Submit new report
GET    /api/mistakes/:id          # Get single report
POST   /api/mistakes/:id/vote     # Vote on report
DELETE /api/mistakes/:id/vote     # Remove vote
GET    /api/mistakes/trending     # Get trending reports
GET    /api/mistakes/tool/:tool   # Get reports by AI tool
GET    /api/mistakes/category/:category
```

### AI Tools Endpoints

```
GET  /api/ai-tools              # Get all AI tools
GET  /api/ai-tools/top          # Get top performers
GET  /api/ai-tools/trending     # Get trending tools
GET  /api/ai-tools/:id          # Get single tool
POST /api/ai-tools/:id/query    # Record query
POST /api/ai-tools/:id/mistake  # Record mistake
```

### Analytics Endpoints

```
GET /api/analytics/dashboard    # Dashboard analytics
GET /api/analytics/user         # User analytics
GET /api/analytics/compare      # AI tool comparison
GET /api/analytics/trending     # Trending analytics
GET /api/analytics/realtime     # Real-time analytics
```

### User Management Endpoints

```
GET    /api/users/profile       # Get user profile
GET    /api/users/stats         # Get user statistics
GET    /api/users/reports       # Get user's reports
GET    /api/users/votes         # Get user's votes
PUT    /api/users/preferences   # Update preferences
DELETE /api/users/account       # Delete account
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'moderator', 'admin'],
  isVerified: Boolean,
  preferences: {
    theme: String,
    notifications: Object,
    preferredAI: String
  },
  stats: {
    totalQueries: Number,
    reportsSubmitted: Number,
    reportsVerified: Number,
    totalVotes: Number
  }
}
```

### MistakeReport Model
```javascript
{
  reporter: ObjectId (ref: User),
  aiTool: String,
  category: String,
  severity: String,
  userQuery: String,
  aiResponse: String,
  correctedAnswer: String,
  description: String,
  impact: String,
  status: String,
  votes: [{
    user: ObjectId,
    vote: String,
    createdAt: Date
  }],
  upvotes: Number,
  downvotes: Number,
  voteScore: Number
}
```

### AITool Model
```javascript
{
  name: String,
  slug: String,
  description: String,
  provider: String,
  category: String,
  capabilities: [String],
  pricing: Object,
  performance: {
    current: Object,
    historical: [Object]
  },
  stats: {
    totalQueries: Number,
    totalMistakes: Number,
    mistakeRate: Number,
    averageResponseTime: Number,
    totalCost: Number,
    activeUsers: Number
  }
}
```

## 🚀 Deployment

### Backend Deployment (Heroku)

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   ```bash
   vercel
   ```

2. **Set environment variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/anti-ai-team/anti-ai-analyzer/wiki)
- **Issues**: [GitHub Issues](https://github.com/anti-ai-team/anti-ai-analyzer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/anti-ai-team/anti-ai-analyzer/discussions)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Express.js community for the robust backend
- MongoDB team for the flexible database
- All contributors and users of this platform

---




## TODO

**Made with ❤️ by the Anti-AI Team** 