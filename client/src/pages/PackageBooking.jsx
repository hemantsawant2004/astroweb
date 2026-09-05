import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { formatPaise } from '../utils/money'
import { loadRazorpayScript } from '../utils/loadRazorpay'
import { siteConfig } from '../data/siteConfig'
import FormCard from '../components/FormCard'
import Reveal from '../components/Reveal'
import { isDemoMode } from '../demo/mockApi'

export default function PackageBooking() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [pkg, setPkg] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', birthDate: '', birthTime: '', birthPlace: '', preferredDatetime: '',
  })
  const [status, setStatus] = useState('idle') // idle | submitting | paid | error
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/packages/${slug}`).then((r) => setPkg(r.data))
  }, [slug])

  useEffect(() => {
    if (user) {
      setForm((f) => ({ ...f, name: user.name, email: user.email, phone: user.phone || '' }))
    }
  }, [user])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const { data: booking } = await api.post('/bookings', { packageId: pkg.id, ...form })

      if (isDemoMode()) {
        await new Promise((resolve) => setTimeout(resolve, 1200))
        await api.post('/payments/verify', {
          purpose: 'booking',
          bookingId: booking.id,
          razorpay_order_id: 'demo',
          razorpay_payment_id: 'demo',
          razorpay_signature: 'demo',
        })
        setStatus('paid')
        return
      }

      const ok = await loadRazorpayScript()
      if (!ok) throw new Error('Could not load payment gateway. Check your internet connection.')

      const { data: order } = await api.post('/payments/create-order', { purpose: 'booking', bookingId: booking.id })

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: siteConfig.name,
        description: pkg.name,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#d4af37' },
        handler: async (response) => {
          try {
            await api.post('/payments/verify', {
              purpose: 'booking',
              bookingId: booking.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            setStatus('paid')
          } catch {
            setStatus('error')
            setError('Payment succeeded but confirmation failed. Please contact us with your payment ID.')
          }
        },
        modal: { ondismiss: () => setStatus('idle') },
      })
      rzp.on('payment.failed', () => {
        setStatus('error')
        setError('Payment failed. Please try again.')
      })
      rzp.open()
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.error || err.message)
    }
  }

  if (!pkg) return <div className="mx-auto max-w-xl px-4 py-16 text-center text-ink-soft">Loading&hellip;</div>

  if (status === 'paid') {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Reveal>
          <div className="gradient-cta mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-black shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            &#10003;
          </div>
          <h1 className="font-display text-2xl font-normal">Booking confirmed!</h1>
          <p className="mt-3 text-ink-soft">
            Your {pkg.name} is booked and paid. We&apos;ll reach out at {form.phone || form.email} to confirm the
            appointment time.
          </p>
          <button onClick={() => navigate('/')} className="gradient-cta mt-6 rounded-full px-6 py-2 font-bold text-black">
            Back to Home
          </button>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Reveal>
        <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">Book a Session</p>
        <h1 className="mt-2 font-display text-2xl font-normal sm:text-3xl">{pkg.name}</h1>
        <p className="mt-2 text-ink-soft">{pkg.description}</p>
        <p className="mt-2 text-xl font-extrabold text-gold-400">
          {formatPaise(pkg.price_paise)} &middot; {pkg.duration_min} min
        </p>
      </Reveal>

      <Reveal delay={100}>
        <FormCard className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Full name" value={form.name} onChange={update('name')} className="input" />
              <input required type="email" placeholder="Email" value={form.email} onChange={update('email')} className="input" />
            </div>
            <input required placeholder="Phone (with country code)" value={form.phone} onChange={update('phone')} className="input" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-ink-soft">
                Birth date
                <input type="date" value={form.birthDate} onChange={update('birthDate')} className="input mt-1" />
              </label>
              <label className="block text-sm text-ink-soft">
                Birth time
                <input type="time" value={form.birthTime} onChange={update('birthTime')} className="input mt-1" />
              </label>
            </div>
            <input placeholder="Birth place (city, country)" value={form.birthPlace} onChange={update('birthPlace')} className="input" />
            <label className="block text-sm text-ink-soft">
              Preferred appointment date/time
              <input type="datetime-local" value={form.preferredDatetime} onChange={update('preferredDatetime')} className="input mt-1" />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="gradient-cta w-full rounded-full py-3 font-bold text-black shadow disabled:opacity-60"
            >
              {status === 'submitting' ? 'Processing…' : `Pay ${formatPaise(pkg.price_paise)} & Book`}
            </button>
          </form>
        </FormCard>
      </Reveal>
    </div>
  )
}
