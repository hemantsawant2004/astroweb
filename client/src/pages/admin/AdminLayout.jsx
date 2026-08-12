import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

const TABS = [
  { to: '/admin/dashboard/leads', label: 'Leads & Bookings' },
  { to: '/admin/dashboard/packages', label: 'Packages' },
  { to: '/admin/dashboard/astrologer', label: 'Astrologer Profile' },
  { to: '/admin/dashboard/testimonials', label: 'Testimonials' },
  { to: '/admin/dashboard/faqs', label: 'FAQs' },
  { to: '/admin/dashboard/horoscopes', label: 'Horoscopes' },
  { to: '/admin/dashboard/blog', label: 'Blog' },
]

export default function AdminLayout() {
  const { logout } = useAdminAuth()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gold-300">Admin Dashboard</h1>
        <button
          onClick={() => {
            logout()
            navigate('/admin')
          }}
          className="text-sm font-semibold text-red-400"
        >
          Log Out
        </button>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-gold-500/20 pb-3">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 text-sm font-semibold ${
                isActive ? 'gradient-cta text-black' : 'bg-gold-500/10 text-gold-300'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  )
}
