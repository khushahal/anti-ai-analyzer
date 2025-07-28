'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Activity,
  User,
  Calendar,
  Zap,
  Shield,
  Brain,
  MessageSquare
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface UserDashboardProps {
  user: {
    name: string
    email: string
    joinDate: string
    totalQueries: number
    preferredAI: string
  }
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const userPerformanceData = [
    { name: 'Mon', accuracy: 92, queries: 45, mistakes: 2 },
    { name: 'Tue', accuracy: 89, queries: 52, mistakes: 3 },
    { name: 'Wed', accuracy: 95, queries: 38, mistakes: 1 },
    { name: 'Thu', accuracy: 91, queries: 61, mistakes: 4 },
    { name: 'Fri', accuracy: 94, queries: 47, mistakes: 2 },
    { name: 'Sat', accuracy: 88, queries: 29, mistakes: 3 },
    { name: 'Sun', accuracy: 93, queries: 34, mistakes: 1 },
  ]

  const userMistakeTypes = [
    { name: 'Factual Errors', value: 8, color: '#ef4444' },
    { name: 'Logical Fallacies', value: 5, color: '#f59e0b' },
    { name: 'Bias Issues', value: 3, color: '#3b82f6' },
    { name: 'Context Errors', value: 2, color: '#8b5cf6' },
    { name: 'Other', value: 1, color: '#6b7280' },
  ]

  const userAITools = [
    { name: 'GPT-4', usage: 45, accuracy: 94.2, mistakes: 3 },
    { name: 'Claude-3', usage: 32, accuracy: 92.8, mistakes: 2 },
    { name: 'Gemini Pro', usage: 18, accuracy: 89.5, mistakes: 4 },
    { name: 'Llama-2', usage: 5, accuracy: 87.3, mistakes: 1 },
  ]

  const userStats = [
    {
      title: 'Your Accuracy',
      value: '91.8%',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'text-success-600'
    },
    {
      title: 'Total Queries',
      value: user.totalQueries.toString(),
      change: '+12',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-primary-600'
    },
    {
      title: 'Mistakes Made',
      value: '16',
      change: '-4',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-error-600'
    },
    {
      title: 'Preferred AI',
      value: user.preferredAI,
      change: 'Most Used',
      trend: 'up',
      icon: Brain,
      color: 'text-purple-600'
    }
  ]

  const recentQueries = [
    {
      id: 1,
      query: "What's the capital of France?",
      aiTool: 'GPT-4',
      response: 'Paris is the capital of France.',
      accuracy: 'correct',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      query: "Explain quantum computing",
      aiTool: 'Claude-3',
      response: 'Quantum computing uses quantum mechanics...',
      accuracy: 'correct',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      query: "What year did World War II end?",
      aiTool: 'Gemini Pro',
      response: 'World War II ended in 1944.',
      accuracy: 'incorrect',
      timestamp: '6 hours ago'
    },
    {
      id: 4,
      query: "How to make pasta?",
      aiTool: 'GPT-4',
      response: 'To make pasta, boil water and cook...',
      accuracy: 'correct',
      timestamp: '8 hours ago'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
            <p className="text-primary-100">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {user.totalQueries} queries made
              </span>
              <span className="flex items-center">
                <Brain className="h-4 w-4 mr-1" />
                {user.preferredAI} preferred
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-error-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last week</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Performance Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="queries" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Your Mistake Types */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Mistake Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userMistakeTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userMistakeTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Your AI Tools Usage */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your AI Tools Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userAITools.map((tool, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                <span className="text-sm text-gray-500">{tool.usage} queries</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-medium text-gray-900">{tool.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-500 h-2 rounded-full" 
                    style={{ width: `${tool.accuracy}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mistakes</span>
                  <span className="font-medium text-error-600">{tool.mistakes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Queries */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Queries</h3>
        <div className="space-y-4">
          {recentQueries.map(query => (
            <div key={query.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-medium text-gray-900">{query.aiTool}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      query.accuracy === 'correct' 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-error-100 text-error-800'
                    }`}>
                      {query.accuracy === 'correct' ? (
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                      )}
                      {query.accuracy}
                    </span>
                    <span className="text-sm text-gray-500">{query.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1"><strong>Query:</strong> {query.query}</p>
                  <p className="text-sm text-gray-700"><strong>Response:</strong> {query.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-success-600" />
              <h4 className="font-semibold text-success-800">Improving</h4>
            </div>
            <p className="text-success-700 text-sm">Your accuracy has improved by 3.2% this week. Keep up the good work!</p>
          </div>
          
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-warning-600" />
              <h4 className="font-semibold text-warning-800">Watch Out</h4>
            </div>
            <p className="text-warning-700 text-sm">You're making more factual errors with Gemini Pro. Consider double-checking responses.</p>
          </div>
          
                      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-primary-600" />
                <h4 className="font-semibold text-primary-800">Recommendation</h4>
              </div>
              <p className="text-primary-700 text-sm">Try using Claude-3 for complex reasoning tasks - it matches your usage patterns well.</p>
            </div>
        </div>
      </div>
    </div>
  )
} 