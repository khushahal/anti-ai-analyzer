'use client'

import { useState } from 'react'
import AIComparison from '@/components/AIComparison'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Menu, X } from 'lucide-react'
import { User } from '@/lib/types'


export default function ComparisonPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isPublicMode, setIsPublicMode] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
          onLogin={() => {}}
          onLogout={() => {}}
          isPublicMode={isPublicMode}
          onToggleMode={() => setIsPublicMode(!isPublicMode)}
          onMobileMenuToggle={() => setIsMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 sm:p-6">
          <AIComparison />
        </main>
      </div>
    </div>
  )
} 