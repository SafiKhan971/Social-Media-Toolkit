import { useEffect, useState } from 'react'
import api from '../../services/api'
import Swal from 'sweetalert2'

export default function AllShorts() {
  const [shorts, setShorts] = useState([])
  const [loadingShorts, setLoadingShorts] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [previewShort, setPreviewShort] = useState(null)

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const fetchShorts = async (pageNumber = 1) => {
    try {
      setLoadingShorts(true)
      const { data } = await api.get(`${apiUrl}/shorts?page=${pageNumber}&limit=6`)
      setShorts(data.shorts)
      setTotalPages(data.totalPages)
      setPage(data.currentPage)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingShorts(false)
    }
  }

  const handleDelete = async id => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This Short will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })
    if (!result.isConfirmed) return

    try {
      await api.delete(`${apiUrl}/shorts/${id}`)
      setShorts(prev => prev.filter(item => item._id !== id))
      Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Short has been deleted.', timer: 1500, showConfirmButton: false })
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Failed to delete Short' })
    }
  }

  const handleCopyCaption = caption => {
    navigator.clipboard.writeText(caption || '')
  }

  const handleDownload = async short => {
    try {
      const response = await fetch(short.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `short-${short._id}.mp4`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  useEffect(() => {
    fetchShorts(1)
  }, [])

  return (
    <div className="page-card">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg app-gradient shadow-sm">
          <span className="text-lg">📋</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800">All Shorts</h1>
      </div>

      {loadingShorts ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-green-500" />
            <p className="text-sm">Loading shorts...</p>
          </div>
        </div>
      ) : shorts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <span className="text-4xl mb-3">📭</span>
          <p className="text-sm">No Shorts yet. Create one from your voice script!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shorts.map(short => (
              <div
                key={short._id}
                className="flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <button type="button" onClick={() => setPreviewShort(short)} className="relative cursor-pointer">
                  <img src={short.thumbnailUrl} className="h-64 w-full object-cover" alt="Short thumbnail" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-4xl text-white">▶️</span>
                  {short.duration ? (
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-white">
                      {Math.round(short.duration)}s
                    </span>
                  ) : null}
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <p className="flex-grow text-sm text-neutral-700 leading-relaxed line-clamp-3">{short.script}</p>
                  <div className="mt-4 flex items-center gap-3 mx-auto">
                    <button
                      onClick={() => handleDownload(short)}
                      className="btn-secondary flex h-10 w-10 items-center justify-center text-xl"
                      title="Download"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => handleCopyCaption(short.caption)}
                      className="btn-secondary flex h-10 w-10 items-center justify-center text-xl"
                      title="Copy Caption"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(short._id)}
                      className="btn-secondary flex h-10 w-10 items-center justify-center text-xl"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button disabled={page === 1} onClick={() => fetchShorts(page - 1)} className="btn-secondary btn-sm disabled:opacity-50">
              ← Prev
            </button>
            <span className="text-sm text-neutral-500">
              Page <strong className="text-neutral-700">{page}</strong> of <strong className="text-neutral-700">{totalPages}</strong>
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => fetchShorts(page + 1)}
              className="btn-secondary btn-sm disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {previewShort && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewShort(null)}>
          <video
            src={previewShort.videoUrl}
            poster={previewShort.thumbnailUrl}
            controls
            autoPlay
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
