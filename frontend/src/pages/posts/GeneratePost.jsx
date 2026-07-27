import { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import api from '../../services/api'
import GeneratedPostsPreview from './GeneratedPostsPreview'

export default function GeneratePost() {
  const [selectedBusiness, setSelectedBusiness] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPackages, setSelectedPackages] = useState([])
  const [numberOfPosts, setNumberOfPosts] = useState(1)
  const [businesses, setBusinesses] = useState([])
  const [packages, setPackages] = useState([])
  const [description, setDescription] = useState('')
  const [customDescription, setCustomDescription] = useState(false)
  const [customBackground, setCustomBackground] = useState(false)
  const [beforeImage, setBeforeImage] = useState(null)
  const [afterImage, setAfterImage] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [selectedSeasonalType, setSelectedSeasonalType] = useState('')
  const [loading, setLoading] = useState(true)
  const [generatedPosts, setGeneratedPosts] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const types = [
    { id: 'quote', label: 'Quote' },
    { id: 'offer', label: 'Offer' },
    { id: 'tip', label: 'Tip' },
    { id: 'announcement', label: 'Announcement' },
    { id: 'before_after', label: 'Before & After' },
    { id: 'seasonal', label: 'Seasonal' },
    { id: 'external', label: 'External' },
  ]

  const seasonalTypes = [
    { id: 'new_year', label: 'New Year' },
    { id: 'eid_mubarak', label: 'Eid Mubarak' },
    { id: 'independence_day', label: 'Independence Day' },
    { id: 'christmas', label: 'Christmas' },
  ]

  const filteredPackages = packages.filter(pkg => pkg.title.toLowerCase().includes(search.toLowerCase()))

  const fetchBusinesses = async () => {
    try {
      const data = await api.get(`${apiUrl}/businesses/all`)
      setBusinesses(data.data.businesses)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPackages = async businessId => {
    try {
      const data = await api.get(`${apiUrl}/packages/all/${businessId}`)
      setPackages(data.data.packages)
      setSelectedPackages([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  useEffect(() => {
    if (selectedType === 'offer' && selectedBusiness) {
      fetchPackages(selectedBusiness)
    } else {
      setPackages([])
      setSelectedPackages([])
    }
  }, [selectedType, selectedBusiness])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    const toastId = toast.loading('Generating posts...')
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('businessId', selectedBusiness)
      formData.append('type', selectedType)
      formData.append('description', description)
      formData.append('backgroundImage', backgroundImage)
      formData.append('customDescription', customDescription)
      formData.append('customBackground', customBackground)
      formData.append('numberOfPosts', numberOfPosts)
      if (selectedType === 'offer') {
        selectedPackages.forEach(id => formData.append('packageIds[]', id))
      }
      if (selectedType === 'before_after') {
        formData.append('beforeImage', beforeImage)
        formData.append('afterImage', afterImage)
      }
      if (selectedType === 'seasonal') {
        formData.append('seasonalType', selectedSeasonalType)
      }
      const { data } = await api.post(`${apiUrl}/posts/generate-posts`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setGeneratedPosts(data.posts)
      setPreviewMode(true)
      toast.dismiss(toastId)
      toast.success(data.message || 'Posts generated successfully')
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const resetGenerateForm = () => {
    setGeneratedPosts([])
    setPreviewMode(false)
    setSelectedBusiness('')
    setSelectedType('')
    setSelectedPackages([])
    setNumberOfPosts(1)
  }

  if (previewMode) {
    return <GeneratedPostsPreview businessId={selectedBusiness} generatedPosts={generatedPosts} onPostsSaved={resetGenerateForm} />
  }

  return (
    <div className='page-card'>
      <div className='mb-6 flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-success shadow-sm'>
          <span className='text-lg'>✨</span>
        </div>
        <h1 className='text-2xl font-bold text-neutral-800'>Generate Posts</h1>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {/* Business */}
          <div>
            <label className='form-label'>Select Business</label>
            <select value={selectedBusiness} onChange={e => setSelectedBusiness(e.target.value)} className='form-input'>
              <option value='' disabled>
                Select Business
              </option>
              {businesses.map(business => (
                <option key={business._id} value={business._id}>
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className='form-label'>Select Type</label>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className='form-input'>
              <option value='' disabled>
                Select Type
              </option>
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          {selectedType !== 'external' && (
            <div>
            <label className='form-label mb-2 block'>Description</label>

            <div className='flex items-center gap-2 mb-3'>
              <span className='text-sm'>AI-generated</span>

              <button
                type='button'
                onClick={() => setCustomDescription(prev => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  customDescription ? 'bg-success' : 'bg-gray-300'
                }`}>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    customDescription ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>

              <span className='text-sm'>Custom</span>
            </div>

            {(selectedType === 'announcement' || customDescription) && (
              <input
                type='text'
                value={description}
                onChange={e => setDescription(e.target.value)}
                className='form-input'
                placeholder='Enter description...'
              />
            )}
          </div>
          )}
          

          <div>
            <label className='form-label mb-2 block'>{selectedType === 'external' ? 'Upload Image' : 'Background Image'}</label>

            {selectedType !== 'external' && (
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-sm'>AI-generated</span>

                <button
                  type='button'
                  onClick={() => setCustomBackground(prev => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    customBackground ? 'bg-success' : 'bg-gray-300'
                  }`}>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      customBackground ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>

                <span className='text-sm'>Custom</span>
              </div>
            )}

            {(selectedType === 'external' || customBackground) && (
              <>
                <input type='file' accept='image/*' className='form-input' onChange={e => setBackgroundImage(e.target.files[0])} />

                {backgroundImage && (
                  <img
                    src={URL.createObjectURL(backgroundImage)}
                    alt={selectedType === 'external' ? 'Uploaded' : 'Background'}
                    className='mt-2 h-24 w-24 rounded-lg border border-neutral-200 object-cover shadow-sm'
                  />
                )}
              </>
            )}
          </div>

          {/* Seasonal Type */}
          {selectedType === 'seasonal' && (
            <div>
              <label className='form-label'>Select Seasonal Type</label>
              <select value={selectedSeasonalType} onChange={e => setSelectedSeasonalType(e.target.value)} className='form-input'>
                <option value='' disabled>
                  Select Seasonal Type
                </option>
                {seasonalTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Before Image */}
          {selectedType === 'before_after' && (
            <div>
              <label className='form-label'>Before Image</label>
              <input type='file' accept='image/*' className='form-input' onChange={e => setBeforeImage(e.target.files[0])} />
              {beforeImage && (
                <img
                  src={URL.createObjectURL(beforeImage)}
                  alt='Before'
                  className='mt-2 h-24 w-24 rounded-lg border border-neutral-200 object-cover shadow-sm'
                />
              )}
            </div>
          )}

          {/* After Image */}
          {selectedType === 'before_after' && (
            <div>
              <label className='form-label'>After Image</label>
              <input type='file' accept='image/*' className='form-input' onChange={e => setAfterImage(e.target.files[0])} />
              {afterImage && (
                <img
                  src={URL.createObjectURL(afterImage)}
                  alt='After'
                  className='mt-2 h-24 w-24 rounded-lg border border-neutral-200 object-cover shadow-sm'
                />
              )}
            </div>
          )}

          {/* Packages multi-select */}
          {selectedType === 'offer' && (
            <div ref={dropdownRef} className='sm:col-span-2'>
              <label className='form-label'>Select Offers</label>
              <div
                role='button'
                onClick={() => setIsOpen(!isOpen)}
                className='form-input flex min-h-10 cursor-pointer items-center justify-between'>
                <div className='flex flex-1 flex-wrap gap-1.5'>
                  {selectedPackages.length === 0 ? (
                    <span className='text-neutral-400'>Select offers...</span>
                  ) : (
                    selectedPackages.map(id => {
                      const pkg = packages.find(p => p._id === id)
                      return (
                        <span key={id} className='flex items-center gap-1 rounded-full bg-success px-2.5 py-0.5 text-xs text-white'>
                          {pkg?.title}
                          <button
                            type='button'
                            onClick={e => {
                              e.stopPropagation()
                              setSelectedPackages(selectedPackages.filter(pkgId => pkgId !== id))
                            }}
                            className='ml-0.5 rounded-full hover:bg-white/20 px-0.5'>
                            ✕
                          </button>
                        </span>
                      )
                    })
                  )}
                </div>
                <span className='ml-2 text-neutral-400 text-xs'>{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <div className='mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg z-50'>
                  <div className='p-2 border-b border-neutral-100'>
                    <input
                      type='text'
                      placeholder='Search offers...'
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className='form-input'
                    />
                  </div>
                  <div className='max-h-52 overflow-y-auto'>
                    {filteredPackages.length ? (
                      filteredPackages.map(pkg => (
                        <label key={pkg._id} className='flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-neutral-50 text-sm'>
                          <input
                            type='checkbox'
                            checked={selectedPackages.includes(pkg._id)}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedPackages([...selectedPackages, pkg._id])
                              } else {
                                setSelectedPackages(selectedPackages.filter(id => id !== pkg._id))
                              }
                            }}
                          />
                          <span className='text-neutral-700'>{pkg.title}</span>
                        </label>
                      ))
                    ) : (
                      <div className='px-3 py-3 text-sm text-neutral-400'>No packages found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Number of Posts */}
          <div>
            <label className='form-label'>Number of Posts</label>
            <input type='number' min='1' value={numberOfPosts} onChange={e => setNumberOfPosts(e.target.value)} className='form-input' />
          </div>
        </div>

        <div className='border-t border-neutral-100 pt-4'>
          <button type='submit' disabled={loading} className='btn-primary'>
            {loading ? 'Generating...' : '✨ Generate Posts'}
          </button>
        </div>
      </form>
    </div>
  )
}
