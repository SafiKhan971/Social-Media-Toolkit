import { useEffect, useState } from 'react'
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

  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const types = [
    { _id: 1, name: "General" },
    { _id: 2, name: "Package" },
  ]

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

  const fetchPackages = async (businessId) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    const toastId = toast.loading('Generating posts...')

    try {
      setLoading(true)

      const { data } = await api.post(
        `${apiUrl}/posts/generate-posts`,
        {
          businessId: selectedBusiness,
          type: selectedType,
          packageIds: selectedType === '2' ? selectedPackages : null,
          numberOfPosts,
        }
      )

      setGeneratedPosts(data.posts)
      setPreviewMode(true)

      toast.dismiss(toastId)
      toast.success(data.message || 'Posts generated successfully')
    } catch (err) {
      toast.dismiss(toastId)

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Something went wrong'
      )
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
    return (
      <GeneratedPostsPreview
        businessId={selectedBusiness}
        generatedPosts={generatedPosts}
        onPostsSaved={resetGenerateForm}
      />
    )
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-2xl font-semibold">
        Generate Posts
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-bold mt-3">
              Select Business
            </label>

            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="" disabled>
                Select Business
              </option>

              {businesses.map((business) => (
                <option
                  key={business._id}
                  value={business._id}
                >
                  {business.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold mt-3">
              Select Type
            </label>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="" disabled>
                Select Type
              </option>

              {types.map((type) => (
                <option
                  key={type._id}
                  value={type._id}
                >
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {selectedType === '2' && (
            <div className="md:col-span-2">
              <label className="mb-1 mt-3 block text-sm font-bold">
                Select Packages
              </label>

              {packages.length === 0 ? (
                <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                  No packages found for this business.
                </div>
              ) : (
                <>
                  <select
                    multiple
                    value={selectedPackages}
                    onChange={(e) => {
                      const values = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      )
                      setSelectedPackages(values)
                    }}
                    className="w-full rounded-md border px-3 py-2"
                    size={Math.min(6, packages.length)}
                  >
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.title} — {pkg.price}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-sm text-gray-500">
                    Hold Ctrl/Cmd to select multiple packages.
                  </p>
                </>
              )}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-bold mt-3">
              Number of Posts
            </label>

            <input
              type="number"
              min="1"
              value={numberOfPosts}
              onChange={(e) =>
                setNumberOfPosts(e.target.value)
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>



        <button
          type="submit"
          disabled={loading}
          className="rounded-md app-gradient px-4 py-2 text-white"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
    </div>
  )
}
