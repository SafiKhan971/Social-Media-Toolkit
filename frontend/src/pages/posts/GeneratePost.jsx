import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import api from '../../services/api'
import GeneratedPostsPreview from './GeneratedPostsPreview'

export default function GeneratePost() {
  const [selectedBusiness, setSelectedBusiness] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [numberOfPosts, setNumberOfPosts] = useState(1)
  const [businesses, setBusinesses] = useState([])
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatedPosts, setGeneratedPosts] = useState([])
  const [previewMode, setPreviewMode] = useState(false)
  const [postType, setPostType] = useState('business')
  const [instantDescription, setInstantDescription] = useState('')

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
          postType,
          businessId: postType === 'business' ? selectedBusiness : null,
          type: selectedType,
          packageId: selectedType === '2' ? selectedPackage : null,
          description: postType === 'instant' ? instantDescription : null,
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
    setNumberOfPosts('')
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

      <div>
        <label className="mb-3 block text-sm font-bold">
          Post Type
        </label>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="postType"
              value="business"
              checked={postType === 'business'}
              onChange={(e) => setPostType(e.target.value)}
            />
            Business Post
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="postType"
              value="instant"
              checked={postType === 'instant'}
              onChange={(e) => setPostType(e.target.value)}
            />
            Instant Post
          </label>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {postType === 'business' ? (
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
              <div>
                <label className="mb-1 block text-sm font-bold mt-3">
                  Select Package
                </label>

                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="" disabled>
                    Select Package
                  </option>

                  {packages.map((pkg) => (
                    <option
                      key={pkg._id}
                      value={pkg._id}
                    >
                      {pkg.title}
                    </option>
                  ))}
                </select>
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
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Post Description
            </label>

            <textarea
              rows={5}
              value={instantDescription}
              onChange={(e) =>
                setInstantDescription(e.target.value)
              }
              placeholder="Describe what kind of post you want to generate..."
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        )}



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
