import { useEffect, useState } from 'react'

import PackageForm from './PackageForm'
import Menu from '../../components/Menu'
import { deletePackage, getPackages } from '../../services/packageService'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../components/tailgrids/core/dropdown'
import { Pagination } from '../../components/tailgrids/core/pagination'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from '../../components/tailgrids/core/table'
import { Badge } from '../../components/tailgrids/core/badge'
import { MenuKebab1 } from '../../components/tailgrids/core/icons'

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
      <div className="min-h-screen app-gradient">
        <Menu />
        <div className="page-container">
          <PackageForm
            editId={editId}
            businessId={businessId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen app-gradient">
      <Menu />
      <div className="page-container">
          <div className="page-card">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="section-heading">Packages</h2>
              <button
                onClick={handleCreate}
                className="btn-primary"
              >
                + Create
              </button>
            </div>
              {loading ? (
                <p className="text-sm text-neutral-500">Loading...</p>
              ) : packages.length === 0 ? (
                <p className="text-sm text-neutral-500">No packages found.</p>
              ) : (
                <>
                  <TableRoot fullBleed className="mb-1">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sr No</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {packages.map((pkg, index) => (
                        <TableRow key={pkg._id} className="text-sm">
                          <TableCell className="whitespace-nowrap">
                            {(currentPage - 1) * 10 + index + 1}
                          </TableCell>

                          <TableCell className="font-medium text-title-50 whitespace-nowrap">
                            {pkg.title}
                          </TableCell>

                          <TableCell className="font-semibold text-text-100 whitespace-nowrap">
                            Rs. {pkg.price}
                          </TableCell>

                          <TableCell className="whitespace-nowrap">
                            {pkg.duration}
                          </TableCell>

                          <TableCell className="text-text-100">
                            {truncate(pkg.services.join(', '))}
                          </TableCell>

                          <TableCell>
                            <Badge
                              color={pkg.status === 'Active' ? 'success' : 'error'}
                              prefixIcon={
                                <span
                                  className={`size-1.5 rounded-full ${pkg.status === 'Active' ? 'bg-success-500' : 'bg-error-500'
                                    }`}
                                />
                              }
                            >
                              {pkg.status}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-2 rounded-full hover:bg-neutral-100">
                                <MenuKebab1 className="h-5 w-5 text-neutral-600" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent placement="bottom end" className="p-2">
                                <DropdownMenuItem onClick={() => handleEdit(pkg)}>
                                  ✏️ Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(pkg._id)}>
                                  🗑️ Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </TableRoot>

                  <div className="mt-5">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      sideLayout="full"
                      onPageChange={(page) => fetchPackageList(page)}
                    />
                  </div>
                </>
              )}

          </div>
        </div>
    </div>
  )
}