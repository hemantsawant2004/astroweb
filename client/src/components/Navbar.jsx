import { Link, NavLink } from 'react-router-dom'
import { siteConfig } from '../data/siteConfig'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import logo from '../assets/astrologo.jpg'

const PRIMARY_NAV = [
  { label: 'Packages', to: '/packages' },
  { label: 'Kundli', to: '/kundli' },
  // { label: 'Horoscope', to: '/horoscope' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-cream text-ink shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold">
          <img
            id="navbar-logo"
            src={logo}
            alt={siteConfig.name}
            className="h-9 w-9 rounded-full border border-gold-500/50 object-cover"
          />
          <span className="flex flex-col leading-tight">
            <span>{siteConfig.name}</span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-gold-400/80">
              {siteConfig.astrologer.name}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-gold-400 ${isActive ? 'text-gold-400' : 'text-ink/75'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-semibold text-ink/90 hover:text-gold-400">
                {user.name.split(' ')[0]}
              </Link>
              <button onClick={logout} className="text-sm text-ink/60 hover:text-ink">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-ink/90 hover:text-gold-400">
              Login
            </Link>
          )}
          <Link to="/packages" className="gradient-cta rounded-full px-5 py-2 text-sm font-bold text-black shadow">
            Book a Consultation
          </Link>
        </div>

        {/* Mobile: identity + account only. Navigation lives in the bottom nav bar. */}
        <Link to={user ? '/dashboard' : '/login'} className="text-sm font-semibold text-gold-400 lg:hidden">
          {user ? user.name.split(' ')[0] : 'Login'}
        </Link>
      </div>
    </header>
  )
}
