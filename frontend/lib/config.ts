// Environment configuration
const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    timeout: 10000,
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Razorpay Configuration
  razorpay: {
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_test_key_id_here',
  },
  
  // App Configuration
  app: {
    name: 'AI Analyzer',
    version: '1.0.0',
    description: 'AI Tool Analysis & Mistake Detection',
  }
};

export default config;
