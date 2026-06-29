import { useEffect, useState } from 'react'

import PackageForm from './PackageForm'
import Menu from '../../components/Menu'
import { deletePackage, getPackages } from '../../services/packageService'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function PackagesIndex() {

  const { businessId } = useParams()

  const [packages, setPackages] = useState([])

  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)

  const [editId, setEditId] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)

  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPackageList()
  }, [])

  async function fetchPackageList(page = 1) {
    try {
      setLoading(true)

      const data = await getPackages(page, businessId)

      setPackages(data.packages || [])
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleCreate() {
    setEditId(null)
    setShowForm(true)
  }

  function handleEdit(pkg) {
    setEditId(pkg._id)
    setShowForm(true)
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This package will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
    })

    if (!result.isConfirmed) return

    try {
      await deletePackage(id)

      fetchPackageList(currentPage)

      Swal.fire({
        title: 'Deleted!',
        text: 'Package has been deleted.',
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

  function handleSuccess() {
    setShowForm(false)
    setEditId(null)

    fetchPackageList(currentPage)
  }

  function handleCancel() {
    setShowForm(false)
    setEditId(null)
  }

  function truncate(text) {
    if (!text) return '-'

    if (text.length <= 40) return text

    return text.substring(0, 40) + '...'
  }

  if (showForm) {
    return (
      <PackageForm
        editId={editId}
        businessId={businessId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="min-h-screen app-gradient">
      <Menu />

      <div className="mx-auto max-w-5xl p-4">
        <div className="mx-auto max-w-4xl p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full rounded-lg bg-white p-8 shadow-md">

              <div className="mb-6 flex items-center justify-between">

                <h2 className="text-lg font-semibold text-neutral-800">
                  Packages
                </h2>

                <button
                  onClick={handleCreate}
                  className="rounded-lg app-gradient px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
                >
                  + Create
                </button>

              </div>

              {loading ? (
                <p className="text-sm text-neutral-500">
                  Loading...
                </p>
              ) : packages.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No packages found.
                </p>
              ) : (
                <>
                  <div className="overflow-hidden border border-neutral-200 shadow-sm">

                    <table className="w-full text-left text-sm">

                      <thead>

                        <tr className="app-gradient text-white">

                          <th className="py-3 pl-4 font-semibold">
                            Sr No
                          </th>

                          <th className="py-3 pl-2 font-semibold">
                            Package
                          </th>

                          <th className="py-3 pl-2 font-semibold">
                            Price
                          </th>

                          <th className="py-3 pl-2 font-semibold">
                            Duration
                          </th>

                          <th className="py-3 pl-2 font-semibold">
                            Services
                          </th>

                          <th className="py-3 pl-2 font-semibold">
                            Status
                          </th>

                          <th className="py-3 pl-2 font-semibold">
                            Action
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {packages.map((pkg, index) => (

                          <tr
                            key={pkg._id}
                            className="border-b border-neutral-100 text-neutral-800"
                          >

                            <td className="py-2 pl-4">
                              {(currentPage - 1) * 10 + index + 1}
                            </td>

                            <td className="py-2 pl-2">
                              {pkg.title}
                            </td>

                            <td className="py-2 pl-2">
                              Rs. {pkg.price}
                            </td>

                            <td className="py-2 pl-2">
                              {pkg.duration}
                            </td>

                            <td className="py-2 pl-2">
                              {truncate(pkg.services.join(', '))}
                            </td>

                            <td className="py-2 pl-2">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${pkg.status === 'Active'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                                  }`}
                              >
                                {pkg.status}
                              </span>

                            </td>

                            <td className="flex items-center gap-2 py-2 pl-2">

                              <button
                                title="Edit"
                                onClick={() => handleEdit(pkg)}
                                className="rounded-md p-2 text-green-400 transition hover:bg-green-500"
                              >
                                ✏️
                              </button>

                              <button
                                title="Delete"
                                onClick={() => handleDelete(pkg._id)}
                                className="rounded-md p-2 text-red-400 transition hover:bg-red-500"
                              >
                                🗑️
                              </button>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                  <div className="mt-4 flex justify-end gap-4">

                    <button
                      disabled={currentPage === 1}
                      onClick={() => fetchPackageList(currentPage - 1)}
                    >
                      Prev
                    </button>

                    <span>
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => fetchPackageList(currentPage + 1)}
                    >
                      Next
                    </button>

                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}