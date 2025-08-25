const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

// Debug: Check if environment variables are loaded
console.log('🔧 Environment Check:');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const mistakeRoutes = require('./routes/mistakes');
const aiToolsRoutes = require('./routes/aiTools');
const analyticsRoutes = require('./routes/analytics');
const paymentRoutes = require('./routes/payments');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('   URI:', process.env.MONGODB_URI ? '✅ Present' : '❌ Missing');
    
    // Force use of Atlas URI for now
    const mongoUri = 'mongodb+srv://khushahaltamara:aMfwNUX0xuw1nVrQ@aianalyzer.hlp6reo.mongodb.net/anti-ai-analyzer?retryWrites=true&w=majority&appName=aianalyzer';
    
    console.log('   Environment MONGODB_URI:', process.env.MONGODB_URI);
    console.log('   Forced Atlas URI:', mongoUri);
    
    if (!mongoUri) {
      throw new Error('MONGDB_URI environment variable is not set');
    }
    
    console.log('   URI Preview:', mongoUri.substring(0, 50) + '...');
    
    const conn = await mongoose.connect(mongoUri, {
      // Modern MongoDB connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`🌐 Database: ${conn.connection.name}`);
    console.log(`🔗 Host: ${conn.connection.host}`);
    console.log(`📊 Port: ${conn.connection.port}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Please check:');
    console.error('   1. MongoDB Atlas is running and accessible');
    console.error('   2. Connection string is correct');
    console.error('   3. Network allows connection to MongoDB Atlas');
    console.error('   4. Database user has correct permissions');
    console.error('   5. IP address is whitelisted in Atlas');
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Anti-AI Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/mistakes', mistakeRoutes);
app.use('/api/ai-tools', aiToolsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join user to their personal room if authenticated
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Handle mistake report submissions
  socket.on('mistake-reported', (data) => {
    // Broadcast to all connected clients
    io.emit('new-mistake-report', data);
    console.log('📝 New mistake report broadcasted');
  });

  // Handle voting updates
  socket.on('vote-updated', (data) => {
    io.emit('vote-update', data);
    console.log('👍 Vote update broadcasted');
  });

  // Handle real-time analytics updates
  socket.on('analytics-update', (data) => {
    io.emit('analytics-updated', data);
    console.log('📊 Analytics update broadcasted');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Make io available to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
  });
});

module.exports = { app, server, io }; 