import { useState } from 'react'
import Menu from '../components/Menu'

const businessOptions = [
  { value: '', label: 'Select a business' },
]

export default function PostPage() {
  const [selectedBusiness, setSelectedBusiness] = useState('')
  const [numberOfPosts, setNumberOfPosts] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ selectedBusiness, numberOfPosts })
  }

  return (
    <div className="min-h-screen bg-green-400">
      <Menu />
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md mt-15">
        <h1 className="mb-6 text-2xl font-semibold text-neutral-800">
          Post
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="selectedBusiness"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Select Business
            </label>
            <select
              id="selectedBusiness"
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
            >
              {businessOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="numberOfPosts"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Number of Posts
            </label>
            <input
              id="numberOfPosts"
              type="number"
              min="1"
              value={numberOfPosts}
              onChange={(e) => setNumberOfPosts(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 focus:border-green-500 focus:outline-none"
              placeholder="e.g. 5"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            Generate
          </button>
        </form>
      </div>
    </div>
  )
}
