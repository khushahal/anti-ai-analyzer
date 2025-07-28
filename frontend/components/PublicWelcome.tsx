'use client'

import { User, Zap, BarChart3, Shield } from 'lucide-react'

interface PublicWelcomeProps {
  onSignUp: () => void
}

export default function PublicWelcome({ onSignUp }: PublicWelcomeProps) {
  return (
    <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 rounded-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Welcome to Anti-AI Analyzer!</h2>
          <p className="text-primary-100 mb-4">
            You're currently viewing public data. Sign up to get personalized insights and track your own AI usage patterns.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Personal Dashboard</h4>
                <p className="text-sm text-primary-100">Track your own AI usage</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Detailed Analytics</h4>
                <p className="text-sm text-primary-100">Your performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">Mistake Tracking</h4>
                <p className="text-sm text-primary-100">Monitor your AI errors</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onSignUp}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <Zap className="h-5 w-5" />
            <span>Get Started - It's Free!</span>
          </button>
        </div>
        
        <div className="hidden lg:block ml-8">
          <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
            <User className="h-16 w-16 text-white opacity-80" />
          </div>
        </div>
      </div>
    </div>
  )
} 