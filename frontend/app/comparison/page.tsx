'use client'

import { useState } from 'react'
import AIComparison from '@/components/AIComparison'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function ComparisonPage() {
  const [activeTab, setActiveTab] = useState('comparison')

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <AIComparison />
        </main>
      </div>
    </div>
  )
} 