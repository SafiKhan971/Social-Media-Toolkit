// src/pages/Business/BusinessIndex.jsx
import { useState, useEffect } from 'react'
import Menu from '../../components/Menu'
import api from '../../services/api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import BusinessForm from './BusinessForm'
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
import { LogoHoverPreview } from '../../components/LogoHoverPreview'

const apiUrl = import.meta.env.VITE_API_BASE_URL
const serverUrl = apiUrl.replace('/api', '')

export default function BusinessIndex() {
    const [businesses, setBusinesses] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [editingBusiness, setEditingBusiness] = useState(null) // null = create mode

    const navigate = useNavigate()

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

    async function fetchBusinesses(page = 1) {
        try {
            setLoading(true)
            const { data } = await api.get(`${apiUrl}/businesses?page=${page}&limit=5`)
            setBusinesses(data.businesses)
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
        } catch (err) {
            showError(err.message)
        } finally {
            setLoading(false)
        }
    }

    function handleCreateClick() {
        setEditingBusiness(null)
        setForm(true)
    }

    function handleEdit(business) {
        setEditingBusiness(business)
        setForm(true)
    }

    function handleCancel() {
        setEditingBusiness(null)
        setForm(false)
    }

    async function handleFormSuccess(message) {
        setEditingBusiness(null)
        setForm(false)
        await fetchBusinesses(currentPage)
        showSuccess(message)
    }

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
            setBusinesses((prev) => prev.filter((b) => b._id !== id))

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
                        <BusinessForm
                            business={editingBusiness}
                            onCancel={handleCancel}
                            onSuccess={handleFormSuccess}
                        />
                    ) : (
                        <div className="page-card">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="section-heading">Businesses</h2>
                                <button
                                    onClick={handleCreateClick}
                                    className="btn-primary"
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
                                                    <TableCell className="whitespace-nowrap">
                                                         {(currentPage - 1) * 5 + index + 1}
                                                    </TableCell>                                                        <TableCell className="font-medium text-title-50 whitespace-nowrap">
                                                            {business.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge color="info">{business.category?.name || '—'}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {business.logo ? (
                                                                <LogoHoverPreview
                                                                    src={
                                                                        business.logo.startsWith('http')
                                                                            ? business.logo
                                                                            : `${serverUrl}${business.logo}`
                                                                    }
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
                                                                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-neutral-100 cursor-pointer">
                                                                    <MenuKebab1 className="h-5 w-5 text-neutral-600" />
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent placement="bottom end" className="p-2 cursor-pointer">
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

                                        <div className="mt-5 cursor-pointer">
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
    )
}