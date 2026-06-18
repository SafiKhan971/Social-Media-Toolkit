import { useState } from 'react'
import Menu from '../components/Menu'

export default function BusinessPage() {
  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ businessName, businessDescription })
  }

  return (
    <div className="min-h-screen bg-green-400">
      <Menu />
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md mt-15">
        <h1 className="mb-6 text-2xl font-semibold text-neutral-800">
          Business
        </h1>
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

          <button
            type="submit"
            className="mt-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
