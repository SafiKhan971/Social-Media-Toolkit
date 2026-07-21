import { FaRedo } from 'react-icons/fa'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import api from '../../services/api'

export default function GeneratedPostsPreview({ businessId, generatedPosts, onPostsSaved }) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const handleCopyCaption = (caption) => {
    navigator.clipboard.writeText(caption)
  }

  const toInstagramSize = async (imageUrl) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl
    await new Promise(resolve => { img.onload = resolve })
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 1080
    canvas.height = 1080
    const size = Math.min(img.width, img.height)
    const sx = (img.width - size) / 2
    const sy = (img.height - size) / 2
    ctx.drawImage(img, sx, sy, size, size, 0, 0, 1080, 1080)
    return canvas.toDataURL('image/jpeg', 0.9)
  }

  const handleDownloadPost = async (post, index) => {
    const dataUrl = await toInstagramSize(post.imageUrl)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `post-${index}-1080x1080.jpg`
    link.click()
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    for (let i = 0; i < generatedPosts.length; i++) {
      const post = generatedPosts[i]
      const dataUrl = await toInstagramSize(post.imageUrl)
      const base64 = dataUrl.split(',')[1]
      zip.file(`post-${i + 1}.jpg`, base64, { base64: true })
    }
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'instagram-posts.zip')
  }

  const handleSaveSingle = async (post) => {
    const toastId = toast.loading('Saving post...')
    try {
      await api.post(`${apiUrl}/posts/save-posts`, { businessId, posts: [post] })
      toast.dismiss(toastId)
      toast.success('Post saved')
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || 'Failed to save post')
    }
  }

  const handleSaveAll = async () => {
    const toastId = toast.loading('Saving all posts...')
    try {
      await api.post(`${apiUrl}/posts/save-posts`, { businessId, posts: generatedPosts })
      toast.dismiss(toastId)
      toast.success('All posts saved successfully')
      onPostsSaved()
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || 'Failed to save posts')
    }
  }

  return (
    <div className="page-card">
      {/* Header bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg app-gradient shadow-sm">
            <span className="text-lg">🖼️</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-800">Generated Posts Preview</h1>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          <FaRedo className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>

      {/* Bulk actions */}
      <div className="mb-6 flex flex-wrap gap-3 border-b border-neutral-100 pb-6">
        <button onClick={handleSaveAll} className="btn-primary">
          💾 Save All Posts
        </button>
        <button onClick={handleDownloadAll} className="btn-secondary">
          📦 Download All (ZIP)
        </button>
      </div>

      {/* Post grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {generatedPosts.map((post, index) => (
          <div
            key={index}
            id={`post-${index}`}
            className="flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
          >
            <img
              id={`post-image-${index}`}
              src={post.imageUrl}
              alt="Post"
              className="h-52 w-full object-cover"
            />
            <div className="flex flex-1 flex-col p-4">
              <p className="flex-grow text-sm text-neutral-700 leading-relaxed line-clamp-3">
                {post.caption}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleDownloadPost(post, index)}
                  className="btn-primary btn-sm"
                >
                  📥 Download
                </button>
                <button
                  onClick={() => handleCopyCaption(post.caption)}
                  className="btn-secondary btn-sm"
                >
                  📋 Copy
                </button>
                <button
                  onClick={() => handleSaveSingle(post)}
                  className="btn-primary btn-sm"
                >
                  💾 Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
