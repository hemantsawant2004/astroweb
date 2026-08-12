import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

const icons = {
  home: (
    <svg {...iconProps}><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9" /></svg>
  ),
  packages: (
    <svg {...iconProps}><rect x="3" y="7" width="18" height="12" rx="2" /><path d="M3 11h18" /><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" /></svg>
  ),
  chat: (
    <svg {...iconProps}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5z" /></svg>
  ),
  horoscope: (
    <svg {...iconProps}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /><circle cx="12" cy="12" r="3.5" /></svg>
  ),
  more: (
    <svg {...iconProps}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
  ),
}

const TABS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/packages', label: 'Sessions', icon: 'packages' },
  { to: '/chat', label: 'Chat', icon: 'chat' },
  { to: '/horoscope', label: 'Horoscope', icon: 'horoscope' },
]

const MORE_LINKS = [
  { to: '/kundli', label: 'Kundli' },
  { to: '/about', label: 'About Amit Joshi' },
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function BottomNav() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const moreActive = MORE_LINKS.some((l) => location.pathname.startsWith(l.to))

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-40 rounded-t-2xl border-t border-gold-500/20 bg-cosmic-900 transition-transform duration-300 ease-out lg:hidden ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'calc(4.75rem + env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">More</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-white/70">
            <span className="block h-5 w-5">{icons.close}</span>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-3">
          {MORE_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 transition ${isActive ? 'bg-gold-500/10 text-gold-400' : 'text-white/85 hover:bg-white/5'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-white/10 px-3 pt-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-semibold text-gold-400">
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="text-sm text-white/60"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-gold-400">
                Login / Sign up
              </Link>
            )}
          </div>
        </nav>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-gold-500/20 bg-cosmic-950 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-md items-stretch justify-between px-1">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  isActive ? 'text-gold-400' : 'text-white/60'
                }`
              }
            >
              <span className="h-5 w-5">{icons[tab.icon]}</span>
              {tab.label}
            </NavLink>
          ))}
          <button
            onClick={() => setOpen(true)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
              moreActive || open ? 'text-gold-400' : 'text-white/60'
            }`}
          >
            <span className="h-5 w-5">{icons.more}</span>
            More
          </button>
        </div>
      </nav>
    </>
  )
}
