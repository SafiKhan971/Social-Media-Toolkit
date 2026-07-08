import { useEffect, useState } from 'react'
import Menu from '../../components/Menu'
import {
  createPackage,
  getPackageById,
  updatePackage,
} from '../../services/packageService'

export default function PackageForm({
  editId,
  businessId,
  onSuccess,
  onCancel,
}) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('Active')

  const [services, setServices] = useState([])
  const [serviceInput, setServiceInput] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editId) {
      fetchPackage()
    }
  }, [editId])

  async function fetchPackage() {
    try {
      const data = await getPackageById(editId)

      setTitle(data.title)
      setPrice(data.price)
      setDuration(data.duration)
      setStartDate(data.startDate?.substring(0, 10))
      setEndDate(data.endDate?.substring(0, 10))
      setStatus(data.status)
      setServices(data.services || [])
    } catch (err) {
      console.error(err)
    }
  }

  function addService() {
    if (!serviceInput.trim()) return

    setServices([...services, serviceInput.trim()])
    setServiceInput('')
  }

  function removeService(index) {
    setServices(services.filter((_, i) => i !== index))
  }

  function resetForm() {
    setTitle('')
    setPrice('')
    setDuration('')
    setStartDate('')
    setEndDate('')
    setStatus('Active')
    setServices([])
    setServiceInput('')

    onCancel?.()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)

    const payload = {
      business: businessId,
      title,
      price,
      services,
      duration,
      startDate,
      endDate,
      status,
    }

    try {
      if (editId) {
        await updatePackage(editId, payload)
      } else {
        await createPackage(payload)
      }

      resetForm()
      onSuccess?.()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen app-gradient">
      <Menu />

      <div className="mx-auto max-w-5xl p-4">
        <div className="mx-auto max-w-4xl p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-full rounded-lg bg-white p-8 shadow-md">
              <div className="mb-6 flex items-center justify-between">
              <h2 className="mb-4 text-lg font-semibold text-neutral-800">
                {editId ? 'Edit Package' : 'Create Package'}
              </h2>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md app-gradient px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>

              </button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Package Title
                    </label>

                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter package title"
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Price
                    </label>

                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Duration
                    </label>

                    <input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Example: 6 Months"
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Status
                    </label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-neutral-700">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">
                    Services
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      placeholder="Enter service"
                      className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={addService}
                      className="rounded-md app-gradient px-4 text-white"
                    >
                      Add
                    </button>
                  </div>

                  {services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {services.map((service, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm"
                        >
                          <span>{service}</span>

                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="text-red-500"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                    disabled={loading}
                    className="flex-1 rounded-md app-gradient px-4 py-2 text-sm font-medium text-white"
                  >
                    {loading
                      ? 'Saving...'
                      : editId
                        ? 'Update'
                        : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}