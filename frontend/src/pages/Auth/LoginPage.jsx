import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import api from '../../services/api'
import Menu from '../../components/Menu'
import GoogleLoginButton from '../../components/GoogleLoginButton'

const apiUrl = import.meta.env.VITE_API_BASE_URL

export default function LoginPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const toastId = toast.loading('Logging in...')
    try {
      const { data } = await api.post(`${apiUrl}/auth/login`, formData)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.dismiss(toastId)
      toast.success('Login successful')
      navigate('/')
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen app-gradient">
      <Menu />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="page-card max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full app-gradient shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800">Welcome back</h1>
            <p className="mt-1 text-sm text-neutral-500">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
              Create one
            </Link>
          </p>

          <div className="mt-4">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </div>
  )
}