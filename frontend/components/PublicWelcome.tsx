'use client'

import { User, Zap, BarChart3, Shield } from 'lucide-react'

interface PublicWelcomeProps {
  onSignUp: () => void
}

export default function PublicWelcome({ onSignUp }: PublicWelcomeProps) {
  return (
    <div className="bg-gradient-to-r from-primary-600 via-purple-600 to-primary-700 rounded-lg p-4 sm:p-6 text-white mb-4 sm:mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome to AI Analyzer!</h2>
          <p className="text-primary-100 mb-4 text-sm sm:text-base">
            You're currently viewing public data. Sign up to get personalized insights and track your own AI usage patterns.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm sm:text-base">Personal Dashboard</h4>
                <p className="text-xs sm:text-sm text-primary-100">Track your own AI usage</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm sm:text-base">Detailed Analytics</h4>
                <p className="text-xs sm:text-sm text-primary-100">Your performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 sm:col-span-2 lg:col-span-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm sm:text-base">Mistake Tracking</h4>
                <p className="text-xs sm:text-sm text-primary-100">Monitor your AI errors</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onSignUp}
            className="w-full sm:w-auto bg-white text-primary-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center sm:justify-start space-x-2 text-sm sm:text-base"
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Get Started - It's Free!</span>
          </button>
        </div>
        
        <div className="hidden lg:block ml-8 flex-shrink-0">
          <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
            <User className="h-16 w-16 text-white opacity-80" />
          </div>
        </div>
      </div>
    </div>
  )
} 