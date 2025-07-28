const mongoose = require('mongoose');

const performanceMetricSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  responseTime: {
    type: Number,
    min: 0,
    required: true
  },
  cost: {
    type: Number,
    min: 0,
    required: true
  },
  reliability: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  userSatisfaction: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },
  totalQueries: {
    type: Number,
    default: 0
  },
  successfulQueries: {
    type: Number,
    default: 0
  },
  failedQueries: {
    type: Number,
    default: 0
  }
});

const aiToolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'AI tool name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  version: {
    type: String,
    default: '1.0.0'
  },
  provider: {
    type: String,
    required: [true, 'Provider is required']
  },
  category: {
    type: String,
    enum: ['language-model', 'image-generation', 'code-generation', 'multimodal', 'other'],
    default: 'language-model'
  },
  capabilities: [{
    type: String,
    enum: ['text-generation', 'image-generation', 'code-generation', 'translation', 'summarization', 'question-answering', 'sentiment-analysis', 'other']
  }],
  pricing: {
    input: {
      type: Number,
      required: true
    },
    output: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    unit: {
      type: String,
      default: 'per-1k-tokens'
    }
  },
  performance: {
    current: {
      accuracy: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      responseTime: {
        type: Number,
        min: 0,
        default: 0
      },
      reliability: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      userSatisfaction: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      }
    },
    historical: [performanceMetricSchema],
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  stats: {
    totalQueries: {
      type: Number,
      default: 0
    },
    totalMistakes: {
      type: Number,
      default: 0
    },
    mistakeRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    activeUsers: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'deprecated'],
    default: 'active'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  features: [{
    name: String,
    description: String,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  limitations: [{
    type: String,
    maxlength: [200, 'Limitation cannot exceed 200 characters']
  }],
  documentation: {
    url: String,
    lastUpdated: Date
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  apiEndpoint: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
aiToolSchema.index({ name: 1 });
aiToolSchema.index({ slug: 1 });
aiToolSchema.index({ status: 1 });
aiToolSchema.index({ 'performance.current.accuracy': -1 });
aiToolSchema.index({ 'stats.mistakeRate': 1 });

// Pre-save middleware to generate slug
aiToolSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to update performance metrics
aiToolSchema.methods.updatePerformance = function(metrics) {
  const { accuracy, responseTime, cost, reliability, userSatisfaction, totalQueries, successfulQueries, failedQueries } = metrics;
  
  // Update current performance
  this.performance.current = {
    accuracy: accuracy || this.performance.current.accuracy,
    responseTime: responseTime || this.performance.current.responseTime,
    reliability: reliability || this.performance.current.reliability,
    userSatisfaction: userSatisfaction || this.performance.current.userSatisfaction
  };
  
  // Add to historical data
  this.performance.historical.push({
    date: new Date(),
    accuracy: this.performance.current.accuracy,
    responseTime: this.performance.current.responseTime,
    cost: cost || 0,
    reliability: this.performance.current.reliability,
    userSatisfaction: this.performance.current.userSatisfaction,
    totalQueries: totalQueries || 0,
    successfulQueries: successfulQueries || 0,
    failedQueries: failedQueries || 0
  });
  
  // Keep only last 30 days of historical data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  this.performance.historical = this.performance.historical.filter(
    metric => metric.date > thirtyDaysAgo
  );
  
  this.performance.lastUpdated = new Date();
  
  return this.save();
};

// Method to update stats
aiToolSchema.methods.updateStats = function(stats) {
  Object.assign(this.stats, stats);
  
  // Recalculate mistake rate
  if (this.stats.totalQueries > 0) {
    this.stats.mistakeRate = (this.stats.totalMistakes / this.stats.totalQueries) * 100;
  }
  
  return this.save();
};

// Method to increment queries
aiToolSchema.methods.incrementQueries = function(successful = true) {
  this.stats.totalQueries += 1;
  if (successful) {
    this.stats.successfulQueries += 1;
  } else {
    this.stats.failedQueries += 1;
  }
  
  // Recalculate mistake rate
  this.stats.mistakeRate = (this.stats.totalMistakes / this.stats.totalQueries) * 100;
  
  return this.save();
};

// Method to increment mistakes
aiToolSchema.methods.incrementMistakes = function() {
  this.stats.totalMistakes += 1;
  this.stats.mistakeRate = (this.stats.totalMistakes / this.stats.totalQueries) * 100;
  return this.save();
};

// Static method to get top performing tools
aiToolSchema.statics.getTopPerformers = function(limit = 10) {
  return this.find({ status: 'active', isPublic: true })
    .sort({ 'performance.current.accuracy': -1, 'stats.mistakeRate': 1 })
    .limit(limit);
};

// Static method to get tools by category
aiToolSchema.statics.getByCategory = function(category) {
  return this.find({ category, status: 'active', isPublic: true })
    .sort({ 'performance.current.accuracy': -1 });
};

// Static method to get trending tools
aiToolSchema.statics.getTrending = function(limit = 10) {
  return this.find({ status: 'active', isPublic: true })
    .sort({ 'stats.activeUsers': -1, 'performance.current.userSatisfaction': -1 })
    .limit(limit);
};

module.exports = mongoose.model('AITool', aiToolSchema); 