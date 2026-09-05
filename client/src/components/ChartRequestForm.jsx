import { useState } from 'react'
import { api } from '../api/client'
import FormCard from './FormCard'
import Reveal from './Reveal'

const emptyPerson = { name: '', dob: '', tob: '', pob: '' }

export default function ChartRequestForm({ type, title, description, eyebrow }) {
  const isMatching = type === 'kundli_matching'
  const [form, setForm] = useState({ ...emptyPerson, email: '', phone: '', gender: '' })
  const [partner, setPartner] = useState({ ...emptyPerson })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }
  function updatePartner(field) {
    return (e) => setPartner((p) => ({ ...p, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await api.post('/chart-requests', {
        type,
        name: form.name,
        email: form.email || undefined,
        phone: form.phone,
        dob: form.dob,
        tob: form.tob || undefined,
        pob: form.pob,
        gender: form.gender || undefined,
        partnerDetails: isMatching ? partner : undefined,
      })
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
            &#10003;
          </div>
          <h1 className="font-display text-2xl font-normal">Request received</h1>
          <p className="mt-3 text-ink-soft">
            Thanks &mdash; Amit will personally review your birth details and reach out to discuss next steps. There
            is no automated report; this is manual, human analysis.
          </p>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Reveal>
        {eyebrow && <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-2xl font-normal sm:text-3xl">{title}</h1>
        <p className="mt-2 text-ink-soft">{description}</p>
      </Reveal>

      <Reveal delay={100}>
        <FormCard className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm font-semibold text-gold-300">{isMatching ? 'Your details' : 'Your birth details'}</p>
            <input required placeholder="Full name" value={form.name} onChange={update('name')} className="input" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="email" placeholder="Email (optional)" value={form.email} onChange={update('email')} className="input" />
              <input required placeholder="Phone" value={form.phone} onChange={update('phone')} className="input" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm text-ink-soft">
                Date of birth
                <input required type="date" value={form.dob} onChange={update('dob')} className="input mt-1" />
              </label>
              <label className="block text-sm text-ink-soft">
                Time of birth
                <input type="time" value={form.tob} onChange={update('tob')} className="input mt-1" />
              </label>
              <input placeholder="Gender" value={form.gender} onChange={update('gender')} className="input self-end" />
            </div>
            <input required placeholder="Place of birth (city, country)" value={form.pob} onChange={update('pob')} className="input" />

            {isMatching && (
              <>
                <p className="pt-2 text-sm font-semibold text-gold-300">Partner&apos;s birth details</p>
                <input required placeholder="Partner's full name" value={partner.name} onChange={updatePartner('name')} className="input" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm text-ink-soft">
                    Date of birth
                    <input required type="date" value={partner.dob} onChange={updatePartner('dob')} className="input mt-1" />
                  </label>
                  <label className="block text-sm text-ink-soft">
                    Time of birth
                    <input type="time" value={partner.tob} onChange={updatePartner('tob')} className="input mt-1" />
                  </label>
                </div>
                <input required placeholder="Partner's place of birth" value={partner.pob} onChange={updatePartner('pob')} className="input" />
              </>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="gradient-cta w-full rounded-full py-3 font-bold text-black shadow disabled:opacity-60"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Request'}
            </button>
          </form>
        </FormCard>
      </Reveal>
    </div>
  )
}
