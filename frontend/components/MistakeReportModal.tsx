'use client'

import { useState } from 'react'
import { X, AlertTriangle, Send, CheckCircle, Loader } from 'lucide-react'

interface MistakeReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (report: MistakeReport) => void
}

export interface MistakeReport {
  id: string
  aiTool: string
  category: string
  severity: string
  userQuery: string
  aiResponse: string
  correctedAnswer: string
  description: string
  impact: string
  reporter: string
  timestamp: string
  upvotes: number
  downvotes: number
  status: 'pending' | 'verified' | 'rejected'
}

export default function MistakeReportModal({ isOpen, onClose, onSubmit }: MistakeReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    aiTool: '',
    category: '',
    severity: '',
    userQuery: '',
    aiResponse: '',
    correctedAnswer: '',
    description: '',
    impact: ''
  })

  const aiTools = [
    'GPT-4', 'Claude-3', 'Gemini Pro', 'Llama-2', 'PaLM-2', 'Other'
  ]

  const categories = [
    { id: 'factual', name: 'Factual Error', description: 'Incorrect information or data' },
    { id: 'logical', name: 'Logical Fallacy', description: 'Flawed reasoning or arguments' },
    { id: 'bias', name: 'Bias Issue', description: 'Gender, racial, or other forms of bias' },
    { id: 'context', name: 'Context Error', description: 'Misunderstanding of context' },
    { id: 'other', name: 'Other', description: 'Other types of mistakes' }
  ]

  const severityLevels = [
    { id: 'low', name: 'Low', description: 'Minor error, minimal impact' },
    { id: 'medium', name: 'Medium', description: 'Moderate error, some impact' },
    { id: 'high', name: 'High', description: 'Significant error, high impact' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const report: MistakeReport = {
      id: Date.now().toString(),
      ...formData,
      reporter: 'Anonymous User',
      timestamp: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      status: 'pending'
    }

    onSubmit(report)
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 2 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        aiTool: '',
        category: '',
        severity: '',
        userQuery: '',
        aiResponse: '',
        correctedAnswer: '',
        description: '',
        impact: ''
      })
      onClose()
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for reporting this AI mistake. Our team will review it and it will appear in the live feed shortly.
          </p>
          <div className="animate-pulse">
            <Loader className="h-6 w-6 text-primary-600 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-error-600" />
            <h2 className="text-xl font-semibold text-gray-900">Report AI Mistake</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* AI Tool Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Tool <span className="text-error-600">*</span>
            </label>
            <select
              value={formData.aiTool}
              onChange={(e) => handleInputChange('aiTool', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select AI Tool</option>
              {aiTools.map(tool => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          {/* Category and Severity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mistake Category <span className="text-error-600">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} - {category.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity Level <span className="text-error-600">*</span>
              </label>
              <select
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select Severity</option>
                {severityLevels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Query */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Query <span className="text-error-600">*</span>
            </label>
            <textarea
              value={formData.userQuery}
              onChange={(e) => handleInputChange('userQuery', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="What did you ask the AI?"
              required
            />
          </div>

          {/* AI Response */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Response <span className="text-error-600">*</span>
            </label>
            <textarea
              value={formData.aiResponse}
              onChange={(e) => handleInputChange('aiResponse', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="What was the incorrect response from the AI?"
              required
            />
          </div>

          {/* Corrected Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Corrected Answer <span className="text-error-600">*</span>
            </label>
            <textarea
              value={formData.correctedAnswer}
              onChange={(e) => handleInputChange('correctedAnswer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="What should the correct answer be?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-error-600">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              placeholder="Briefly describe the mistake and why it's problematic"
              required
            />
          </div>

          {/* Impact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Potential Impact
            </label>
            <textarea
              value={formData.impact}
              onChange={(e) => handleInputChange('impact', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={2}
              placeholder="What could be the consequences of this mistake? (optional)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 