import { useState } from 'react'
import Menu from '../../components/Menu'
import AllPosts from './AllPosts'
import GeneratePost from './GeneratePost'
import GeneratedPostsPreview from './GeneratedPostsPreview'

export default function PostPage() {
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')

  return (
    <div className="min-h-screen app-gradient">
      <Menu />

      <div className="page-container">

        {/* Tab Bar */}
        <div className="mb-6 flex w-full max-w-xs mx-auto overflow-hidden rounded-xl bg-white shadow-md border border-neutral-100">
          {[
            { key: 'generate', label: '✨ Generate' },
            { key: 'all', label: '📋 All Posts' },
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

        {/* Tab Content */}
        <div className="mx-auto max-w-4xl">
          {activeTab === 'generate' && (
            <GeneratePost loading={loading} />
          )}
          {activeTab === 'all' && (
            <AllPosts />
          )}
        </div>
      </div>
    </div>
  )
}
