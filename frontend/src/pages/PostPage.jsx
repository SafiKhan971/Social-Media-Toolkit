import { useState, useEffect } from 'react'
import Menu from '../components/Menu'
import axios from 'axios'
import { FaRedo, FaSave } from 'react-icons/fa'
import { toast } from 'sonner'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Swal from 'sweetalert2'



export default function PostPage() {
  const [selectedBusiness, setSelectedBusiness] = useState('')
  const [numberOfPosts, setNumberOfPosts] = useState(1)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [generatedPosts, setGeneratedPosts] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [postType, setPostType] = useState('business')
  const [instantDescription, setInstantDescription] = useState('')


  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const fetchPosts = async (pageNumber = 1) => {
    try {
      setLoadingPosts(true)

      const { data } = await axios.get(`${apiUrl}/posts?page=${pageNumber}&limit=6`)

      setPosts(data.posts)
      setTotalPages(data.totalPages)
      setPage(data.currentPage)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPosts(false)
    }
  }

  async function fetchBusinesses() {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/businesses`)
      if (!res.ok) throw new Error('Failed to load businesses')
      const data = await res.json()
      setBusinesses(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const toastId = toast.loading('Generating posts...')

    try {
      setLoading(true)

      const { data } = await axios.post(
        `${apiUrl}/posts/generate-posts`,
        {
          postType,
          businessId:
            postType === 'business'
              ? selectedBusiness
              : null,
          description:
            postType === 'instant'
              ? instantDescription
              : null,
          numberOfPosts,
        }
      )

      setGeneratedPosts(data.posts)
      setPreviewMode(true)

      toast.dismiss(toastId)
      toast.success(data.message || 'Posts generated successfully')
    } catch (err) {
      toast.dismiss(toastId)

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCaptionChange = (index, value) => {
    const updated = [...generatedPosts]

    updated[index].caption = value

    setGeneratedPosts(updated)
  }


  const handleSave = async () => {
    const toastId = toast.loading('Saving posts...')

    try {
      await axios.post(`${apiUrl}/posts/save-posts`, {
        businessId: selectedBusiness,
        posts: generatedPosts,
      })

      toast.dismiss(toastId)
      toast.success('Posts saved successfully')

      setGeneratedPosts([])
      setPreviewMode(false)
      setSelectedBusiness('')
      setNumberOfPosts('')
    } catch (err) {
      toast.dismiss(toastId)

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Failed to save posts'
      )
    }
  }

  const handleSaveSingle = async (post) => {
    const toastId = toast.loading('Saving post...')

    try {
      await axios.post(`${apiUrl}/posts/save-posts`, {
        businessId: selectedBusiness,
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
      await axios.post(`${apiUrl}/posts/save-posts`, {
        businessId: selectedBusiness,
        posts: generatedPosts,
      })

      toast.dismiss(toastId)
      toast.success('All posts saved successfully')

      setGeneratedPosts([])
      setPreviewMode(false)
      setSelectedBusiness('')
      setNumberOfPosts('')
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || 'Failed to save posts')
    }
  }

  const handleRetry = () => {
    setGeneratedPosts([])
    setPreviewMode(false)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)

    if (tab === 'all') {
      fetchPosts(1)
    }
  }

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

  const handleDownload = async (post) => {
    try {
      const response = await fetch(post.imageUrl)
      const blob = await response.blob()

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `post-${post._id}.jpg`
      link.click()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This post will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (!result.isConfirmed) return

    try {
      await axios.delete(`${apiUrl}/posts/${id}`)

      setPosts((prev) => prev.filter((p) => p._id !== id))

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Post has been deleted successfully.',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Failed to delete post',
      })
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  return (
    <div className="min-h-screen bg-green-400">
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
              fetchPosts(1)
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
                <div className="rounded-lg bg-white p-8 shadow-md">
                  <h1 className="mb-6 text-2xl font-semibold">
                    Generate Posts
                  </h1>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Post Type
                    </label>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="postType"
                          value="business"
                          checked={postType === 'business'}
                          onChange={(e) => setPostType(e.target.value)}
                        />
                        Business Post
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="postType"
                          value="instant"
                          checked={postType === 'instant'}
                          onChange={(e) => setPostType(e.target.value)}
                        />
                        Instant Post
                      </label>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    {postType === 'business' ? (
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Select Business
                        </label>

                        <select
                          value={selectedBusiness}
                          onChange={(e) => setSelectedBusiness(e.target.value)}
                          className="w-full rounded-md border px-3 py-2"
                        >
                          <option value="" disabled>
                            Select Business
                          </option>

                          {businesses.map((business) => (
                            <option
                              key={business._id}
                              value={business._id}
                            >
                              {business.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Post Description
                        </label>

                        <textarea
                          rows={5}
                          value={instantDescription}
                          onChange={(e) =>
                            setInstantDescription(e.target.value)
                          }
                          placeholder="Describe what kind of post you want to generate..."
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                    )}

                    {/* Number of Posts */}
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Number of Posts
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={numberOfPosts}
                        onChange={(e) =>
                          setNumberOfPosts(e.target.value)
                        }
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-md bg-green-500 px-4 py-2 text-white"
                    >
                      {loading ? 'Generating...' : 'Generate'}
                    </button>
                  </form>
                </div>
              ) : (
                /* PREVIEW MODE */
                <div className='ml-auto mb-2 ml-auto mb-2'>
                  <h1 className="flex items-center gap-2 rounded-md bg-green-700 px-4 py-2 text-white">
                    Generated Posts Preview
                  </h1>

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
                        {/* Image */}
                        <img
                          id={`post-image-${index}`}
                          src={post.imageUrl}
                          alt="Post"
                          className="mb-4 h-64 w-full rounded object-cover"
                        />

                        {/* Caption */}
                        <p className="mb-3 text-sm text-gray-700">
                          {post.caption}
                        </p>

                        {/* Buttons */}
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
              )}
            </>
          )}

          {/* ================= ALL POSTS TAB ================= */}
          {activeTab === 'all' && (
            <div>
              <h1 className="mb-6 text-2xl font-semibold text-white">
                All Posts
              </h1>

              {loadingPosts ? (
                <p className="text-gray-600">Loading posts...</p>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-3">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="rounded-lg bg-white p-4 shadow"
                      >
                        <img
                          src={post.imageUrl}
                          className="h-48 w-full rounded object-cover"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                          {post.businessId?.name}
                        </p>

                        <p className="mt-1 text-sm">
                          {post.caption}
                        </p>

                        <div className="mt-3 flex gap-2 flex-row">
                          <button
                            onClick={() => handleDownload(post)}
                            className="rounded bg-blue-500 px-3 py-1 text-white text-xs"
                          >
                            📥 Download
                          </button>

                          <button
                            onClick={() => handleCopyCaption(post.caption)}
                            className="rounded bg-gray-500 px-3 py-1 text-white text-xs"
                          >
                            📋 Copy Caption
                          </button>

                          <button
                            onClick={() => handleDelete(post._id)}
                            className="rounded bg-red-500 px-3 py-1 text-white text-xs"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      disabled={page === 1}
                      onClick={() => fetchPosts(page - 1)}
                      className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
                    >
                      Prev
                    </button>

                    <span className="text-sm">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages}
                      onClick={() => fetchPosts(page + 1)}
                      className="rounded bg-gray-200 px-3 py-1 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
