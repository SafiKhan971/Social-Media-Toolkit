import { useState, useEffect } from 'react'
import Menu from '../components/Menu'
import axios from 'axios'
import { FaRedo, FaSave } from 'react-icons/fa'
import { toast } from 'sonner'



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

  // pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)


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
          businessId: selectedBusiness,
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

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    {/* Business Select */}
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Select Business
                      </label>

                      <select
                        value={selectedBusiness}
                        onChange={(e) =>
                          setSelectedBusiness(e.target.value)
                        }
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
                <div>
                  <h1 className="mb-6 text-2xl font-semibold">
                    Generated Posts Preview
                  </h1>

                  <div className="grid gap-6 md:grid-cols-2">
                    {generatedPosts.map((post, index) => (
                      <div
                        key={index}
                        className="rounded-lg bg-white p-4 shadow"
                      >
                        <img
                          src={post.imageUrl}
                          alt="Post"
                          className="mb-4 h-64 w-full rounded object-cover"
                        />

                        <textarea
                          rows={5}
                          value={post.caption}
                          onChange={(e) =>
                            handleCaptionChange(index, e.target.value)
                          }
                          className="w-full rounded-md border p-2"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-white"
                    >
                      <FaRedo />
                      Retry
                    </button>

                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white"
                    >
                      <FaSave />
                      Save
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= ALL POSTS TAB ================= */}
          {activeTab === 'all' && (
            <div>
              <h1 className="mb-6 text-2xl font-semibold">
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
