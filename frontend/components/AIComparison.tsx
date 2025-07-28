'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Star,
  BarChart3,
  Filter,
  Download,
  Eye
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function AIComparison() {
  const [selectedMetric, setSelectedMetric] = useState('accuracy')
  const [sortBy, setSortBy] = useState('accuracy')

  const aiTools = [
    {
      name: 'GPT-4',
      accuracy: 94.2,
      responseTime: 1.8,
      mistakeRate: 2.1,
      costPerQuery: 0.03,
      reliability: 98.5,
      biasScore: 8.7,
      contextUnderstanding: 9.2,
      factualAccuracy: 9.4,
      logicalReasoning: 9.1,
      creativity: 9.3,
      efficiency: 8.9,
      trend: 'up',
      status: 'optimal',
      totalQueries: 1250000,
      mistakes: 47
    },
    {
      name: 'Claude-3',
      accuracy: 92.8,
      responseTime: 2.1,
      mistakeRate: 2.8,
      costPerQuery: 0.025,
      reliability: 97.8,
      biasScore: 9.1,
      contextUnderstanding: 9.4,
      factualAccuracy: 9.2,
      logicalReasoning: 9.3,
      creativity: 8.8,
      efficiency: 8.7,
      trend: 'up',
      status: 'optimal',
      totalQueries: 980000,
      mistakes: 52
    },
    {
      name: 'Gemini Pro',
      accuracy: 89.5,
      responseTime: 1.5,
      mistakeRate: 3.2,
      costPerQuery: 0.02,
      reliability: 96.2,
      biasScore: 8.3,
      contextUnderstanding: 8.8,
      factualAccuracy: 8.9,
      logicalReasoning: 8.7,
      creativity: 9.0,
      efficiency: 9.2,
      trend: 'down',
      status: 'warning',
      totalQueries: 750000,
      mistakes: 68
    },
    {
      name: 'Llama-2',
      accuracy: 87.3,
      responseTime: 2.8,
      mistakeRate: 4.1,
      costPerQuery: 0.015,
      reliability: 94.5,
      biasScore: 7.8,
      contextUnderstanding: 8.2,
      factualAccuracy: 8.5,
      logicalReasoning: 8.3,
      creativity: 8.6,
      efficiency: 7.9,
      trend: 'stable',
      status: 'warning',
      totalQueries: 520000,
      mistakes: 89
    },
    {
      name: 'PaLM-2',
      accuracy: 85.1,
      responseTime: 3.2,
      mistakeRate: 4.8,
      costPerQuery: 0.018,
      reliability: 93.1,
      biasScore: 8.1,
      contextUnderstanding: 8.0,
      factualAccuracy: 8.3,
      logicalReasoning: 8.1,
      creativity: 8.4,
      efficiency: 7.6,
      trend: 'up',
      status: 'optimal',
      totalQueries: 380000,
      mistakes: 112
    }
  ]

  const metrics = [
    { id: 'accuracy', name: 'Accuracy', icon: Target },
    { id: 'responseTime', name: 'Response Time', icon: Clock },
    { id: 'mistakeRate', name: 'Mistake Rate', icon: AlertTriangle },
    { id: 'costPerQuery', name: 'Cost Efficiency', icon: TrendingDown },
    { id: 'reliability', name: 'Reliability', icon: CheckCircle }
  ]

  const radarData = aiTools.map(tool => ({
    name: tool.name,
    Bias: tool.biasScore,
    Context: tool.contextUnderstanding,
    Factual: tool.factualAccuracy,
    Logical: tool.logicalReasoning,
    Creativity: tool.creativity,
    Efficiency: tool.efficiency
  }))

  const sortedTools = [...aiTools].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a] as number
    const bValue = b[sortBy as keyof typeof b] as number
    return sortBy === 'responseTime' || sortBy === 'mistakeRate' || sortBy === 'costPerQuery' 
      ? aValue - bValue 
      : bValue - aValue
  })

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-success-600" />
    ) : trend === 'down' ? (
      <TrendingDown className="h-4 w-4 text-error-600" />
    ) : (
      <div className="h-4 w-4 bg-gray-300 rounded"></div>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      optimal: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      critical: 'bg-error-100 text-error-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  const formatMetric = (value: number, metric: string) => {
    switch (metric) {
      case 'accuracy':
      case 'reliability':
        return `${value.toFixed(1)}%`
      case 'responseTime':
        return `${value}s`
      case 'mistakeRate':
        return `${value.toFixed(1)}%`
      case 'costPerQuery':
        return `$${value.toFixed(3)}`
      default:
        return value.toString()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Tools Comparison</h1>
          <p className="text-gray-600 mt-1">Comprehensive comparison of AI tool performance and capabilities</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="btn-primary">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {metrics.map(metric => {
          const Icon = metric.icon
          const isActive = selectedMetric === metric.id
          return (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`card text-center transition-colors ${
                isActive ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-2 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              <h4 className={`font-semibold ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>
                {metric.name}
              </h4>
            </button>
          )
        })}
      </div>

      {/* Comparison Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance Comparison</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="accuracy">Sort by Accuracy</option>
              <option value="responseTime">Sort by Response Time</option>
              <option value="mistakeRate">Sort by Mistake Rate</option>
              <option value="costPerQuery">Sort by Cost</option>
              <option value="reliability">Sort by Reliability</option>
            </select>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={sortedTools}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [formatMetric(value, selectedMetric), selectedMetric]}
            />
            <Bar 
              dataKey={selectedMetric} 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Comparison Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">AI Tool</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Accuracy</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Response Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Mistake Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cost/Query</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Reliability</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trend</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTools.map((tool, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{tool.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{tool.name}</div>
                        <div className="text-sm text-gray-500">{tool.totalQueries.toLocaleString()} queries</div>
                      </div>
                    </div>
                  </td>
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
                  <td className="py-3 px-4 text-gray-600">{tool.responseTime}s</td>
                  <td className="py-3 px-4 text-gray-600">{tool.mistakeRate}%</td>
                  <td className="py-3 px-4 text-gray-600">${tool.costPerQuery}</td>
                  <td className="py-3 px-4 text-gray-600">{tool.reliability}%</td>
                  <td className="py-3 px-4">
                    {getTrendIcon(tool.trend)}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(tool.status)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <BarChart3 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart for Capabilities */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Capability Radar Chart</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={90} domain={[0, 10]} />
            {aiTools.map((tool, index) => (
              <Radar
                key={tool.name}
                name={tool.name}
                dataKey={tool.name}
                stroke={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index]}
                fill={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'][index]}
                fillOpacity={0.1}
              />
            ))}
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-success-50 border border-success-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-success-600" />
              <h4 className="font-semibold text-success-800">Best Overall</h4>
            </div>
            <p className="text-success-700 text-sm">GPT-4 shows the best balance of accuracy, reliability, and performance across all metrics.</p>
          </div>
          
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-warning-600" />
              <h4 className="font-semibold text-warning-800">Most Improved</h4>
            </div>
            <p className="text-warning-700 text-sm">Claude-3 has shown significant improvement in bias detection and context understanding.</p>
          </div>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-primary-600" />
              <h4 className="font-semibold text-primary-800">Best Value</h4>
            </div>
            <p className="text-primary-700 text-sm">Gemini Pro offers good performance at a lower cost, suitable for budget-conscious users.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 