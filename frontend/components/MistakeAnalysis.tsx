'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  Download, 
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Info,
  Plus
} from 'lucide-react'
import MistakeReportModal, { MistakeReport } from './MistakeReportModal'

export default function MistakeAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAI, setSelectedAI] = useState('all')
  const [showReportModal, setShowReportModal] = useState(false)

  const categories = [
    { id: 'all', name: 'All Mistakes', count: 47, color: 'bg-gray-500' },
    { id: 'factual', name: 'Factual Errors', count: 16, color: 'bg-error-500' },
    { id: 'logical', name: 'Logical Fallacies', count: 12, color: 'bg-warning-500' },
    { id: 'bias', name: 'Bias Issues', count: 10, color: 'bg-primary-500' },
    { id: 'context', name: 'Context Errors', count: 7, color: 'bg-purple-500' },
    { id: 'other', name: 'Other', count: 2, color: 'bg-gray-400' },
  ]

  const aiTools = [
    { id: 'all', name: 'All AI Tools' },
    { id: 'gpt4', name: 'GPT-4' },
    { id: 'claude', name: 'Claude-3' },
    { id: 'gemini', name: 'Gemini Pro' },
    { id: 'llama', name: 'Llama-2' },
    { id: 'palm', name: 'PaLM-2' },
  ]

  const mistakes = [
    {
      id: 1,
      aiTool: 'GPT-4',
      category: 'factual',
      severity: 'high',
      description: 'Incorrectly stated that the Great Wall of China is visible from space with the naked eye',
      timestamp: '2024-01-15T10:30:00Z',
      userQuery: 'Can you see the Great Wall of China from space?',
      aiResponse: 'Yes, the Great Wall of China is visible from space with the naked eye.',
      correctedAnswer: 'The Great Wall of China is not visible from space with the naked eye. It can only be seen from low Earth orbit with magnification.',
      impact: 'High - Common misconception perpetuated',
      status: 'resolved'
    },
    {
      id: 2,
      aiTool: 'Claude-3',
      category: 'logical',
      severity: 'medium',
      description: 'Made a false correlation between vaccination rates and autism',
      timestamp: '2024-01-15T09:15:00Z',
      userQuery: 'Is there a link between vaccines and autism?',
      aiResponse: 'Studies have shown a correlation between vaccination rates and autism diagnosis.',
      correctedAnswer: 'There is no scientific evidence linking vaccines to autism. Multiple large-scale studies have debunked this myth.',
      impact: 'Medium - Medical misinformation',
      status: 'pending'
    },
    {
      id: 3,
      aiTool: 'Gemini Pro',
      category: 'bias',
      severity: 'high',
      description: 'Demonstrated gender bias in career recommendations',
      timestamp: '2024-01-15T08:45:00Z',
      userQuery: 'What career should I pursue?',
      aiResponse: 'Based on your profile, you might enjoy nursing or teaching.',
      correctedAnswer: 'Career choices should be based on individual interests, skills, and goals, not gender stereotypes.',
      impact: 'High - Gender bias perpetuation',
      status: 'resolved'
    },
    {
      id: 4,
      aiTool: 'Llama-2',
      category: 'context',
      severity: 'low',
      description: 'Failed to understand context in a conversation about historical events',
      timestamp: '2024-01-15T07:20:00Z',
      userQuery: 'What happened in 1945?',
      aiResponse: 'World War II ended.',
      correctedAnswer: 'Many significant events occurred in 1945, including the end of World War II, the atomic bombings of Japan, and the founding of the United Nations.',
      impact: 'Low - Incomplete information',
      status: 'pending'
    },
    {
      id: 5,
      aiTool: 'PaLM-2',
      category: 'factual',
      severity: 'medium',
      description: 'Incorrect information about the speed of light',
      timestamp: '2024-01-15T06:10:00Z',
      userQuery: 'What is the speed of light?',
      aiResponse: 'The speed of light is approximately 300,000 km/h.',
      correctedAnswer: 'The speed of light is approximately 300,000 km/s (kilometers per second), not km/h.',
      impact: 'Medium - Scientific inaccuracy',
      status: 'resolved'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-error-100 text-error-800 border-error-200'
      case 'medium': return 'bg-warning-100 text-warning-800 border-warning-200'
      case 'low': return 'bg-success-100 text-success-800 border-success-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'resolved' ? (
      <CheckCircle className="h-4 w-4 text-success-600" />
    ) : (
      <Clock className="h-4 w-4 text-warning-600" />
    )
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.color : 'bg-gray-500'
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mistake Analysis</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Track and analyze AI tool mistakes and errors
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" />
          <span>Report Mistake</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              <button className="btn-secondary flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Clear Filters</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AI Tool</label>
              <select
                value={selectedAI}
                onChange={(e) => setSelectedAI(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                {aiTools.map(tool => (
                  <option key={tool.id} value={tool.id}>{tool.name}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search mistakes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map(category => (
          <div key={category.id} className="card p-3 sm:p-4 text-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${category.color} rounded-lg mx-auto mb-2 sm:mb-3 flex items-center justify-center`}>
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{category.name}</h4>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{category.count}</p>
            <p className="text-xs sm:text-sm text-gray-500">mistakes</p>
          </div>
        ))}
      </div>

      {/* Mistakes List */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Recent Mistakes</h3>
          <div className="flex items-center space-x-3 sm:space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-success-600" />
              <span className="hidden sm:inline">32 Resolved</span>
              <span className="sm:hidden">32 ✓</span>
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-warning-600" />
              <span className="hidden sm:inline">15 Pending</span>
              <span className="sm:hidden">15 ⏳</span>
            </span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {mistakes.map(mistake => (
            <div key={mistake.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center space-x-2 sm:space-x-3 mb-2">
                    <div className={`w-3 h-3 ${getCategoryColor(mistake.category)} rounded-full flex-shrink-0`}></div>
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{mistake.aiTool}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(mistake.severity)}`}>
                      {mistake.severity.toUpperCase()}
                    </span>
                    {getStatusIcon(mistake.status)}
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{mistake.description}</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-sm space-y-3 lg:space-y-0">
                    <div>
                      <p className="text-gray-600 mb-1 text-xs sm:text-sm"><strong>User Query:</strong></p>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded text-xs sm:text-sm">{mistake.userQuery}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1 text-xs sm:text-sm"><strong>AI Response:</strong></p>
                      <p className="text-gray-900 bg-error-50 p-2 rounded border-l-4 border-error-500 text-xs sm:text-sm">{mistake.aiResponse}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-600 mb-1 text-xs sm:text-sm"><strong>Corrected Answer:</strong></p>
                    <p className="text-gray-900 bg-success-50 p-2 rounded border-l-4 border-success-500 text-xs sm:text-sm">{mistake.correctedAnswer}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                    <span>Impact: {mistake.impact}</span>
                    <span>{new Date(mistake.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 sm:ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mistake Report Modal */}
      <MistakeReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={(report) => {
          console.log('New report submitted:', report)
          setShowReportModal(false)
        }}
      />
    </div>
  )
} 