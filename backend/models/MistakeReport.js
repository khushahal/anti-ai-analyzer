const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vote: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const mistakeReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiTool: {
    type: String,
    required: [true, 'AI tool is required'],
    enum: ['GPT-4', 'Claude-3', 'Gemini Pro', 'Llama-2', 'PaLM-2', 'Other']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['factual', 'logical', 'bias', 'context', 'other']
  },
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: ['low', 'medium', 'high']
  },
  userQuery: {
    type: String,
    required: [true, 'User query is required'],
    maxlength: [1000, 'Query cannot exceed 1000 characters']
  },
  aiResponse: {
    type: String,
    required: [true, 'AI response is required'],
    maxlength: [5000, 'AI response cannot exceed 5000 characters']
  },
  correctedAnswer: {
    type: String,
    required: [true, 'Corrected answer is required'],
    maxlength: [5000, 'Corrected answer cannot exceed 5000 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  impact: {
    type: String,
    maxlength: [1000, 'Impact description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'investigating'],
    default: 'pending'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  rejectionReason: String,
  votes: [voteSchema],
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  voteScore: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  evidence: [{
    type: String,
    url: String,
    description: String
  }],
  relatedReports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MistakeReport'
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
mistakeReportSchema.index({ aiTool: 1, createdAt: -1 });
mistakeReportSchema.index({ category: 1, createdAt: -1 });
mistakeReportSchema.index({ status: 1, createdAt: -1 });
mistakeReportSchema.index({ voteScore: -1, createdAt: -1 });
mistakeReportSchema.index({ reporter: 1, createdAt: -1 });

// Virtual for vote score calculation
mistakeReportSchema.virtual('calculatedVoteScore').get(function() {
  return this.upvotes - this.downvotes;
});

// Pre-save middleware to update vote counts
mistakeReportSchema.pre('save', function(next) {
  if (this.isModified('votes')) {
    this.upvotes = this.votes.filter(vote => vote.vote === 'upvote').length;
    this.downvotes = this.votes.filter(vote => vote.vote === 'downvote').length;
    this.totalVotes = this.votes.length;
    this.voteScore = this.upvotes - this.downvotes;
  }
  next();
});

// Method to add vote
mistakeReportSchema.methods.addVote = function(userId, voteType) {
  // Remove existing vote by this user
  this.votes = this.votes.filter(vote => vote.user.toString() !== userId.toString());
  
  // Add new vote
  this.votes.push({
    user: userId,
    vote: voteType
  });
  
  return this.save();
};

// Method to remove vote
mistakeReportSchema.methods.removeVote = function(userId) {
  this.votes = this.votes.filter(vote => vote.user.toString() !== userId.toString());
  return this.save();
};

// Method to get user's vote
mistakeReportSchema.methods.getUserVote = function(userId) {
  const vote = this.votes.find(vote => vote.user.toString() === userId.toString());
  return vote ? vote.vote : null;
};

// Method to verify report
mistakeReportSchema.methods.verify = function(verifiedBy) {
  this.status = 'verified';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  return this.save();
};

// Method to reject report
mistakeReportSchema.methods.reject = function(reason, rejectedBy) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.verifiedBy = rejectedBy;
  this.verifiedAt = new Date();
  return this.save();
};

// Method to increment views
mistakeReportSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to increment shares
mistakeReportSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

// Static method to get trending reports
mistakeReportSchema.statics.getTrending = function(limit = 10) {
  return this.find({ status: 'verified', isPublic: true })
    .sort({ voteScore: -1, createdAt: -1 })
    .limit(limit)
    .populate('reporter', 'name avatar')
    .populate('verifiedBy', 'name');
};

// Static method to get reports by AI tool
mistakeReportSchema.statics.getByAITool = function(aiTool, limit = 20) {
  return this.find({ aiTool, isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('reporter', 'name avatar');
};

// Static method to get reports by category
mistakeReportSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ category, isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('reporter', 'name avatar');
};

module.exports = mongoose.model('MistakeReport', mistakeReportSchema); 