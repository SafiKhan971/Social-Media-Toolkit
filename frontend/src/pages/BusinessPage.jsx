import { useState, useEffect } from 'react'
import Menu from '../components/Menu'


const apiUrl = import.meta.env.VITE_API_BASE_URL

function truncate(text, maxLength = 50) {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export default function BusinessPage() {
  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [success, setSuccess] = useState('')


  useEffect(() => {
    fetchBusinesses()
  }, [])

  function showSuccess(message) {
    setSuccess(message)
    setTimeout(() => setSuccess(''), 3000)
  }
  function showError(message) {
    setError(message)
    setTimeout(() => setError(''), 3000)
  }

  function resetForm() {
    setBusinessName('')
    setBusinessDescription('')
    setBusinessCategory('')
    setEditId(null)
    setForm(false)
  }
  function handleEdit(business) {
    setBusinessName(business.name)
    setBusinessCategory(business.category)
    setBusinessDescription(business.description)
    setEditId(business._id)
    setForm(true)
  }
  // Delete a business
  async function handleDelete(id) {
    const confirmDelete = window.confirm('Are you sure you want to delete this business?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`${apiUrl}/businesses/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete business')

      setBusinesses((prev) => prev.filter((b) => b._id !== id))
      showSuccess('Business deleted successfully!')

    } catch (err) {
      setError(err.message)
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
    try {
      const isEditing = Boolean(editId)
      const url = isEditing
        ? `${apiUrl}/businesses/${editId}`
        : `${apiUrl}/businesses`
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: businessName,
          description: businessDescription,
          category: businessCategory,
        }),
      })
      if (!res.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'create'} business`)

      resetForm()
      await fetchBusinesses()
      showSuccess(isEditing ? 'Business updated successfully!' : 'Business created successfully!')


    } catch (err) {
      setError(err.message)
    }

  }
  const itemsPerPage = 6
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentBusinesses = businesses.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(businesses.length / itemsPerPage)

  return (
    <div className="min-h-screen app-gradient">
      <Menu />
      {(error || success) && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-bold text-white shadow-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-lg ">
              {success}
            </div>
          )}
        </div>
      )}
      <div className="mx-auto max-w-5xl p-4">
        <div className="mx-auto max-w-4xl p-6">
          <div className="flex flex-col items-center gap-6">
            {form ? (
              <div className="w-full rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-neutral-800">
                  {editId ? 'Edit Business' : 'Create Business'}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="mb-1 block text-sm font-medium text-neutral-700"
                    >
                      Business Name
                    </label>
                    <input
                      id="businessName"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
                      placeholder="Enter business name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="businessCategory"
                      className="mb-1 block text-sm font-medium text-neutral-700"
                    >
                      Business Category
                    </label>
                    <input
                      id="businessCategory"
                      type="text"
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
                      placeholder="Enter business category"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="businessDescription"
                      className="mb-1 block text-sm font-medium text-neutral-700"
                    >
                      Business Description
                    </label>
                    <textarea
                      id="businessDescription"
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      rows={4}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
                      placeholder="Describe the business"
                    />
                  </div>

                  <div className="mt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex-1 rounded-md app-gradient px-4 py-2 text-sm font-medium text-white "
                    >
                      {editId ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-full rounded-lg bg-white p-8 shadow-md">
                <div className='mb-6 flex items-center justify-between'>
                  <h2 className="text-lg font-semibold text-neutral-800">
                    Businesses
                  </h2>

                  <button
                    onClick={() => setForm(true)}
                    className="rounded-lg app-gradient px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-500 hover:shadow-md"
                  >
                    + Create
                  </button>
                </div>
                {loading ? (
                  <p className="text-sm text-neutral-500">Loading...</p>
                ) : businesses.length === 0 ? (
                  <p className="text-sm text-neutral-500">No businesses yet.</p>
                ) : (
                  <div className='overflow-hidden border border-neutral-200 shadow-sm'>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="app-gradient text-white">
                          <th className="py-3 pl-4 text-left font-semibold">Sr No</th>
                          <th className="py-3 pl-2 text-left font-semibold">Name</th>
                          <th className="py-3 pl-2 text-left font-semibold">Description</th>
                          <th className="py-3 pl-2 text-left font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBusinesses.map((business, index) => (
                          <tr
                            key={business._id}
                            className="border-b border-neutral-100 text-neutral-800"
                          >
                            <td className='pl-4 py-2 pr-2'>{startIndex + index + 1}</td>
                            <td className="pl-2 py-2 pr-4">{business.name}</td>
                            <td className="pl-2 py-2 text-neutral-600">
                              {truncate(business.description)}
                            </td>
                            <td className='flex items-center gap-2 pl-2 py-2'>
                              <button className='rounded-md p-2 text-green-300 hover:bg-green-500 transition'
                                title='Edit'
                                onClick={() => handleEdit(business)}>
                                ✏️
                              </button>
                              <button className='rounded-md p-2 text-red-400 hover:bg-red-500 transition'
                                title='Delete'
                                onClick={() => handleDelete(business._id)}>
                                🗑️
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {businesses.length > itemsPerPage && (
                      <div className='mt-4 flex justify-end gap-4'>
                        <button onClick={() => setCurrentPage((p) => p - 1)}
                          disabled={currentPage === 1}
                          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 disabled:opacity-50">
                          Previous
                        </button>
                        <span className='text-sm text-neutral-700'>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage((p) => p + 1)}
                          disabled={currentPage === totalPages}
                          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 disabled:opacity-50">
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}