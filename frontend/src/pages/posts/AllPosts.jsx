import { useState, useEffect } from 'react'
import api from '../../services/api'
import Swal from 'sweetalert2'

export default function AllPosts() {
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const fetchPosts = async (pageNumber = 1) => {
    try {
      setLoadingPosts(true)
      const { data } = await api.get(`${apiUrl}/posts?page=${pageNumber}&limit=6`)
      setPosts(data.posts)
      setTotalPages(data.totalPages)
      setPage(data.currentPage)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPosts(false)
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This post will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })
    if (!result.isConfirmed) return
    try {
      await api.delete(`${apiUrl}/posts/${id}`)
      setPosts(prev => prev.filter(p => p._id !== id))
      Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Post has been deleted.', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to delete post' })
    }
  }

  const handleCopyCaption = (caption) => {
    navigator.clipboard.writeText(caption)
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

  useEffect(() => { fetchPosts(1) }, [])

  return (
    <div className="page-card">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg app-gradient shadow-sm">
          <span className="text-lg">📋</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">All Posts</h1>
      </div>

      {loadingPosts ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-green-500" />
            <p className="text-sm">Loading posts...</p>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm">No posts yet. Generate some!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <div
                key={post._id}
                className="flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <img
                  src={post.imageUrl}
                  className="h-44 w-full object-cover"
                  alt="Post"
                />
                <div className="flex flex-1 flex-col p-4">
                  {post.businessId?.name && (
                    <p className="mb-1 text-xs font-medium text-green-600">{post.businessId.name}</p>
                  )}
                  <p className="flex-grow text-sm text-neutral-700 leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDownload(post)}
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
                      onClick={() => handleDelete(post._id)}
                      className="btn-danger btn-sm"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => fetchPosts(page - 1)}
              className="btn-secondary btn-sm disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="text-sm text-neutral-500">
              Page <strong className="text-neutral-700">{page}</strong> of <strong className="text-neutral-700">{totalPages}</strong>
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => fetchPosts(page + 1)}
              className="btn-secondary btn-sm disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
