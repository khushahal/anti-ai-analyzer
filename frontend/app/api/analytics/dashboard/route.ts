import { NextRequest, NextResponse } from 'next/server'

// Mock data for demo - in production, use a real database
const mockData = {
  totalReports: 1250,
  verifiedReports: 980,
  totalUsers: 450,
  totalAITools: 8,
  totalVotes: 3200,
  reportsByCategory: [
    { _id: 'factual', count: 420 },
    { _id: 'logical', count: 280 },
    { _id: 'bias', count: 180 },
    { _id: 'context', count: 150 },
    { _id: 'other', count: 120 }
  ],
  reportsByAITool: [
    { _id: 'GPT-4', count: 350, avgVoteScore: 8.5 },
    { _id: 'Claude-3', count: 280, avgVoteScore: 7.8 },
    { _id: 'Gemini Pro', count: 220, avgVoteScore: 6.9 },
    { _id: 'Llama-2', count: 180, avgVoteScore: 5.2 },
    { _id: 'PaLM-2', count: 120, avgVoteScore: 4.8 }
  ],
  reportsBySeverity: [
    { _id: 'high', count: 180 },
    { _id: 'medium', count: 420 },
    { _id: 'low', count: 380 }
  ],
  trendingReports: [
    {
      id: '1',
      aiTool: 'GPT-4',
      category: 'factual',
      severity: 'high',
      description: 'Incorrect historical date provided',
      reporter: { name: 'John Doe', avatar: '' },
      voteScore: 45,
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: '2',
      aiTool: 'Claude-3',
      category: 'logical',
      severity: 'medium',
      description: 'Flawed reasoning in mathematical proof',
      reporter: { name: 'Jane Smith', avatar: '' },
      voteScore: 32,
      createdAt: new Date(Date.now() - 172800000)
    }
  ],
  topAITools: [
    {
      name: 'GPT-4',
      performance: { current: { accuracy: 92, responseTime: 2.1, reliability: 98, userSatisfaction: 4.5 } },
      stats: { mistakeRate: 8.2, totalQueries: 15000 }
    },
    {
      name: 'Claude-3',
      performance: { current: { accuracy: 89, responseTime: 2.8, reliability: 95, userSatisfaction: 4.2 } },
      stats: { mistakeRate: 11.5, totalQueries: 12000 }
    },
    {
      name: 'Gemini Pro',
      performance: { current: { accuracy: 85, responseTime: 1.9, reliability: 92, userSatisfaction: 4.0 } },
      stats: { mistakeRate: 15.3, totalQueries: 10000 }
    }
  ],
  recentActivity: [
    {
      id: '1',
      aiTool: 'GPT-4',
      category: 'factual',
      description: 'New mistake reported',
      reporter: { name: 'User123', avatar: '' },
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      aiTool: 'Claude-3',
      category: 'bias',
      description: 'Gender bias detected in response',
      reporter: { name: 'User456', avatar: '' },
      createdAt: new Date(Date.now() - 7200000)
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // In a real application, you would filter data based on the period
    // For demo purposes, we'll return the same data

    return NextResponse.json({
      success: true,
      data: {
        period,
        overview: {
          totalReports: mockData.totalReports,
          verifiedReports: mockData.verifiedReports,
          totalUsers: mockData.totalUsers,
          totalAITools: mockData.totalAITools,
          totalVotes: mockData.totalVotes
        },
        reportsByCategory: mockData.reportsByCategory,
        reportsByAITool: mockData.reportsByAITool,
        reportsBySeverity: mockData.reportsBySeverity,
        trendingReports: mockData.trendingReports,
        topAITools: mockData.topAITools,
        recentActivity: mockData.recentActivity
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 