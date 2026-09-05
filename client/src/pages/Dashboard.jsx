import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Reveal from '../components/Reveal'

const STATUS_STYLE = {
  pending: 'text-gold-400',
  new: 'text-gold-400',
  confirmed: 'text-green-400',
  completed: 'text-green-400',
  reviewed: 'text-blue-300',
  contacted: 'text-blue-300',
  cancelled: 'text-red-400',
  closed: 'text-white/40',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [chartRequests, setChartRequests] = useState([])

  useEffect(() => {
    api.get('/account/bookings').then((r) => setBookings(r.data))
    api.get('/account/chart-requests').then((r) => setChartRequests(r.data))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Reveal>
        <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">Your Account</p>
        <h1 className="mt-2 font-display text-3xl font-normal sm:text-4xl">Hi, {user?.name?.split(' ')[0]}</h1>
      </Reveal>

      <Reveal delay={100}>
        <section className="card-gold mt-8 rounded-2xl border border-gold-500/20 bg-surface p-6 shadow-sm">
          <h2 className="star-dot font-bold text-gold-300">Your Bookings</h2>
          {bookings.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">No bookings yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gold-500/10">
              {bookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{b.package_name}</span>
                  <span className={`font-semibold ${STATUS_STYLE[b.status] || 'text-ink-soft'}`}>
                    {b.status} &middot; {b.payment_status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Reveal>

      <Reveal delay={200}>
        <section className="card-gold mt-8 rounded-2xl border border-gold-500/20 bg-surface p-6 shadow-sm">
          <h2 className="star-dot font-bold text-gold-300">Chart Requests</h2>
          {chartRequests.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">No requests submitted yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gold-500/10">
              {chartRequests.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="capitalize">{c.type.replace('_', ' ')}</span>
                  <span className={`font-semibold capitalize ${STATUS_STYLE[c.status] || 'text-ink-soft'}`}>
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Reveal>
    </div>
  )
}
