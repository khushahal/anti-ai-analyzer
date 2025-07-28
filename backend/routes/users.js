const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const MistakeReport = require('../models/MistakeReport');
const { authMiddleware, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: user.getPublicProfile()
  });
}));

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  // Get user's reports
  const reports = await MistakeReport.find({ reporter: req.user.id })
    .sort({ createdAt: -1 })
    .limit(10);

  // Get user's voting history
  const votedReports = await MistakeReport.find({
    'votes.user': req.user.id
  })
    .populate('reporter', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      user: user.getPublicProfile(),
      recentReports: reports,
      recentVotes: votedReports
    }
  });
}));

// @desc    Get user's reports
// @route   GET /api/users/reports
// @access  Private
router.get('/reports', [
  authMiddleware,
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('status')
    .optional()
    .isIn(['pending', 'verified', 'rejected', 'investigating'])
    .withMessage('Invalid status filter')
], asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const filter = { reporter: req.user.id };
  if (status) filter.status = status;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await MistakeReport.find(filter)
    .populate('verifiedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await MistakeReport.countDocuments(filter);

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

// @desc    Get user's voting history
// @route   GET /api/users/votes
// @access  Private
router.get('/votes', [
  authMiddleware,
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const reports = await MistakeReport.find({
    'votes.user': req.user.id
  })
    .populate('reporter', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await MistakeReport.countDocuments({
    'votes.user': req.user.id
  });

  // Add user's vote info
  for (let report of reports) {
    report.userVote = report.getUserVote(req.user.id);
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

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', [
  authMiddleware,
  body('theme')
    .optional()
    .isIn(['light', 'dark', 'auto'])
    .withMessage('Theme must be light, dark, or auto'),
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('Push notifications must be a boolean'),
  body('preferredAI')
    .optional()
    .isIn(['GPT-4', 'Claude-3', 'Gemini Pro', 'Llama-2', 'PaLM-2'])
    .withMessage('Invalid AI tool preference')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { theme, notifications, preferredAI } = req.body;

  const updateData = {};
  if (theme !== undefined) updateData['preferences.theme'] = theme;
  if (notifications?.email !== undefined) updateData['preferences.notifications.email'] = notifications.email;
  if (notifications?.push !== undefined) updateData['preferences.notifications.push'] = notifications.push;
  if (preferredAI !== undefined) updateData['preferences.preferredAI'] = preferredAI;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: user.getPublicProfile()
  });
}));

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', [
  authMiddleware,
  body('password')
    .notEmpty()
    .withMessage('Password is required to confirm account deletion')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { password } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Password is incorrect'
    });
  }

  // Delete user's reports (or anonymize them)
  await MistakeReport.updateMany(
    { reporter: req.user.id },
    { 
      reporter: null,
      isAnonymous: true,
      $unset: { reporter: 1 }
    }
  );

  // Delete user account
  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
}));

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', [
  authMiddleware,
  authorize('admin'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('role')
    .optional()
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Invalid role filter')
], asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;

  const filter = {};
  if (role) filter.role = role;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
router.put('/:id/role', [
  authMiddleware,
  authorize('admin'),
  body('role')
    .isIn(['user', 'moderator', 'admin'])
    .withMessage('Invalid role')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { role } = req.body;
  const { id } = req.params;

  // Prevent admin from changing their own role
  if (id === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change your own role'
    });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: user
  });
}));

module.exports = router; 