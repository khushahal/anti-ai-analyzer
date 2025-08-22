'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import UserDashboard from '@/components/UserDashboard'
import AuthModal from '@/components/AuthModal'
import { Menu, X } from 'lucide-react'

interface User {
  name: string
  email: string
  joinDate: string
  totalQueries: number
  preferredAI: string
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isPublicMode, setIsPublicMode] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in (simulate localStorage check)
    const savedUser = localStorage.getItem('antiAIUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
      setIsPublicMode(false)
    }
  }, [])

  const handleLogin = (email: string, password: string) => {
    // Simulate login - in real app, this would be an API call
    const mockUser: User = {
      name: 'John Doe',
      email: email,
      joinDate: '2024-01-01',
      totalQueries: 324,
      preferredAI: 'GPT-4'
    }
    
    setUser(mockUser)
    setIsAuthenticated(true)
    setIsPublicMode(false)
    localStorage.setItem('antiAIUser', JSON.stringify(mockUser))
    setShowAuthModal(false)
  }

  const handleRegister = (name: string, email: string, password: string) => {
    // Simulate registration
    const mockUser: User = {
      name: name,
      email: email,
      joinDate: new Date().toISOString().split('T')[0],
      totalQueries: 0,
      preferredAI: 'GPT-4'
    }
    
    setUser(mockUser)
    setIsAuthenticated(true)
    setIsPublicMode(false)
    localStorage.setItem('antiAIUser', JSON.stringify(mockUser))
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setIsPublicMode(true)
    localStorage.removeItem('antiAIUser')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar 
              activeTab="dashboard"
              setActiveTab={() => {}}
              isAuthenticated={isAuthenticated}
              isPublicMode={isPublicMode}
              onToggleMode={() => setIsPublicMode(!isPublicMode)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          activeTab="dashboard"
          setActiveTab={() => {}}
          isAuthenticated={isAuthenticated}
          isPublicMode={isPublicMode}
          onToggleMode={() => setIsPublicMode(!isPublicMode)}
          isMobile={false}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          isPublicMode={isPublicMode}
          onToggleMode={() => setIsPublicMode(!isPublicMode)}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 sm:p-6">
          {/* Main dashboard content - no more routing logic */}
          {isPublicMode ? (
            <Dashboard isPublicMode={true} onSignUp={() => setShowAuthModal(true)} />
          ) : (
            user ? <UserDashboard user={user} /> : <Dashboard isPublicMode={false} />
          )}
        </main>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  )
} 