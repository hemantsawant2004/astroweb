import { Link, NavLink } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-cosmic-950 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-gold-400">&#10022;</span>
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-gold-400 ${isActive ? 'text-gold-400' : 'text-white/85'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-semibold text-white/90 hover:text-gold-400">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="text-sm text-white/60 hover:text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-white/90 hover:text-gold-400">
                Login
              </Link>
              <Link to="/chat" className="gradient-cta rounded-full px-5 py-2 text-sm font-bold text-black shadow">
                Chat Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile: identity + account only. Navigation lives in the bottom nav bar. */}
        <Link to={user ? '/dashboard' : '/login'} className="text-sm font-semibold text-gold-400 lg:hidden">
          {user ? user.name.split(' ')[0] : 'Login'}
        </Link>
      </div>
    </header>
  )
}
