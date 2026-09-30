import { useState } from 'react'
import Menu from '../../components/Menu'
import GenerateShort from './GenerateShort'
import AllShorts from './AllShorts'

export default function ShortsPage() {
  const [activeTab, setActiveTab] = useState('generate')

  return (
    <div className="min-h-screen app-gradient">
      <Menu />

      <div className="page-container">
        <div className="mb-6 flex w-full max-w-md mx-auto overflow-hidden rounded-xl bg-white shadow-md border border-neutral-100">
          {[
            { key: 'generate', label: '🎬 Create Short' },
            { key: 'all', label: '📋 All Shorts' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                activeTab === key
                  ? 'bg-success text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mx-auto max-w-4xl">
          {activeTab === 'generate' && <GenerateShort />}
          {activeTab === 'all' && <AllShorts />}
        </div>
      </div>
    </div>
  )
}
