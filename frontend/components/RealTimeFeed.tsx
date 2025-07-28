'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Eye,
  Filter,
  Plus,
  MessageSquare
} from 'lucide-react'
import MistakeReportModal, { MistakeReport } from './MistakeReportModal'
import VotingComponent from './VotingComponent'

export default function RealTimeFeed() {
  const [isConnected, setIsConnected] = useState(true)
  const [feedItems, setFeedItems] = useState<any[]>([])
  const [userReports, setUserReports] = useState<MistakeReport[]>([])
  const [filter, setFilter] = useState('all')
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    // Simulate real-time data
    const interval = setInterval(() => {
      const newItem = generateFeedItem()
      setFeedItems(prev => [newItem, ...prev.slice(0, 49)]) // Keep only 50 items
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const generateFeedItem = () => {
    const types = ['mistake', 'performance', 'update', 'alert']
    const aiTools = ['GPT-4', 'Claude-3', 'Gemini Pro', 'Llama-2', 'PaLM-2']
    const type = types[Math.floor(Math.random() * types.length)]
    const aiTool = aiTools[Math.floor(Math.random() * aiTools.length)]
    
    return {
      id: Date.now(),
      type,
      aiTool,
      message: generateMessage(type, aiTool),
      timestamp: new Date().toISOString(),
      severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    }
  }

  const generateMessage = (type: string, aiTool: string) => {
    const messages = {
      mistake: [
        `${aiTool} made a factual error in response to user query`,
        `${aiTool} demonstrated bias in career recommendation`,
        `${aiTool} provided incorrect mathematical calculation`,
        `${aiTool} failed to understand context properly`
      ],
      performance: [
        `${aiTool} response time improved to 1.2s`,
        `${aiTool} accuracy score increased to 94.5%`,
        `${aiTool} processed 1000+ queries successfully`,
        `${aiTool} achieved new performance milestone`
      ],
      update: [
        `${aiTool} model updated to latest version`,
        `${aiTool} new features deployed successfully`,
        `${aiTool} maintenance completed`,
        `${aiTool} configuration optimized`
      ],
      alert: [
        `${aiTool} experiencing high latency`,
        `${aiTool} error rate increased`,
        `${aiTool} service temporarily degraded`,
        `${aiTool} requires attention`
      ]
    }
    
    const typeMessages = messages[type as keyof typeof messages]
    return typeMessages[Math.floor(Math.random() * typeMessages.length)]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user-report':
        return <MessageSquare className="h-4 w-4 text-primary-600" />
      case 'mistake':
        return <AlertTriangle className="h-4 w-4 text-error-600" />
      case 'performance':
        return <TrendingUp className="h-4 w-4 text-success-600" />
      case 'update':
        return <Zap className="h-4 w-4 text-primary-600" />
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-warning-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user-report':
        return 'bg-primary-50 border-primary-200'
      case 'mistake':
        return 'bg-error-50 border-error-200'
      case 'performance':
        return 'bg-success-50 border-success-200'
      case 'update':
        return 'bg-primary-50 border-primary-200'
      case 'alert':
        return 'bg-warning-50 border-warning-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      high: 'bg-error-100 text-error-800',
      medium: 'bg-warning-100 text-warning-800',
      low: 'bg-success-100 text-success-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[severity as keyof typeof colors]}`}>
        {severity.toUpperCase()}
      </span>
    )
  }

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = now.getTime() - time.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return time.toLocaleDateString()
  }

  const handleReportSubmit = (report: MistakeReport) => {
    setUserReports(prev => [report, ...prev])
  }

  const handleVote = (id: string, type: 'upvote' | 'downvote') => {
    setUserReports(prev => prev.map(report => {
      if (report.id === id) {
        if (type === 'upvote') {
          return { ...report, upvotes: report.upvotes + 1 }
        } else {
          return { ...report, downvotes: report.downvotes + 1 }
        }
      }
      return report
    }))
  }

  const allItems = [...userReports.map(report => ({
    id: report.id,
    type: 'user-report',
    aiTool: report.aiTool,
    message: `New mistake reported: ${report.description}`,
    timestamp: report.timestamp,
    severity: report.severity,
    report: report
  })), ...feedItems]

  const filteredItems = filter === 'all' 
    ? allItems 
    : filter === 'user-report'
      ? allItems.filter(item => item.type === 'user-report')
      : allItems.filter(item => item.type === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real-time Feed</h1>
            <p className="text-gray-600 mt-1">Live monitoring of AI tool performance and activities</p>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-success-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-error-600" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-success-600' : 'text-error-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Report Mistake</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border-none outline-none bg-transparent"
            >
              <option value="all">All Events</option>
              <option value="user-report">User Reports</option>
              <option value="mistake">System Mistakes</option>
              <option value="performance">Performance</option>
              <option value="update">Updates</option>
              <option value="alert">Alerts</option>
            </select>
          </div>
          
          <button 
            onClick={() => setIsConnected(!isConnected)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isConnected 
                ? 'bg-error-100 text-error-700 hover:bg-error-200' 
                : 'bg-success-100 text-success-700 hover:bg-success-200'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Events Today</p>
              <p className="text-2xl font-bold text-gray-900">{feedItems.length}</p>
            </div>
            <Activity className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mistakes</p>
              <p className="text-2xl font-bold text-error-600">
                {feedItems.filter(item => item.type === 'mistake').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-error-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performance</p>
              <p className="text-2xl font-bold text-success-600">
                {feedItems.filter(item => item.type === 'performance').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-success-600" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-warning-600">
                {feedItems.filter(item => item.type === 'alert').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning-600" />
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getTypeColor(item.type)} animate-slide-up`}
            >
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">{item.aiTool}</span>
                  {getSeverityBadge(item.severity)}
                  <span className="text-xs text-gray-500">
                    {formatTime(item.timestamp)}
                  </span>
                  {item.type === 'user-report' && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      User Report
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{item.message}</p>
                
                {/* Show voting for user reports */}
                {item.type === 'user-report' && item.report && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1"><strong>Query:</strong></p>
                        <p className="text-gray-900 bg-gray-50 p-2 rounded">{item.report.userQuery}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1"><strong>AI Response:</strong></p>
                        <p className="text-gray-900 bg-error-50 p-2 rounded border-l-4 border-error-500">{item.report.aiResponse}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-600 mb-1"><strong>Corrected Answer:</strong></p>
                      <p className="text-gray-900 bg-success-50 p-2 rounded border-l-4 border-success-500">{item.report.correctedAnswer}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <VotingComponent
                        id={item.report.id}
                        initialUpvotes={item.report.upvotes}
                        initialDownvotes={item.report.downvotes}
                        onVote={handleVote}
                      />
                      <span className="text-xs text-gray-500">by {item.report.reporter}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No events to display</p>
            </div>
          )}
        </div>
      </div>

      {/* Mistake Report Modal */}
      <MistakeReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />

      {/* Connection Status */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success-500' : 'bg-error-500'}`}></div>
            <span className="text-sm font-medium">WebSocket Connection</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-sm font-medium">API Endpoints</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-sm font-medium">Data Stream</span>
          </div>
        </div>
      </div>
    </div>
  )
} 