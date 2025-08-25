'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import UserDashboard from '@/components/UserDashboard'
import AuthModal from '@/components/AuthModal'
import CoffeeModal from '@/components/CoffeeModal'
import { Menu, X } from 'lucide-react'
import { authService, User } from '@/lib/auth'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCoffeeModal, setShowCoffeeModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isPublicMode, setIsPublicMode] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getUser()
          if (user) {
            setUser(user)
            setIsAuthenticated(true)
            setIsPublicMode(false)
          } else {
            // Try to get fresh user data
            const freshUser = await authService.getProfile()
            if (freshUser) {
              setUser(freshUser)
              setIsAuthenticated(true)
              setIsPublicMode(false)
            } else {
              // Invalid token, clear auth
              authService.clearAuth()
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        authService.clearAuth()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      
      if (response.success && response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
        setIsPublicMode(false)
        setShowAuthModal(false)
      } else {
        // Handle login error
        console.error('Login failed:', response.message)
        // You could show a toast notification here
        alert(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password })
      
      if (response.success && response.user) {
        setUser(response.user)
        setIsAuthenticated(true)
        setIsPublicMode(false)
        setShowAuthModal(false)
      } else {
        // Handle registration error
        console.error('Registration failed:', response.message)
        if (response.errors) {
          alert(`Registration failed: ${response.errors.map(e => e.msg).join(', ')}`)
        } else {
          alert(response.message || 'Registration failed')
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    }
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
    setIsPublicMode(true)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
          onCoffeeClick={() => setShowCoffeeModal(true)}
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
      
      <CoffeeModal
        isOpen={showCoffeeModal}
        onClose={() => setShowCoffeeModal(false)}
      />
    </div>
  )
} 