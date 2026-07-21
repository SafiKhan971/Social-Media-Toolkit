import { useState, useEffect } from 'react'
import api from '../../services/api'
import Swal from 'sweetalert2'


export default function AllPosts() {

  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [instantDescription, setInstantDescription] = useState('')

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
      text: "This post will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`${apiUrl}/posts/${id}`)

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

  useEffect(() => {
    fetchPosts(1)
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white">
        All Posts
      </h1>

      {loadingPosts ? (
        <p className="text-gray-600">Loading posts...</p>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="rounded-lg bg-white p-4 shadow flex flex-col h-full"
              >
                <img
                  src={post.imageUrl}
                  className="h-48 w-full rounded object-cover"
                />

                <p className="mt-2 text-xs text-gray-500">
                  {post.businessId?.name}
                </p>

                <p className="mt-1 text-sm flex-grow">
                  {post.caption}
                </p>
<div className="mt-3 flex  flex-row justify-center gap-5">
  <div className="group relative">
    <button
      onClick={() => handleDownload(post)}
      className="rounded-lg bg-blue-500 px-2.5 py-1.5 text-white text-2xl cursor-pointer hover:bg-blue-600 transition"
    >
      📥
    </button>
    <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-1 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
      Download post
    </span>
  </div>

  <div className="group relative">
    <button
      onClick={() => handleCopyCaption(post.caption)}
      className="rounded-lg bg-gray-500 px-2.5 py-1.5 text-white text-2xl cursor-pointer hover:bg-gray-600 transition"
    >
      📋
    </button>
    <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
      Copy caption to clipboard
    </span>
  </div>

  <div className="group relative">
    <button
      onClick={() => handleDelete(post._id)}
      className="rounded-lg bg-red-500 px-2.5 py-1.5 text-white text-2xl cursor-pointer hover:bg-red-600 transition"
    >
      🗑
    </button>
    <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
      Delete this post
    </span>
  </div>
</div>
               
              </div>
            ))}
          </div>

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
  )
}
