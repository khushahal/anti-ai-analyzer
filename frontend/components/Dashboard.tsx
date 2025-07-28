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
  Activity
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import PublicWelcome from './PublicWelcome'
import apiClient from '@/lib/api'

interface DashboardProps {
  isPublicMode?: boolean
  onSignUp?: () => void
}

export default function Dashboard({ isPublicMode = true, onSignUp }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.getDashboardAnalytics()
        if (response.success) {
          setAnalyticsData(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const performanceData = [
    { name: 'Mon', accuracy: 85, mistakes: 12, response: 2.1 },
    { name: 'Tue', accuracy: 88, mistakes: 8, response: 1.9 },
    { name: 'Wed', accuracy: 92, mistakes: 5, response: 1.7 },
    { name: 'Thu', accuracy: 89, mistakes: 9, response: 2.0 },
    { name: 'Fri', accuracy: 94, mistakes: 3, response: 1.5 },
    { name: 'Sat', accuracy: 91, mistakes: 6, response: 1.8 },
    { name: 'Sun', accuracy: 87, mistakes: 11, response: 2.2 },
  ]

  const mistakeTypes = [
    { name: 'Factual Errors', value: 35, color: '#ef4444' },
    { name: 'Logical Fallacies', value: 25, color: '#f59e0b' },
    { name: 'Bias Issues', value: 20, color: '#3b82f6' },
    { name: 'Context Errors', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#6b7280' },
  ]

  const topAITools = [
    { name: 'GPT-4', accuracy: 94.2, mistakes: 3, trend: 'up' },
    { name: 'Claude-3', accuracy: 92.8, mistakes: 5, trend: 'up' },
    { name: 'Gemini Pro', accuracy: 89.5, mistakes: 8, trend: 'down' },
    { name: 'Llama-2', accuracy: 87.3, mistakes: 12, trend: 'stable' },
    { name: 'PaLM-2', accuracy: 85.1, mistakes: 15, trend: 'up' },
  ]

  const stats = [
    {
      title: 'Total Reports',
      value: analyticsData?.overview?.totalReports?.toLocaleString() || '0',
      change: '+15%',
      trend: 'up',
      icon: Target,
      color: 'text-success-600'
    },
    {
      title: 'Verified Reports',
      value: analyticsData?.overview?.verifiedReports?.toLocaleString() || '0',
      change: '+8%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-error-600'
    },
    {
      title: 'Total Users',
      value: analyticsData?.overview?.totalUsers?.toLocaleString() || '0',
      change: '+12%',
      trend: 'up',
      icon: Clock,
      color: 'text-primary-600'
    },
    {
      title: 'AI Tools Monitored',
      value: analyticsData?.overview?.totalAITools?.toString() || '0',
      change: '+2',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
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
      {/* Public Welcome Banner */}
      {isPublicMode && onSignUp && (
        <PublicWelcome onSignUp={onSignUp} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isPublicMode ? 'Public Dashboard' : 'Your Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isPublicMode 
              ? 'Real-time AI tool analysis and performance monitoring' 
              : 'Your personal AI usage analytics and performance tracking'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">Add AI Tool</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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
        {/* Performance Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="response" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mistake Types */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mistake Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mistakeTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mistakeTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top AI Tools */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top AI Tools Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">AI Tool</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Accuracy</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Mistakes</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {topAITools.map((tool, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{tool.name}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{tool.accuracy}%</span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-success-500 h-2 rounded-full" 
                          style={{ width: `${tool.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{tool.mistakes}</td>
                  <td className="py-3 px-4">
                    {tool.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-success-600" />
                    ) : tool.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-error-600" />
                    ) : (
                      <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Optimal
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 