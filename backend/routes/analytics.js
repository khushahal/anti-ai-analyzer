const express = require('express');
const { query, validationResult } = require('express-validator');
const MistakeReport = require('../models/MistakeReport');
const AITool = require('../models/AITool');
const User = require('../models/User');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Public
router.get('/dashboard', [
  optionalAuth,
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y', 'all'])
    .withMessage('Invalid period')
], asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;

  // Calculate date range
  let startDate = new Date();
  switch (period) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
      startDate = new Date(0); // Beginning of time
      break;
  }

  // Get total reports
  const totalReports = await MistakeReport.countDocuments({
    createdAt: { $gte: startDate }
  });

  // Get verified reports
  const verifiedReports = await MistakeReport.countDocuments({
    status: 'verified',
    createdAt: { $gte: startDate }
  });

  // Get reports by category
  const reportsByCategory = await MistakeReport.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'verified'
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get reports by AI tool
  const reportsByAITool = await MistakeReport.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'verified'
      }
    },
    {
      $group: {
        _id: '$aiTool',
        count: { $sum: 1 },
        avgVoteScore: { $avg: '$voteScore' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get reports by severity
  const reportsBySeverity = await MistakeReport.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        status: 'verified'
      }
    },
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get trending reports
  const trendingReports = await MistakeReport.find({
    status: 'verified',
    createdAt: { $gte: startDate }
  })
    .sort({ voteScore: -1, createdAt: -1 })
    .limit(5)
    .populate('reporter', 'name avatar');

  // Get top AI tools by performance
  const topAITools = await AITool.find({ status: 'active' })
    .sort({ 'performance.current.accuracy': -1, 'stats.mistakeRate': 1 })
    .limit(5);

  // Get recent activity
  const recentActivity = await MistakeReport.find({
    status: 'verified',
    createdAt: { $gte: startDate }
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('reporter', 'name avatar');

  // Calculate overall statistics
  const totalUsers = await User.countDocuments();
  const totalAITools = await AITool.countDocuments({ status: 'active' });
  const totalVotes = await MistakeReport.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalVotes: { $sum: '$totalVotes' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      period,
      overview: {
        totalReports,
        verifiedReports,
        totalUsers,
        totalAITools,
        totalVotes: totalVotes[0]?.totalVotes || 0
      },
      reportsByCategory,
      reportsByAITool,
      reportsBySeverity,
      trendingReports,
      topAITools,
      recentActivity
    }
  });
}));

// @desc    Get user analytics (if authenticated)
// @route   GET /api/analytics/user
// @access  Private
router.get('/user', [
  authMiddleware
], asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get user's reports
  const userReports = await MistakeReport.find({ reporter: userId })
    .sort({ createdAt: -1 });

  // Get user's voting history
  const userVotes = await MistakeReport.find({
    'votes.user': userId
  })
    .populate('reporter', 'name avatar')
    .sort({ createdAt: -1 });

  // Calculate user statistics
  const totalReports = userReports.length;
  const verifiedReports = userReports.filter(r => r.status === 'verified').length;
  const totalVotes = userVotes.length;

  // Get user's reports by category
  const reportsByCategory = await MistakeReport.aggregate([
    {
      $match: { reporter: userId }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get user's reports by AI tool
  const reportsByAITool = await MistakeReport.aggregate([
    {
      $match: { reporter: userId }
    },
    {
      $group: {
        _id: '$aiTool',
        count: { $sum: 1 },
        avgVoteScore: { $avg: '$voteScore' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get user's recent activity
  const recentReports = userReports.slice(0, 5);
  const recentVotes = userVotes.slice(0, 5);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalReports,
        verifiedReports,
        totalVotes,
        verificationRate: totalReports > 0 ? (verifiedReports / totalReports) * 100 : 0
      },
      reportsByCategory,
      reportsByAITool,
      recentReports,
      recentVotes
    }
  });
}));

// @desc    Get AI tool comparison analytics
// @route   GET /api/analytics/compare
// @access  Public
router.get('/compare', [
  query('tools')
    .optional()
    .isArray()
    .withMessage('Tools must be an array'),
  query('period')
    .optional()
    .isIn(['7d', '30d', '90d', '1y', 'all'])
    .withMessage('Invalid period')
], asyncHandler(async (req, res) => {
  const { tools = [], period = '30d' } = req.query;

  // Calculate date range
  let startDate = new Date();
  switch (period) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
      startDate = new Date(0);
      break;
  }

  // Get AI tools data
  let aiToolsQuery = { status: 'active' };
  if (tools.length > 0) {
    aiToolsQuery.name = { $in: tools };
  }

  const aiTools = await AITool.find(aiToolsQuery)
    .sort({ 'performance.current.accuracy': -1 });

  // Get reports for each AI tool
  const comparisonData = await Promise.all(
    aiTools.map(async (tool) => {
      const reports = await MistakeReport.aggregate([
        {
          $match: {
            aiTool: tool.name,
            createdAt: { $gte: startDate },
            status: 'verified'
          }
        },
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            avgVoteScore: { $avg: '$voteScore' },
            reportsByCategory: {
              $push: {
                category: '$category',
                severity: '$severity'
              }
            }
          }
        }
      ]);

      const reportData = reports[0] || {
        totalReports: 0,
        avgVoteScore: 0,
        reportsByCategory: []
      };

      // Calculate category breakdown
      const categoryBreakdown = {};
      const severityBreakdown = {};
      
      reportData.reportsByCategory.forEach(report => {
        categoryBreakdown[report.category] = (categoryBreakdown[report.category] || 0) + 1;
        severityBreakdown[report.severity] = (severityBreakdown[report.severity] || 0) + 1;
      });

      return {
        tool: {
          id: tool._id,
          name: tool.name,
          provider: tool.provider,
          category: tool.category,
          performance: tool.performance.current,
          stats: tool.stats
        },
        reports: {
          total: reportData.totalReports,
          avgVoteScore: reportData.avgVoteScore,
          categoryBreakdown,
          severityBreakdown
        }
      };
    })
  );

  res.status(200).json({
    success: true,
    data: {
      period,
      comparison: comparisonData
    }
  });
}));

// @desc    Get trending analytics
// @route   GET /api/analytics/trending
// @access  Public
router.get('/trending', [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
], asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  // Get trending reports
  const trendingReports = await MistakeReport.getTrending(parseInt(limit));

  // Get trending AI tools
  const trendingAITools = await AITool.getTrending(parseInt(limit));

  // Get most active users
  const activeUsers = await User.aggregate([
    {
      $lookup: {
        from: 'mistakereports',
        localField: '_id',
        foreignField: 'reporter',
        as: 'reports'
      }
    },
    {
      $addFields: {
        totalReports: { $size: '$reports' },
        totalVotes: '$stats.totalVotes'
      }
    },
    {
      $match: {
        $or: [
          { totalReports: { $gt: 0 } },
          { totalVotes: { $gt: 0 } }
        ]
      }
    },
    {
      $sort: { totalReports: -1, totalVotes: -1 }
    },
    {
      $limit: parseInt(limit)
    },
    {
      $project: {
        name: 1,
        avatar: 1,
        totalReports: 1,
        totalVotes: 1,
        joinDate: '$createdAt'
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      trendingReports,
      trendingAITools,
      activeUsers
    }
  });
}));

// @desc    Get real-time analytics
// @route   GET /api/analytics/realtime
// @access  Public
router.get('/realtime', asyncHandler(async (req, res) => {
  // Get recent reports (last 24 hours)
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);

  const recentReports = await MistakeReport.find({
    createdAt: { $gte: last24Hours }
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('reporter', 'name avatar');

  // Get recent AI tool updates
  const recentAIToolUpdates = await AITool.find({
    'performance.lastUpdated': { $gte: last24Hours }
  })
    .sort({ 'performance.lastUpdated': -1 })
    .limit(10);

  // Calculate real-time stats
  const reportsLast24h = await MistakeReport.countDocuments({
    createdAt: { $gte: last24Hours }
  });

  const votesLast24h = await MistakeReport.aggregate([
    {
      $match: {
        'votes.createdAt': { $gte: last24Hours }
      }
    },
    {
      $group: {
        _id: null,
        totalVotes: { $sum: '$totalVotes' }
      }
    }
  ]);

  const newUsersLast24h = await User.countDocuments({
    createdAt: { $gte: last24Hours }
  });

  res.status(200).json({
    success: true,
    data: {
      last24Hours: {
        reports: reportsLast24h,
        votes: votesLast24h[0]?.totalVotes || 0,
        newUsers: newUsersLast24h
      },
      recentReports,
      recentAIToolUpdates
    }
  });
}));

module.exports = router; 