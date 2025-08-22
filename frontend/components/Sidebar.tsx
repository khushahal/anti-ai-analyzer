'use client'

import { 
  BarChart3, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Zap,
  Shield,
  Target,
  Globe,
  UserCheck,
  Home
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isAuthenticated?: boolean
  isPublicMode?: boolean
  onToggleMode?: () => void
  isMobile?: boolean
}

export default function Sidebar({ 
  isAuthenticated = false, 
  isPublicMode = true, 
  onToggleMode,
  isMobile = false
}: SidebarProps) {
  const pathname = usePathname()
  
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview & Analytics',
      href: '/'
    },
    {
      id: 'mistakes',
      label: 'Mistake Analysis',
      icon: AlertTriangle,
      description: 'AI Error Detection',
      href: '/mistakes'
    },
    {
      id: 'realtime',
      label: 'Real-time Feed',
      icon: Activity,
      description: 'Live AI Performance',
      href: '/realtime'
    },
    {
      id: 'comparison',
      label: 'AI Comparison',
      icon: TrendingUp,
      description: 'Tool Performance',
      href: '/comparison'
    }
  ]

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-64'} bg-white border-r border-gray-200 flex flex-col`}>
      <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-gray-200`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Anti-AI</h2>
            <p className="text-sm text-gray-500">Analyzer v1.0</p>
          </div>
        </div>
      </div>
      
      <nav className={`flex-1 ${isMobile ? 'p-3' : 'p-4'}`}>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href === '/' && pathname === '/')
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium truncate">{item.label}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-t border-gray-200 space-y-3`}>
        {/* Mode Toggle */}
        {isAuthenticated && (
          <button
            onClick={onToggleMode}
            className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg transition-colors bg-gradient-to-r from-primary-50 to-purple-50 hover:from-primary-100 hover:to-purple-100"
          >
            {isPublicMode ? (
              <>
                <Globe className="h-5 w-5 text-primary-600" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-primary-700 truncate">Public Mode</div>
                  <div className="text-xs text-primary-600 truncate">View general statistics</div>
                </div>
              </>
            ) : (
              <>
                <UserCheck className="h-5 w-5 text-primary-600" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-primary-700 truncate">Personal Mode</div>
                  <div className="text-xs text-primary-600 truncate">View your data</div>
                </div>
              </>
            )}
          </button>
        )}

        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">
              {isPublicMode ? 'Global Stats' : 'Your Stats'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">AI Tools Monitored</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Mistakes Detected</span>
              <span className="font-medium text-error-600">
                {isPublicMode ? '47' : '16'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Accuracy Score</span>
              <span className="font-medium text-success-600">
                {isPublicMode ? '89.2%' : '91.8%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
} 