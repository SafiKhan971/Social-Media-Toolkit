import { NavLink, useNavigate } from 'react-router-dom'
import smtLogo from '../assets/smt-logo.svg'
import newLogo from '../../public/logo-1.png'
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
    { to: '/shorts', label: 'Shorts' },
    { to: '/editor', label: 'Editor' },
  ]

  const activeLinkClass = 'bg-success text-white rounded-md px-4 py-2 text-sm font-medium'
  const inactiveLinkClass = 'hover:bg-success hover:text-white rounded-md px-4 py-2 text-sm font-medium transition-colors'

  return (
    <div className="flex justify-center py-5 px-4">
      <nav className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md border border-neutral-100">
        <img src={newLogo} alt="SMT logo" className="h-12 w-12 shrink-0 rounded-full" />
        <span className='font-bold mr-9'>Quick Post</span>

        {/* Nav links — hidden on very small screens, shown from sm up */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
            >
              {link.label}
            </NavLink>
          ))}

          {token ? (
            <button
              onClick={handleLogout}
              className="rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile: compact link row */}
        <div className="flex sm:hidden items-center gap-1 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'app-gradient text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {token ? (
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? 'app-gradient text-white' : 'text-neutral-600 hover:bg-neutral-100'
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? 'app-gradient text-white' : 'text-neutral-600 hover:bg-neutral-100'
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
