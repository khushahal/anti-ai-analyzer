const express = require('express');
const { body, validationResult, query } = require('express-validator');
const AITool = require('../models/AITool');
const { authMiddleware, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get all AI tools
// @route   GET /api/ai-tools
// @access  Public
router.get('/', [
  query('category')
    .optional()
    .isIn(['language-model', 'image-generation', 'code-generation', 'multimodal', 'other'])
    .withMessage('Invalid category filter'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance', 'deprecated'])
    .withMessage('Invalid status filter'),
  query('sort')
    .optional()
    .isIn(['name', 'accuracy', 'mistake-rate', 'popularity'])
    .withMessage('Invalid sort option')
], asyncHandler(async (req, res) => {
  const { category, status = 'active', sort = 'accuracy' } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (status) filter.status = status;

  let sortObj = {};
  switch (sort) {
    case 'name':
      sortObj = { name: 1 };
      break;
    case 'accuracy':
      sortObj = { 'performance.current.accuracy': -1 };
      break;
    case 'mistake-rate':
      sortObj = { 'stats.mistakeRate': 1 };
      break;
    case 'popularity':
      sortObj = { 'stats.activeUsers': -1 };
      break;
  }

  const tools = await AITool.find(filter)
    .sort(sortObj);

  res.status(200).json({
    success: true,
    data: tools
  });
}));

// @desc    Get top performing AI tools
// @route   GET /api/ai-tools/top
// @access  Public
router.get('/top', [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const tools = await AITool.getTopPerformers(parseInt(limit));

  res.status(200).json({
    success: true,
    data: tools
  });
}));

// @desc    Get trending AI tools
// @route   GET /api/ai-tools/trending
// @access  Public
router.get('/trending', [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const tools = await AITool.getTrending(parseInt(limit));

  res.status(200).json({
    success: true,
    data: tools
  });
}));

// @desc    Get AI tools by category
// @route   GET /api/ai-tools/category/:category
// @access  Public
router.get('/category/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;

  const tools = await AITool.getByCategory(category);

  res.status(200).json({
    success: true,
    data: tools
  });
}));

// @desc    Get single AI tool
// @route   GET /api/ai-tools/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const tool = await AITool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  res.status(200).json({
    success: true,
    data: tool
  });
}));

// @desc    Get AI tool by slug
// @route   GET /api/ai-tools/slug/:slug
// @access  Public
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const tool = await AITool.findOne({ slug });

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  res.status(200).json({
    success: true,
    data: tool
  });
}));

// @desc    Create new AI tool (Admin only)
// @route   POST /api/ai-tools
// @access  Private (Admin)
router.post('/', [
  authMiddleware,
  authorize('admin'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('provider')
    .trim()
    .notEmpty()
    .withMessage('Provider is required'),
  body('category')
    .isIn(['language-model', 'image-generation', 'code-generation', 'multimodal', 'other'])
    .withMessage('Invalid category'),
  body('capabilities')
    .isArray()
    .withMessage('Capabilities must be an array'),
  body('pricing.input')
    .isFloat({ min: 0 })
    .withMessage('Input pricing must be a positive number'),
  body('pricing.output')
    .isFloat({ min: 0 })
    .withMessage('Output pricing must be a positive number')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const tool = await AITool.create(req.body);

  res.status(201).json({
    success: true,
    message: 'AI tool created successfully',
    data: tool
  });
}));

// @desc    Update AI tool (Admin only)
// @route   PUT /api/ai-tools/:id
// @access  Private (Admin)
router.put('/:id', [
  authMiddleware,
  authorize('admin'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance', 'deprecated'])
    .withMessage('Invalid status')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const tool = await AITool.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'AI tool updated successfully',
    data: tool
  });
}));

// @desc    Update AI tool performance metrics
// @route   PUT /api/ai-tools/:id/performance
// @access  Private (Admin)
router.put('/:id/performance', [
  authMiddleware,
  authorize('admin'),
  body('accuracy')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Accuracy must be between 0 and 100'),
  body('responseTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Response time must be a positive number'),
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  body('reliability')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Reliability must be between 0 and 100'),
  body('userSatisfaction')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('User satisfaction must be between 0 and 5'),
  body('totalQueries')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total queries must be a positive integer'),
  body('successfulQueries')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Successful queries must be a positive integer'),
  body('failedQueries')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Failed queries must be a positive integer')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const tool = await AITool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  await tool.updatePerformance(req.body);

  res.status(200).json({
    success: true,
    message: 'Performance metrics updated successfully',
    data: tool
  });
}));

// @desc    Update AI tool stats
// @route   PUT /api/ai-tools/:id/stats
// @access  Private (Admin)
router.put('/:id/stats', [
  authMiddleware,
  authorize('admin'),
  body('totalQueries')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total queries must be a positive integer'),
  body('totalMistakes')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Total mistakes must be a positive integer'),
  body('averageResponseTime')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Average response time must be a positive number'),
  body('totalCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Total cost must be a positive number'),
  body('activeUsers')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Active users must be a positive integer')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const tool = await AITool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  await tool.updateStats(req.body);

  res.status(200).json({
    success: true,
    message: 'Stats updated successfully',
    data: tool
  });
}));

// @desc    Increment AI tool queries
// @route   POST /api/ai-tools/:id/query
// @access  Public
router.post('/:id/query', [
  body('successful')
    .optional()
    .isBoolean()
    .withMessage('Successful must be a boolean')
], asyncHandler(async (req, res) => {
  const { successful = true } = req.body;

  const tool = await AITool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  await tool.incrementQueries(successful);

  res.status(200).json({
    success: true,
    message: 'Query recorded successfully'
  });
}));

// @desc    Increment AI tool mistakes
// @route   POST /api/ai-tools/:id/mistake
// @access  Public
router.post('/:id/mistake', asyncHandler(async (req, res) => {
  const tool = await AITool.findById(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  await tool.incrementMistakes();

  res.status(200).json({
    success: true,
    message: 'Mistake recorded successfully'
  });
}));

// @desc    Delete AI tool (Admin only)
// @route   DELETE /api/ai-tools/:id
// @access  Private (Admin)
router.delete('/:id', [
  authMiddleware,
  authorize('admin')
], asyncHandler(async (req, res) => {
  const tool = await AITool.findByIdAndDelete(req.params.id);

  if (!tool) {
    return res.status(404).json({
      success: false,
      message: 'AI tool not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'AI tool deleted successfully'
  });
}));

module.exports = router; 