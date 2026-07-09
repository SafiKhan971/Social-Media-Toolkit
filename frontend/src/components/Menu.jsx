import { NavLink, useNavigate } from 'react-router-dom'
import smtLogo from '../assets/smt-logo.svg'
import { toast } from 'sonner'
import Swal from 'sweetalert2'


export default function Menu() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout?',
      text: 'You will need to login again to access your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
    })

    if (!result.isConfirmed) return

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    await Swal.fire({
      title: 'Logged out',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
    })

    window.location.href = '/login'
  }

  const links = [
    { to: '/', label: 'Home' },
    { to: '/business', label: 'Business' },
     { to: '/category', label: 'Category' }, 
    { to: '/post', label: 'Post' },
    { to: '/editor', label: 'Editor' }

  ]

  return (
    <div className="flex justify-center py-6">
      <nav className="flex items-center gap-3 rounded-md bg-white p-2 shadow-sm">
        <img src={smtLogo} alt="SMT logo" className="h-6 w-6" />

        <div className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'app-gradient text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {token ? (
            <button
              onClick={handleLogout}
              className="rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                    ? 'bg-green-400 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `rounded-md px-4 py-2 text-sm font-medium transition-colors ${isActive
                    ? 'bg-green-400 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
