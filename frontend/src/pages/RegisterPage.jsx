import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import api from '../services/api'
import Menu from '../components/Menu'

const apiUrl = import.meta.env.VITE_API_BASE_URL

export default function RegisterPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match')
    }

    const toastId = toast.loading('Creating account...')

    try {
      const { data } = await api.post(
        `${apiUrl}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      )

      localStorage.setItem('token', data.token)
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

      toast.dismiss(toastId)
      toast.success('Registration successful')

      navigate('/')
    } catch (err) {
      toast.dismiss(toastId)

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Registration failed'
      )
    }
  }

  return (
    <div className="min-h-screen app-gradient">
      <Menu />

      <div className="flex justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-semibold">
            Register
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-1 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder='Enter Full Name'
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder='Enter Email'
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter Password'
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter Confirm Password'
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border px-3 py-2"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              {loading
                ? 'Creating Account...'
                : 'Register'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-green-600"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}