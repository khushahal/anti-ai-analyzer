'use client'

import { Bell, Search, Settings, User, LogIn, LogOut, Globe, UserCheck } from 'lucide-react'

interface User {
  name: string
  email: string
  joinDate: string
  totalQueries: number
  preferredAI: string
}

interface HeaderProps {
  isAuthenticated?: boolean
  user?: User | null
  onLogin?: () => void
  onLogout?: () => void
  isPublicMode?: boolean
  onToggleMode?: () => void
}

export default function Header({ 
  isAuthenticated = false, 
  user, 
  onLogin, 
  onLogout, 
  isPublicMode = true, 
  onToggleMode 
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gradient">
            Anti-AI Analyzer
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search AI tools, mistakes, or analysis..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          {/* Mode Toggle */}
          <button 
            onClick={onToggleMode}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isPublicMode ? (
              <>
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Public Mode</span>
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                <span className="text-sm font-medium">Personal Mode</span>
              </>
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.name || 'User'}</span>
              </button>
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
} 