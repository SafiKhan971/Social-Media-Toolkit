// src/pages/Business/BusinessForm.jsx
import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function BusinessForm({ business, onCancel, onSuccess }) {
    const [businessName, setBusinessName] = useState('')
    const [businessDescription, setBusinessDescription] = useState('')
    const [businessCategory, setBusinessCategory] = useState('')
      const [categories, setCategories] = useState([])          // 👈 add this
    const [categoriesLoading, setCategoriesLoading] = useState(true)
    const [businessServices, setBusinessServices] = useState('')
    const [logo, setLogo] = useState(null)
    const [website, setWebsite] = useState('')
    const [businessEmail, setBusinessEmail] = useState('')
    const [officeAddress, setOfficeAddress] = useState('')
    const [phones, setPhones] = useState([])
    const [phoneInput, setPhoneInput] = useState('')
    const [socialLinks, setSocialLinks] = useState([])
    const [socialPlatform, setSocialPlatform] = useState('')
    const [socialUrl, setSocialUrl] = useState('')

    const editId = business?._id || null

    useEffect(() => {
        async function fetchCategories() {
            try {
                setCategoriesLoading(true)
                const { data } = await api.get('/categories?limit=100') // saari categories ek sath la lein
                setCategories(data.categories)
            } catch (err) {
                console.error('Categories load nahi hui:', err)
            } finally {
                setCategoriesLoading(false)
            }
        }
        fetchCategories()
    }, [])

    // Edit mode hoga to fields fill ho jayengi
    useEffect(() => {
        if (business) {
            setBusinessName(business.name)
 setBusinessCategory(business.category?._id || business.category || '')
             setBusinessServices((business.services || []).join(', '))
            setWebsite(business.website || '')
            setBusinessEmail(business.email || '')
            setOfficeAddress(business.officeAddress || '')
            setPhones(business.phones || [])
            setSocialLinks(business.socialLinks || [])
            setBusinessDescription(business.description)
        }
    }, [business])

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
    }

    function removeSocialLink(index) {
        setSocialLinks(socialLinks.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const isEditing = Boolean(editId)
            const url = isEditing ? `/businesses/${editId}` : `/businesses`
            const method = isEditing ? 'put' : 'post'

            const formData = new FormData()
            formData.append('name', businessName)
            formData.append('category', businessCategory)
            formData.append('description', businessDescription)
            formData.append('email', businessEmail)
            formData.append('phones', JSON.stringify(phones.map((p) => p.trim()).filter(Boolean)))
            formData.append('website', website)
            formData.append('officeAddress', officeAddress)
            formData.append('socialLinks', JSON.stringify(socialLinks.filter((s) => s.platform && s.url)))
            formData.append(
                'services',
                JSON.stringify(
                    businessServices.split(',').map((s) => s.trim()).filter(Boolean)
                )
            )

            if (logo) {
                formData.append('logo', logo)
            }

            await api({
                url,
                method,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            onSuccess(isEditing ? 'Business updated successfully!' : 'Business created successfully!')
        } catch (err) {
            // Parent ko error bhi bata do (agar tum error state upar rakhna chahte ho)
            console.error(err)
            throw err
        }
    }

    return (
        <div className="page-card">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="section-heading">
                    {editId ? 'Edit Business' : 'Create Business'}
                </h2>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="businessName" className="form-label">Business Name</label>
                        <input
                            id="businessName"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="form-input"
                            placeholder="Enter business name"
                        />
                    </div>

                    <div>
                        <label htmlFor="businessCategory" className="form-label">Business Category</label>
                        <select
                            id="businessCategory"
                            value={businessCategory}
                            onChange={(e) => setBusinessCategory(e.target.value)}
                            className="form-input"
                            disabled={categoriesLoading}
                        >
                            <option value="">{categoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="website" className="form-label">Website</label>
                        <input
                            id="website"
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="form-input"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="businessEmail" className="form-label">Business Email</label>
                        <input
                            id="businessEmail"
                            type="email"
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            className="form-input"
                            placeholder="contact@business.com"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="form-label">Phone Numbers</label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                                placeholder="+92 300 1234567"
                                className="form-input flex-1"
                            />
                            <button type="button" onClick={addPhone} className="btn-primary px-4">
                                Add
                            </button>
                        </div>

                        {phones.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {phones.map((phone, index) => (
                                    <div key={index} className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm">
                                        <span>{phone}</span>
                                        <button type="button" onClick={() => removePhone(index)} className="text-red-500 cursor-pointer">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="form-label">Social Media Links</label>
                        <div className="flex gap-2">
                            <select
                                value={socialPlatform}
                                onChange={(e) => setSocialPlatform(e.target.value)}
                                className="form-input w-auto"
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
                                className="form-input flex-1"
                            />

                            <button type="button" onClick={addSocialLink} className="btn-primary px-4">
                                Add
                            </button>
                        </div>

                        {socialLinks.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {socialLinks.map((social, index) => (
                                    <div key={index} className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm">
                                        <span>{social.platform}: {social.url}</span>
                                        <button type="button" onClick={() => removeSocialLink(index)} className="text-red-500 cursor-pointer">×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="form-label">Business Logo</label>
                        <div className="flex items-center gap-3">
                            <label htmlFor="businessLogo" className="btn-secondary cursor-pointer">
                                📁 Choose Logo
                            </label>
                            <span className="max-w-xs truncate text-sm text-neutral-500">
                                {logo ? logo.name : 'No file selected'}
                            </span>
                            <input
                                id="businessLogo"
                                type="file"
                                accept="image/*"
                                className="hidden cursor-pointer"
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
                </div>

                <div>
                    <label className="form-label">Office Address</label>
                    <textarea
                        value={officeAddress}
                        onChange={(e) => setOfficeAddress(e.target.value)}
                        rows={3}
                        className="form-input resize-none"
                        placeholder="Office address, city, area"
                    />
                </div>

                <div>
                    <label className="form-label">Services</label>
                    <textarea
                        value={businessServices}
                        onChange={(e) => setBusinessServices(e.target.value)}
                        rows={3}
                        className="form-input resize-none"
                        placeholder="Web Development, SEO, Digital Marketing"
                    />
                </div>

                <div>
                    <label htmlFor="businessDescription" className="form-label">Business Description</label>
                    <textarea
                        id="businessDescription"
                        value={businessDescription}
                        onChange={(e) => setBusinessDescription(e.target.value)}
                        rows={4}
                        className="form-input resize-none"
                        placeholder="Describe the business"
                    />
                </div>

                <div className="mt-2 flex gap-3 border-t border-neutral-100 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
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
    )
}