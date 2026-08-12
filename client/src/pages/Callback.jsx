import { useEffect, useState } from 'react'
import { api } from '../api/client'
import FormCard from '../components/FormCard'
import Reveal from '../components/Reveal'

export default function Callback() {
  const [astrologerId, setAstrologerId] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', preferredTime: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/astrologers/amit-joshi').then((r) => setAstrologerId(r.data.id))
  }, [])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await api.post('/callback-requests', { astrologerId, ...form })
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.error || 'Could not submit request')
    }
  }

  if (status === 'done') {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <Reveal>
          <div className="gradient-cta mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-black shadow-[0_0_40px_rgba(212,175,55,0.4)]">
            &#9742;
          </div>
          <h1 className="text-2xl font-bold text-gold-300">We&apos;ll call you back</h1>
          <p className="mt-3 text-ink-soft">Amit&apos;s team will call you at {form.phone} around your preferred time.</p>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <Reveal>
        <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">Talk to Amit</p>
        <h1 className="mt-2 text-2xl font-bold text-gold-300 sm:text-3xl">Request a Callback</h1>
        <p className="mt-2 text-ink-soft">Prefer a phone conversation? Leave your number and a good time to call.</p>
      </Reveal>
      <Reveal delay={100}>
        <FormCard className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Full name" value={form.name} onChange={update('name')} className="input" />
            <input required placeholder="Phone" value={form.phone} onChange={update('phone')} className="input" />
            <input placeholder="Preferred time (e.g. today 6-8pm IST)" value={form.preferredTime} onChange={update('preferredTime')} className="input" />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={!astrologerId || status === 'submitting'}
              className="gradient-cta w-full rounded-full py-3 font-bold text-black shadow disabled:opacity-60"
            >
              {status === 'submitting' ? 'Submitting…' : 'Request Callback'}
            </button>
          </form>
        </FormCard>
      </Reveal>
    </div>
  )
}
