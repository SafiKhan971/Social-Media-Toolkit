import { useState, useEffect } from 'react'
import Menu from '../../components/Menu'
import api from '../../services/api'
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

const apiUrl = import.meta.env.VITE_API_BASE_URL

export default function CategoryPage() {
  const [categoryName, setCategoryName] = useState('')
  const [tags, setTags] = useState([''])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCategories(1)
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
    setCategoryName('')
    setTags([''])
    setEditId(null)
    setForm(false)
  }

  function handleEdit(category) {
    setCategoryName(category.name)
    setTags(category.tags && category.tags.length > 0 ? category.tags : [''])
    setEditId(category._id)
    setForm(true)
  }

  function handleTagChange(index, value) {
    const updatedTags = [...tags]
    updatedTags[index] = value
    setTags(updatedTags)
  }

  function addTag() {
    setTags([...tags, ''])
  }

  function removeTag(index) {
    setTags(tags.filter((_, i) => i !== index))
  }

  async function fetchCategories(page = 1) {
    try {
      setLoading(true)
      const { data } = await api.get(`${apiUrl}/categories?page=${page}&limit=6`)

      setCategories(data.categories)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (err) {
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This category will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it',
    })

    if (!result.isConfirmed) return

    try {
      await api.delete(`/categories/${id}`)
      setCategories((prev) => prev.filter((c) => c._id !== id))

      Swal.fire({
        title: 'Deleted!',
        text: 'Category has been deleted.',
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

 async function handleSubmit(e) {
  e.preventDefault()

  try {
    const isEditing = Boolean(editId)
    const url = isEditing ? `/categories/${editId}` : `/categories`
    const method = isEditing ? 'put' : 'post'

    const payload = {
      name: categoryName,
      tags: tags.map((t) => t.trim()).filter(Boolean),
    }

    await api({ url, method, data: payload })

    resetForm()
    await fetchCategories()

    showSuccess(
      isEditing ? 'Category updated successfully!' : 'Category created successfully!'
    )
  } catch (err) {
    showError(err.response?.data?.message || err.message)
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
            <div className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-bold text-white shadow-lg">
              {success}
            </div>
          )}
        </div>
      )}

      <div className="page-container">
          {form ? (
              <div className="page-card">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="section-heading">
                    {editId ? 'Edit Category' : 'Create Category'}
                  </h2>
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    ← Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="form-input"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Tags</label>
                    <div className="flex flex-col gap-2">
                      {tags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                            className="form-input"
                            placeholder="e.g. trending, new, featured"
                          />
                          {tags.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="btn-danger btn-sm px-2"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTag}
                        className="btn-secondary btn-sm w-fit"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-3 border-t border-neutral-100 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      {editId ? '✔ Update' : '✔ Create'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="page-card">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="section-heading">Categories</h2>
                  <button
                    onClick={() => setForm(true)}
                    className="btn-primary"
                  >
                    + Create
                  </button>
                </div>

                {loading ? (
                  <p className="text-sm text-neutral-500">Loading...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-neutral-500">No categories yet.</p>
                ) : (
                  <>
                    <TableRoot fullBleed className="mb-1">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sr No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {categories.map((category, index) => (
                          <TableRow key={category._id} className="text-sm">
                            <TableCell className="whitespace-nowrap">
                              {(currentPage - 1) * 6 + index + 1}
                            </TableCell>

                            <TableCell className="font-medium text-title-50 whitespace-nowrap">
                              {category.name}
                            </TableCell>

                            <TableCell>
                              <div className="flex flex-wrap gap-1.5">
                                {category.tags && category.tags.length > 0 ? (
                                  category.tags.map((tag, i) => (
                                    <Badge key={i} color="info">
                                      {tag}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-neutral-400">—</span>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-neutral-100 cursor-pointer">
                                  <MenuKebab1 className="h-5 w-5 text-neutral-600" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent placement="bottom end" className="p-2">
                                  <DropdownMenuItem onClick={() => handleEdit(category)}>
                                    ✏️ Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(category._id)}>
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
                        onPageChange={(page) => fetchCategories(page)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
        </div>
    </div>
  )
}