import { NavLink } from 'react-router-dom'
import viteLogo from '../assets/vite.svg'

const links = [
  { to: '/', label: 'Home' },
  { to: '/business', label: 'Business' },
  { to: '/post', label: 'Post' },
]

export default function Menu() {
  return (
    <div className="flex justify-center py-6">
      <nav className="flex items-center gap-3 rounded-md bg-white p-2 shadow-sm">
        <img src={viteLogo} alt="Vite logo" className="h-6 w-6" />
        <div className="flex items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-400 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}