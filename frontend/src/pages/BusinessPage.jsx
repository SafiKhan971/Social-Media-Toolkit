import { useState, useEffect } from 'react'
import Menu from '../components/Menu'

const apiUrl = import.meta.env.VITE_API_BASE_URL

function truncate(text, maxLength = 60) {
  if (!text) return ''
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

export default function BusinessPage() {
  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(false)
  const [error, setError] = useState('')

  async function fetchBusinesses() {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/businesses`)
      if (!res.ok) throw new Error('Failed to load businesses')
      const data = await res.json()
      setBusinesses(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${apiUrl}/businesses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: businessName,
          description: businessDescription,
        }),
      })
      if (!res.ok) throw new Error('Failed to create business')

      setBusinessName('')
      setBusinessDescription('')
      await fetchBusinesses()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-green-400">
      <Menu />
      <div className="flex flex-col items-center mt-15 gap-6">
        <h1 className="mb-6 text-2xl font-semibold text-neutral-800">
            Business
          </h1>
          <button onClick={ setForm } className="mt-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
            Create
          </button>
        {form ? (
          <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                onClick={() => setForm((prev) => !prev)}
                className="flex-1 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        ): (
          <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-neutral-800">
            Created Businesses
          </h2>

          {error && (
            <p className="mb-4 text-sm text-red-500">{error}</p>
          )}

          {loading ? (
            <p className="text-sm text-neutral-500">Loading...</p>
          ) : businesses.length === 0 ? (
            <p className="text-sm text-neutral-500">No businesses yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr
                    key={business._id}
                    className="border-b border-neutral-100 text-neutral-800"
                  >
                    <td className="py-2 pr-4">{business.name}</td>
                    <td className="py-2 text-neutral-600">
                      {truncate(business.description)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        )}
      </div>
    </div>
  )
}