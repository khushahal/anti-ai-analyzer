'use client'

import { Bell, Search, Settings, User, LogIn, LogOut, Globe, UserCheck, Menu } from 'lucide-react'

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
  onMobileMenuToggle?: () => void
}

export default function Header({ 
  isAuthenticated = false, 
  user, 
  onLogin, 
  onLogout, 
  isPublicMode = true, 
  onToggleMode,
  onMobileMenuToggle
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <h1 className="text-lg sm:text-2xl font-bold text-gradient">
            Anti-AI Analyzer
          </h1>
          
          {/* Search Bar - Hidden on mobile, visible on tablet+ */}
          <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search AI tools, mistakes, or analysis..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-60 lg:w-80"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          {/* Notifications - Hidden on mobile */}
          <button className="hidden sm:block relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Settings - Hidden on mobile */}
          <button className="hidden sm:block p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          {/* Mode Toggle - Hidden on mobile, shown in sidebar */}
          <button 
            onClick={onToggleMode}
            className="hidden lg:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* User info - Simplified on mobile */}
              <button className="hidden sm:flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.name || 'User'}</span>
              </button>
              
              {/* Mobile user button */}
              <button className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="h-5 w-5" />
              </button>
              
              <button 
                onClick={onLogout}
                className="hidden sm:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
            >
              <LogIn className="h-4 w-4" />
              <span className="font-medium hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="mt-3 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search AI tools, mistakes, or analysis..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  )
} 