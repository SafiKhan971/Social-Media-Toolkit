import { useState, useEffect } from 'react'
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

      <div className="mx-auto max-w-5xl p-4">

        {/* Tabs */}
        <div className="mb-6 flex border-b bg-white rounded-md w-1/2 mx-auto">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'generate'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-500'
              }`}
          >
            Generate Posts
          </button>

          <button
            onClick={() => {
              setActiveTab('all')
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium ${activeTab === 'all'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-500'
              }`}
          >
            All Posts
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="mx-auto max-w-4xl p-6">

          {/* ================= GENERATE TAB ================= */}
          {activeTab === 'generate' && (
            <>
              {/* PREVIEW MODE */}
              {!previewMode ? (
                <GeneratePost
                  loading={loading}
                />
              ) : (
                /* PREVIEW MODE */
                <GeneratedPostsPreview />
              )}
            </>
          )}

          {/* ================= ALL POSTS TAB ================= */}
          {activeTab === 'all' && (
            <AllPosts />
          )}

        </div>
      </div>
    </div>
  )
}
