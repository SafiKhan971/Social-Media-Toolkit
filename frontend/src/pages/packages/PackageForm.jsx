import { useEffect, useState } from 'react'
import { createPackage, getPackageById, updatePackage } from '../../services/packageService'
import api from '../../services/api'

export default function PackageForm({ editId, businessId, onSuccess, onCancel }) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currency, setCurrency] = useState('')
  const [services, setServices] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [serviceInput, setServiceInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCurrencies()
    if (editId) {
      fetchPackage()
    }
  }, [editId])

  async function fetchCurrencies() {
    try {
      const response = await api.get('currencies')

      console.log(response)
      console.log(response.data)

      setCurrencies(response.data.currencies)
    } catch (error) {
      console.error(error)

      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  async function fetchPackage() {
    try {
      const data = await getPackageById(editId)

      setTitle(data.title)
      setPrice(data.price)
      setDuration(data.duration)
      setStartDate(data.startDate?.substring(0, 10))
      setEndDate(data.endDate?.substring(0, 10))
      setCurrency(data.currency)
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
    setCurrency('Active')
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
      currency,
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
    <div className='page-card'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='section-heading'>{editId ? 'Edit Offer' : 'Create Offer'}</h2>
        <button type='button' onClick={onCancel} className='btn-secondary'>
          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Back
        </button>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='form-label'>Offer Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Enter package title' className='form-input' />
          </div>

          <div>
            <label className='form-label'>Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder='Enter price' className='form-input' />
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='form-label'>Currency</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className='form-input'>
              <option value='' disabled>
                Select Currency
              </option>
              {currencies.map(currency => (
                <option key={currency._id} value={currency._id}>
                  {' '}
                  {currency.name} ({currency.code}){' '}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='form-label'>Duration</label>
            <input value={duration} onChange={e => setDuration(e.target.value)} placeholder='Example: 6 Months' className='form-input' />
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='form-label'>Start Date</label>
            <input type='date' value={startDate} onChange={e => setStartDate(e.target.value)} className='form-input' />
          </div>

          <div>
            <label className='form-label'>End Date</label>
            <input type='date' value={endDate} onChange={e => setEndDate(e.target.value)} className='form-input' />
          </div>
        </div>
        <div>
          <label className='form-label'>Services</label>

          <div className='flex gap-2'>
            <input
              value={serviceInput}
              onChange={e => setServiceInput(e.target.value)}
              placeholder='Enter service'
              className='form-input flex-1'
            />

            <button type='button' onClick={addService} className='btn-primary px-4'>
              Add
            </button>
          </div>

          {services.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {services.map((service, index) => (
                <div key={index} className='flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm'>
                  <span>{service}</span>

                  <button type='button' onClick={() => removeService(index)} className='text-red-500'>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='mt-2 flex gap-3 border-t border-neutral-100 pt-4'>
          <button type='button' onClick={resetForm} className='btn-secondary flex-1'>
            Cancel
          </button>

          <button type='submit' disabled={loading} className='btn-primary flex-1'>
            {loading ? 'Saving...' : editId ? '✔ Update' : '✔ Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
