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
  const [loading, setLoading] = useState(true)
  const [generatedPosts, setGeneratedPosts] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const dropdownRef = useRef(null)

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const types = [
    { _id: 1, name: 'General' },
    { _id: 2, name: 'Package' },
  ]

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

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
    if (selectedType === '2' && selectedBusiness) {
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    const toastId = toast.loading('Generating posts...')

    try {
      setLoading(true)

      const { data } = await api.post(`${apiUrl}/posts/generate-posts`, {
        businessId: selectedBusiness,
        type: selectedType,
        packageIds: selectedType === '2' ? selectedPackages : null,
        numberOfPosts,
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
    <div className='rounded-lg bg-white p-8 shadow-md'>
      <h1 className='mb-6 text-2xl font-semibold'>Generate Posts</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='grid grid-cols-2 gap-4'>
          {/* Business */}
          <div>
            <label className='mb-1 block text-sm font-bold mt-3'>Select Business</label>

            <select
              value={selectedBusiness}
              onChange={e => setSelectedBusiness(e.target.value)}
              className='w-full rounded-md border px-3 py-2'>
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
            <label className='mb-1 block text-sm font-bold mt-3'>Select Type</label>

            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className='w-full rounded-md border px-3 py-2'>
              <option value='' disabled>
                Select Type
              </option>

              {types.map(type => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Packages */}
          {selectedType === '2' && (
            <div ref={dropdownRef}>
              <label className='mb-1 block text-sm font-bold mt-3'> Select Packages </label>
              <div
                role='button'
                onClick={() => setIsOpen(!isOpen)}
                className='flex w-full items-center justify-between rounded-md border px-3 py-2 bg-white'>
                <div className='flex flex-1 flex-wrap gap-2'>
                  {selectedPackages.length === 0 ? (
                    <span className='text-gray-500'>Select packages</span>
                  ) : (
                    selectedPackages.map(id => {
                      const pkg = packages.find(p => p._id === id)

                      return (
                        <span key={id} className='flex items-center gap-1 rounded-full bg-green-200 px-2 py-1 text-sm text-green-700'>
                          {pkg?.title}

                          <button
                            type='button'
                            onClick={e => {
                              e.stopPropagation() // Prevent dropdown from opening
                              setSelectedPackages(selectedPackages.filter(pkgId => pkgId !== id))
                            }}
                            className='ml-1 rounded-full hover:bg-blue-200 px-1 leading-none'>
                            ✕
                          </button>
                        </span>
                      )
                    })
                  )}
                </div>

                <span>{isOpen ? '▲' : '▼'}</span>
              </div>

              {isOpen && (
                <div className='w-full z-50 mt-1 rounded-md border bg-white shadow-lg'>
                  <div className='p-2 border-b'>
                    <input
                      type='text'
                      placeholder='Search package...'
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className='w-full rounded border px-3 py-2 outline-none'
                    />
                  </div>

                  <div className='max-h-60 overflow-y-auto'>
                    {filteredPackages.length ? (
                      filteredPackages.map(pkg => (
                        <label key={pkg._id} className='flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-100'>
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

                          <span>{pkg.title}</span>
                        </label>
                      ))
                    ) : (
                      <div className='px-3 py-2 text-sm text-gray-500'>No packages found</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Number of Posts */}
          <div>
            <label className='mb-1 block text-sm font-bold mt-3'>Number of Posts</label>

            <input
              type='number'
              min='1'
              value={numberOfPosts}
              onChange={e => setNumberOfPosts(e.target.value)}
              className='w-full rounded-md border px-3 py-2'
            />
          </div>
        </div>

        <button type='submit' disabled={loading} className='rounded-md app-gradient cursor-pointer px-4 py-2 text-white'>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  )
}
