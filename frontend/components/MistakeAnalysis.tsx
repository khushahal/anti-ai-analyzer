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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mistake Analysis</h1>
          <p className="text-gray-600 mt-1">Comprehensive analysis of AI tool mistakes and error patterns</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button 
            onClick={() => setShowReportModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report New Mistake
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mistake Category</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
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
              className="input-field"
            >
              {aiTools.map(tool => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search mistakes..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => (
          <div key={category.id} className="card text-center">
            <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900">{category.name}</h4>
            <p className="text-2xl font-bold text-gray-900">{category.count}</p>
            <p className="text-sm text-gray-500">mistakes</p>
          </div>
        ))}
      </div>

      {/* Mistakes List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Mistakes</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-success-600" />
              32 Resolved
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-warning-600" />
              15 Pending
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {mistakes.map(mistake => (
            <div key={mistake.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 ${getCategoryColor(mistake.category)} rounded-full`}></div>
                    <span className="font-medium text-gray-900">{mistake.aiTool}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(mistake.severity)}`}>
                      {mistake.severity.toUpperCase()}
                    </span>
                    {getStatusIcon(mistake.status)}
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{mistake.description}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1"><strong>User Query:</strong></p>
                      <p className="text-gray-900 bg-gray-50 p-2 rounded">{mistake.userQuery}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1"><strong>AI Response:</strong></p>
                      <p className="text-gray-900 bg-error-50 p-2 rounded border-l-4 border-error-500">{mistake.aiResponse}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-gray-600 mb-1"><strong>Corrected Answer:</strong></p>
                    <p className="text-gray-900 bg-success-50 p-2 rounded border-l-4 border-success-500">{mistake.correctedAnswer}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span>Impact: {mistake.impact}</span>
                    <span>{new Date(mistake.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="ml-4 flex space-x-2">
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