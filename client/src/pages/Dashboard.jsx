import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatPaise } from '../utils/money'
import { loadRazorpayScript } from '../utils/loadRazorpay'
import { siteConfig } from '../data/siteConfig'
import Reveal from '../components/Reveal'
import { isDemoMode } from '../demo/mockApi'

const TOPUP_OPTIONS = [50000, 100000, 200000] // paise: Rs 500 / Rs 1000 / Rs 2000

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
  const { user, updateWalletBalance } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [bookings, setBookings] = useState([])
  const [chartRequests, setChartRequests] = useState([])
  const [topupError, setTopupError] = useState('')
  const [topupBusy, setTopupBusy] = useState(false)

  function refreshWallet() {
    api.get('/wallet').then((r) => {
      setWallet(r.data)
      updateWalletBalance(r.data.balancePaise)
    })
  }

  useEffect(() => {
    refreshWallet()
    api.get('/wallet/bookings').then((r) => setBookings(r.data))
    api.get('/wallet/chart-requests').then((r) => setChartRequests(r.data))
  }, [])

  async function handleTopup(amountPaise) {
    setTopupBusy(true)
    setTopupError('')
    try {
      if (isDemoMode()) {
        await new Promise((resolve) => setTimeout(resolve, 900))
        await api.post('/payments/verify', {
          purpose: 'wallet_topup',
          amountPaise,
          razorpay_order_id: 'demo',
          razorpay_payment_id: 'demo',
          razorpay_signature: 'demo',
        })
        refreshWallet()
        return
      }

      const ok = await loadRazorpayScript()
      if (!ok) throw new Error('Could not load payment gateway')

      const { data: order } = await api.post('/payments/create-order', { purpose: 'wallet_topup', amountPaise })

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: siteConfig.name,
        description: 'Wallet top-up',
        prefill: { name: user.name, email: user.email, contact: user.phone },
        theme: { color: '#d4af37' },
        handler: async (response) => {
          await api.post('/payments/verify', {
            purpose: 'wallet_topup',
            amountPaise,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          refreshWallet()
        },
      })
      rzp.open()
    } catch (err) {
      setTopupError(err.response?.data?.error || err.message)
    } finally {
      setTopupBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Reveal>
        <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">Your Account</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gold-300 sm:text-4xl">Hi, {user?.name?.split(' ')[0]}</h1>
      </Reveal>

      <Reveal delay={100}>
        <section className="card-gold mt-8 rounded-2xl border border-gold-500/20 bg-surface p-6 shadow-sm">
          <h2 className="star-dot font-bold text-gold-300">Wallet</h2>
          <p className="mt-1 text-3xl font-extrabold text-gold-400">
            {wallet ? formatPaise(wallet.balancePaise) : '—'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {TOPUP_OPTIONS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleTopup(amount)}
                disabled={topupBusy}
                className="rounded-full border border-gold-500 px-5 py-2 text-sm font-semibold text-gold-300 transition hover:bg-gold-500/10 disabled:opacity-60"
              >
                + {formatPaise(amount)}
              </button>
            ))}
          </div>
          {topupError && <p className="mt-3 text-sm text-red-400">{topupError}</p>}
          <Link to="/chat" className="mt-4 inline-block text-sm font-semibold text-gold-400 hover:underline">
            Start a chat session &rarr;
          </Link>
        </section>
      </Reveal>

      <Reveal delay={200}>
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

      <Reveal delay={300}>
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
