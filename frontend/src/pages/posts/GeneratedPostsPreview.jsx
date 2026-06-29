import { FaRedo } from 'react-icons/fa'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import api from '../../services/api'

export default function GeneratedPostsPreview({
  businessId,
  generatedPosts,
  onPostsSaved,
}) {
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const handleCopyCaption = (caption) => {
    navigator.clipboard.writeText(caption)
  }

  const toInstagramSize = async (imageUrl) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    await new Promise((resolve) => {
      img.onload = resolve
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = 1080
    canvas.height = 1080

    const size = Math.min(img.width, img.height)

    const sx = (img.width - size) / 2
    const sy = (img.height - size) / 2

    ctx.drawImage(
      img,
      sx,
      sy,
      size,
      size,
      0,
      0,
      1080,
      1080
    )

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
      await api.post(`${apiUrl}/posts/save-posts`, {
        businessId,
        posts: [post],
      })

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
      await api.post(`${apiUrl}/posts/save-posts`, {
        businessId,
        posts: generatedPosts,
      })

      toast.dismiss(toastId)
      toast.success('All posts saved successfully')

      onPostsSaved()
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || 'Failed to save posts')
    }
  }

  return (
    <div className='ml-auto mb-2 ml-auto mb-2'>
        <div className="mb-2 flex w-full items-center justify-between rounded-md app-gradient px-4 py-2"> 
          <h1 className="font-medium text-white">
            Generated Posts Preview
          </h1>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-white app-gradient"
          >
            <FaRedo />
            Retry
          </button>
     </div>

      <div className="mt-6 flex items-center justify-between mb-2">
        <button
          onClick={handleSaveAll}
          className="rounded-md bg-green-700 px-4 py-2 text-white"
        >
          💾 Save All Posts
        </button>

        <button
          onClick={handleDownloadAll}
          className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white"
        >
          📦 Download All (ZIP)
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {generatedPosts.map((post, index) => (
          <div
            key={index}
            id={`post-${index}`}
            className="rounded-lg bg-white p-4 shadow"
          >
            <img
              id={`post-image-${index}`}
              src={post.imageUrl}
              alt="Post"
              className="mb-4 h-64 w-full rounded object-cover"
            />

            <p className="mb-3 text-sm text-gray-700">
              {post.caption}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleDownloadPost(post, index)}
                className="rounded-md bg-blue-600 px-3 py-2 text-white"
              >
                📥 Download
              </button>

              <button
                onClick={() => handleCopyCaption(post.caption)}
                className="rounded-md bg-gray-700 px-3 py-2 text-white"
              >
                📋 Copy
              </button>

              <button
                onClick={() => handleSaveSingle(post)}
                className="rounded-md bg-green-600 px-3 py-2 text-white"
              >
                💾 Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
