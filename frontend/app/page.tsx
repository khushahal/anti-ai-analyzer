'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import MistakeAnalysis from '@/components/MistakeAnalysis'
import RealTimeFeed from '@/components/RealTimeFeed'
import AIComparison from '@/components/AIComparison'
import UserDashboard from '@/components/UserDashboard'
import AuthModal from '@/components/AuthModal'

interface User {
  name: string
  email: string
  joinDate: string
  totalQueries: number
  preferredAI: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isPublicMode, setIsPublicMode] = useState(true)

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

  const renderContent = () => {
    if (isPublicMode) {
      // Public dashboard for all users
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard isPublicMode={true} onSignUp={() => setShowAuthModal(true)} />
        case 'mistakes':
          return <MistakeAnalysis />
        case 'realtime':
          return <RealTimeFeed />
        case 'comparison':
          return <AIComparison />
        default:
          return <Dashboard isPublicMode={true} onSignUp={() => setShowAuthModal(true)} />
      }
    } else {
      // User-specific dashboard
      switch (activeTab) {
        case 'dashboard':
          return user ? <UserDashboard user={user} /> : <Dashboard isPublicMode={false} />
        case 'mistakes':
          return <MistakeAnalysis />
        case 'realtime':
          return <RealTimeFeed />
        case 'comparison':
          return <AIComparison />
        default:
          return user ? <UserDashboard user={user} /> : <Dashboard isPublicMode={false} />
      }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isAuthenticated={isAuthenticated}
        isPublicMode={isPublicMode}
        onToggleMode={() => setIsPublicMode(!isPublicMode)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          isPublicMode={isPublicMode}
          onToggleMode={() => setIsPublicMode(!isPublicMode)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
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