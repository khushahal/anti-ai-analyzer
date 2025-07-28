const express = require('express');
const { body, validationResult, query } = require('express-validator');
const MistakeReport = require('../models/MistakeReport');
const User = require('../models/User');
const { authMiddleware, optionalAuth, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Submit a new mistake report
// @route   POST /api/mistakes
// @access  Public (with optional auth)
router.post('/', [
  body('aiTool')
    .isIn(['GPT-4', 'Claude-3', 'Gemini Pro', 'Llama-2', 'PaLM-2', 'Other'])
    .withMessage('Invalid AI tool'),
  body('category')
    .isIn(['factual', 'logical', 'bias', 'context', 'other'])
    .withMessage('Invalid category'),
  body('severity')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid severity level'),
  body('userQuery')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('User query must be between 10 and 1000 characters'),
  body('aiResponse')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('AI response must be between 10 and 5000 characters'),
  body('correctedAnswer')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Corrected answer must be between 10 and 5000 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('impact')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Impact description cannot exceed 1000 characters'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const {
    aiTool,
    category,
    severity,
    userQuery,
    aiResponse,
    correctedAnswer,
    description,
    impact,
    isAnonymous = false
  } = req.body;

  // Create report data
  const reportData = {
    aiTool,
    category,
    severity,
    userQuery,
    aiResponse,
    correctedAnswer,
    description,
    impact,
    isAnonymous
  };

  // Add reporter if authenticated
  if (req.user) {
    reportData.reporter = req.user._id;
    reportData.isAnonymous = false; // Override if user is authenticated
  } else {
    // For anonymous reports, create a temporary user reference
    reportData.reporter = null;
    reportData.isAnonymous = true;
  }

  // Create the report
  const report = await MistakeReport.create(reportData);

  // Populate reporter info for response
  if (req.user) {
    await report.populate('reporter', 'name avatar');
  }

  // Emit real-time update via Socket.IO
  const io = req.app.get('io');
  if (io) {
    io.emit('new-mistake-report', {
      report: {
        id: report._id,
        aiTool: report.aiTool,
        category: report.category,
        severity: report.severity,
        description: report.description,
        reporter: req.user ? req.user.name : 'Anonymous User',
        timestamp: report.createdAt
      }
    });
  }

  // Update user stats if authenticated
  if (req.user) {
    await req.user.updateStats('reportsSubmitted');
  }

  res.status(201).json({
    success: true,
    message: 'Mistake report submitted successfully',
    report
  });
}));

// @desc    Get all mistake reports with filtering
// @route   GET /api/mistakes
// @access  Public
router.get('/', [
  optionalAuth,
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('aiTool')
    .optional()
    .isIn(['GPT-4', 'Claude-3', 'Gemini Pro', 'Llama-2', 'PaLM-2', 'Other'])
    .withMessage('Invalid AI tool filter'),
  query('category')
    .optional()
    .isIn(['factual', 'logical', 'bias', 'context', 'other'])
    .withMessage('Invalid category filter'),
  query('severity')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid severity filter'),
  query('status')
    .optional()
    .isIn(['pending', 'verified', 'rejected', 'investigating'])
    .withMessage('Invalid status filter'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'most-voted', 'least-voted'])
    .withMessage('Invalid sort option')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const {
    page = 1,
    limit = 20,
    aiTool,
    category,
    severity,
    status = 'verified',
    sort = 'newest'
  } = req.query;

  // Build filter object
  const filter = { isPublic: true };
  if (aiTool) filter.aiTool = aiTool;
  if (category) filter.category = category;
  if (severity) filter.severity = severity;
  if (status) filter.status = status;

  // Build sort object
  let sortObj = {};
  switch (sort) {
    case 'newest':
      sortObj = { createdAt: -1 };
      break;
    case 'oldest':
      sortObj = { createdAt: 1 };
      break;
    case 'most-voted':
      sortObj = { voteScore: -1, createdAt: -1 };
      break;
    case 'least-voted':
      sortObj = { voteScore: 1, createdAt: -1 };
      break;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get reports
  const reports = await MistakeReport.find(filter)
    .populate('reporter', 'name avatar')
    .populate('verifiedBy', 'name')
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await MistakeReport.countDocuments(filter);

  // Add user vote info if authenticated
  if (req.user) {
    for (let report of reports) {
      report.userVote = report.getUserVote(req.user._id);
    }
  }

  res.status(200).json({
    success: true,
    data: reports,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// @desc    Get trending reports
// @route   GET /api/mistakes/trending
// @access  Public
router.get('/trending', [
  optionalAuth,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const reports = await MistakeReport.getTrending(parseInt(limit));

  // Add user vote info if authenticated
  if (req.user) {
    for (let report of reports) {
      report.userVote = report.getUserVote(req.user._id);
    }
  }

  res.status(200).json({
    success: true,
    data: reports
  });
}));

// @desc    Get single mistake report
// @route   GET /api/mistakes/:id
// @access  Public
router.get('/:id', [
  optionalAuth
], asyncHandler(async (req, res) => {
  const report = await MistakeReport.findById(req.params.id)
    .populate('reporter', 'name avatar')
    .populate('verifiedBy', 'name');

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Mistake report not found'
    });
  }

  // Increment views
  await report.incrementViews();

  // Add user vote info if authenticated
  if (req.user) {
    report.userVote = report.getUserVote(req.user._id);
  }

  res.status(200).json({
    success: true,
    data: report
  });
}));

// @desc    Vote on a mistake report
// @route   POST /api/mistakes/:id/vote
// @access  Private
router.post('/:id/vote', [
  authMiddleware,
  body('vote')
    .isIn(['upvote', 'downvote'])
    .withMessage('Vote must be either upvote or downvote')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { vote } = req.body;
  const report = await MistakeReport.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Mistake report not found'
    });
  }

  // Add vote
  await report.addVote(req.user._id, vote);

  // Update user stats
  await req.user.updateStats('totalVotes');

  // Emit real-time update via Socket.IO
  const io = req.app.get('io');
  if (io) {
    io.emit('vote-update', {
      reportId: report._id,
      upvotes: report.upvotes,
      downvotes: report.downvotes,
      voteScore: report.voteScore,
      userVote: vote
    });
  }

  res.status(200).json({
    success: true,
    message: 'Vote recorded successfully',
    data: {
      upvotes: report.upvotes,
      downvotes: report.downvotes,
      voteScore: report.voteScore,
      userVote: vote
    }
  });
}));

// @desc    Remove vote from a mistake report
// @route   DELETE /api/mistakes/:id/vote
// @access  Private
router.delete('/:id/vote', [
  authMiddleware
], asyncHandler(async (req, res) => {
  const report = await MistakeReport.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Mistake report not found'
    });
  }

  // Remove vote
  await report.removeVote(req.user._id);

  // Emit real-time update via Socket.IO
  const io = req.app.get('io');
  if (io) {
    io.emit('vote-update', {
      reportId: report._id,
      upvotes: report.upvotes,
      downvotes: report.downvotes,
      voteScore: report.voteScore,
      userVote: null
    });
  }

  res.status(200).json({
    success: true,
    message: 'Vote removed successfully',
    data: {
      upvotes: report.upvotes,
      downvotes: report.downvotes,
      voteScore: report.voteScore,
      userVote: null
    }
  });
}));

// @desc    Get reports by AI tool
// @route   GET /api/mistakes/tool/:aiTool
// @access  Public
router.get('/tool/:aiTool', [
  optionalAuth,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], asyncHandler(async (req, res) => {
  const { aiTool } = req.params;
  const { limit = 20 } = req.query;

  const reports = await MistakeReport.getByAITool(aiTool, parseInt(limit));

  // Add user vote info if authenticated
  if (req.user) {
    for (let report of reports) {
      report.userVote = report.getUserVote(req.user._id);
    }
  }

  res.status(200).json({
    success: true,
    data: reports
  });
}));

// @desc    Get reports by category
// @route   GET /api/mistakes/category/:category
// @access  Public
router.get('/category/:category', [
  optionalAuth,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 20 } = req.query;

  const reports = await MistakeReport.getByCategory(category, parseInt(limit));

  // Add user vote info if authenticated
  if (req.user) {
    for (let report of reports) {
      report.userVote = report.getUserVote(req.user._id);
    }
  }

  res.status(200).json({
    success: true,
    data: reports
  });
}));

// @desc    Verify a mistake report (Admin/Moderator only)
// @route   PUT /api/mistakes/:id/verify
// @access  Private (Admin/Moderator)
router.put('/:id/verify', [
  authMiddleware,
  authorize('admin', 'moderator')
], asyncHandler(async (req, res) => {
  const report = await MistakeReport.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Mistake report not found'
    });
  }

  await report.verify(req.user._id);

  // Update reporter stats if they exist
  if (report.reporter) {
    const reporter = await User.findById(report.reporter);
    if (reporter) {
      await reporter.updateStats('reportsVerified');
    }
  }

  res.status(200).json({
    success: true,
    message: 'Report verified successfully',
    data: report
  });
}));

// @desc    Reject a mistake report (Admin/Moderator only)
// @route   PUT /api/mistakes/:id/reject
// @access  Private (Admin/Moderator)
router.put('/:id/reject', [
  authMiddleware,
  authorize('admin', 'moderator'),
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { reason } = req.body;
  const report = await MistakeReport.findById(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Mistake report not found'
    });
  }

  await report.reject(reason, req.user._id);

  res.status(200).json({
    success: true,
    message: 'Report rejected successfully',
    data: report
  });
}));

module.exports = router; 