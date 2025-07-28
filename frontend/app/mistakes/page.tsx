'use client'

import { useState } from 'react'
import MistakeAnalysis from '@/components/MistakeAnalysis'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function MistakesPage() {
  const [activeTab, setActiveTab] = useState('mistakes')

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <MistakeAnalysis />
        </main>
      </div>
    </div>
  )
} 