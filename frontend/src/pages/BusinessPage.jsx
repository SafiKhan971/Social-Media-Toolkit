import { useState, useEffect } from 'react'
import Menu from '../components/Menu'
import api from '../services/api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'





const apiUrl = import.meta.env.VITE_API_BASE_URL

function truncate(text, maxLength = 50) {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export default function BusinessPage() {
  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [businessServices, setBusinessServices] = useState('')
  const [logo, setLogo] = useState(null)
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [success, setSuccess] = useState('')
  const [totalPages, setTotalPages] = useState(1)



  useEffect(() => {
    fetchBusinesses(1)
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

  const navigate = useNavigate()

  function handlePackages(id) {
    navigate(`/businesses/${id}/packages`)
  }


  async function handleDelete(id) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This business will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/businesses/${id}`)

      setBusinesses((prev) =>
        prev.filter((b) => b._id !== id)
      )

      Swal.fire({
        title: 'Deleted!',
        text: 'Business has been deleted.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.message || err.message,
        icon: 'error',
      })
    }
  }

  async function fetchBusinesses(page = 1) {
    try {
      setLoading(true)

      const { data } = await api.get(`${apiUrl}/businesses?page=${page}&limit=6`)

      setBusinesses(data.businesses)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
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
        ? `/businesses/${editId}`
        : `/businesses`

      const method = isEditing ? 'put' : 'post'

      const formData = new FormData()

      formData.append('name', businessName)
      formData.append('category', businessCategory)
      formData.append('description', businessDescription)

      formData.append(
        'services',
        JSON.stringify(
          businessServices
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        )
      )

      if (logo) {
        formData.append('logo', logo)
      }

      await api({
        url,
        method,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      resetForm()
      await fetchBusinesses()

      showSuccess(
        isEditing
          ? 'Business updated successfully!'
          : 'Business created successfully!'
      )
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

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
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Services
                    </label>

                    <textarea
                      value={businessServices}
                      onChange={(e) => setBusinessServices(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                      placeholder="Web Development, SEO, Digital Marketing"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Business Logo
                    </label>

                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="businessLogo"
                        className="cursor-pointer rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
                      >
                        Choose Logo
                      </label>

                      <span className="max-w-xs truncate text-sm text-neutral-500">
                        {logo ? logo.name : 'No file selected'}
                      </span>

                      <input
                        id="businessLogo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setLogo(e.target.files?.[0] || null)}
                      />
                    </div>

                    {logo && (
                      <div className="mt-4">
                        <img
                          src={URL.createObjectURL(logo)}
                          alt="Logo Preview"
                          className="h-24 w-24 rounded-lg border border-neutral-200 object-cover shadow-sm"
                        />
                      </div>
                    )}
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
                        {businesses.map((business, index) => (
                          <tr
                            key={business._id}
                            className="border-b border-neutral-100 text-neutral-800"
                          >
                            <td className='pl-4 py-2 pr-2'>{index + 1}</td>
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
                              <button
                                className="rounded-md p-2 text-blue-400 hover:bg-blue-500 transition"
                                title="Packages"
                                onClick={() => handlePackages(business._id)}
                              >
                                ➕
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className='mt-4 flex justify-end gap-4'>
                      <button
                        disabled={currentPage === 1}
                        onClick={() => fetchBusinesses(currentPage - 1)}
                      >
                        Prev
                      </button>

                      <span>
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => fetchBusinesses(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>
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