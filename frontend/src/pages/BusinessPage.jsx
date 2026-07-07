import { useState, useEffect } from 'react'
import Menu from '../components/Menu'
import api from '../services/api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../components/tailgrids/core/dropdown'
import { Pagination } from '../components/tailgrids/core/pagination'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from '../components/tailgrids/core/table'
import { Badge } from '../components/tailgrids/core/badge'
import { MenuKebab1 } from '../components/tailgrids/core/icons'
import { LogoHoverPreview } from '../components/LogoHoverPreview'





const apiUrl = import.meta.env.VITE_API_BASE_URL
const serverUrl = apiUrl.replace('/api', '')

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
  const [website, setWebsite] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [officeAddress, setOfficeAddress] = useState('')
  const [phones, setPhones] = useState([])
  const [phoneInput, setPhoneInput] = useState('')
  const [socialLinks, setSocialLinks] = useState([])
  const [socialPlatform, setSocialPlatform] = useState('')
  const [socialUrl, setSocialUrl] = useState('')
  // const [socialLinks, setSocialLinks] = useState([{ platform: '', url: '' }])

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
    setBusinessServices('')
    setLogo(null)
    setWebsite('')
    setBusinessEmail('')
    setOfficeAddress('')
    setPhones([])
    setSocialLinks([])
    setEditId(null)
    setForm(false)

  }
  function handleEdit(business) {
    setBusinessName(business.name)
    setBusinessCategory(business.category)
    setBusinessServices((business.services || []).join(', '))
    setWebsite(business.website || '')
    setBusinessEmail(business.email || '')
    setOfficeAddress(business.officeAddress || '')
    setPhones(business.phones || [])
    setSocialLinks(business.socialLinks || [])
    setBusinessDescription(business.description)
    setEditId(business._id)
    setForm(true)
  }
  function addPhone() {
    const trimmed = phoneInput.trim()
    if (!trimmed) return
    setPhones([...phones, trimmed])
    setPhoneInput('')
  }
  function removePhone(index) {
    setPhones(phones.filter((_, i) => i !== index))
  }
  function addSocialLink() {
    if (!socialPlatform || !socialUrl.trim()) return
    setSocialLinks([...socialLinks, { platform: socialPlatform, url: socialUrl.trim() }])
    setSocialPlatform('')
    setSocialUrl('')
    // setSocialLinks([...socialLinks, { platform: '', url: '' }])
  }

  function removeSocialLink(index) {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
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
      formData.append('email', businessEmail)
      formData.append('phones', JSON.stringify(phones.map((p) =>
        p.trim()).filter(Boolean)
      ))
      formData.append('website', website)
      formData.append('officeAddress', officeAddress)
      formData.append('socialLinks', JSON.stringify(
        socialLinks.filter((s) => s.platform && s.url)
      ))

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
                  <div className='grid grid-cols-2 gap-4 ' >
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
                    {/* ---------- Website & Email ---------- */}

                    <div>
                      <label htmlFor="website" className="mb-1 block text-sm font-medium text-neutral-700">
                        Website
                      </label>
                      <input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="businessEmail" className="mb-1 block text-sm font-medium text-neutral-700">
                        Business Email
                      </label>
                      <input
                        id="businessEmail"
                        type="email"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
                        placeholder="contact@business.com"
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
                    {/* ---------- Phone Numbers (multiple) ---------- */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700">Phone Numbers</label>

                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={addPhone}
                          className="rounded-md app-gradient px-4 text-white"
                        >
                          Add
                        </button>
                      </div>

                      {phones.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {phones.map((phone, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm"
                            >
                              <span>{phone}</span>
                              <button
                                type="button"
                                onClick={() => removePhone(index)}
                                className="text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* ---------- Social Media Links (multiple) ---------- */}
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-neutral-700">Social Media Links</label>

                      <div className="flex gap-2">
                        <select
                          value={socialPlatform}
                          onChange={(e) => setSocialPlatform(e.target.value)}
                          className="rounded-md border border-neutral-300 px-2 py-2 text-sm focus:border-green-500 focus:outline-none"
                        >
                          <option value="">Platform</option>
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter / X</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="youtube">YouTube</option>
                          <option value="tiktok">TikTok</option>
                          <option value="other">Other</option>
                        </select>

                        <input
                          type="url"
                          value={socialUrl}
                          onChange={(e) => setSocialUrl(e.target.value)}
                          placeholder="https://facebook.com/yourpage"
                          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                        />

                        <button
                          type="button"
                          onClick={addSocialLink}
                          className="rounded-md app-gradient px-4 text-white"
                        >
                          Add
                        </button>
                      </div>

                      {socialLinks.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {socialLinks.map((social, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm"
                            >
                              <span>{social.platform}: {social.url}</span>
                              <button
                                type="button"
                                onClick={() => removeSocialLink(index)}
                                className="text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Office Address
                    </label>
                    <textarea
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
                      placeholder="Office address, city, area"
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
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
                      placeholder="Web Development, SEO, Digital Marketing"
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
                  <div className="overflow-hidden">
                    <TableRoot fullBleed className="mb-1">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sr No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Logo</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {businesses.map((business, index) => (
                          <TableRow key={business._id} className="text-sm">
                            <TableCell className="whitespace-nowrap">{index + 1}</TableCell>

                            <TableCell className="font-medium text-title-50 whitespace-nowrap">
                              {business.name}
                            </TableCell>

                            <TableCell>
                              <Badge color="info">{business.category}</Badge>
                            </TableCell>

                            <TableCell>
                              {business.logo ? (
                                <LogoHoverPreview
                                  src={`${serverUrl}${business.logo}`}
                                  alt={business.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                                  N/A
                                </div>
                              )}
                            </TableCell>

                            <TableCell className="text-text-100 whitespace-nowrap">
                              {business.email || '—'}
                            </TableCell>

                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-neutral-100">
                                  <MenuKebab1 className="h-5 w-5 text-neutral-600" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent placement="bottom end" className="p-2">
                                  <DropdownMenuItem onClick={() => handleEdit(business)}>
                                    ✏️ Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(business._id)}>
                                    🗑️ Delete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handlePackages(business._id)}>
                                    ➕ Packages
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
                        onPageChange={(page) => fetchBusinesses(page)}
                      />
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