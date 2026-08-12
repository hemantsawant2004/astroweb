import { useState } from 'react'
import { api } from '../api/client'
import { siteConfig } from '../data/siteConfig'
import FormCard from '../components/FormCard'
import Reveal from '../components/Reveal'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await api.post('/enquiries', form)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.error || 'Could not send your message')
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 lg:grid-cols-2">
      <Reveal>
        <p className="star-dot text-xs font-semibold uppercase tracking-widest text-gold-400">Get in Touch</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gold-300 sm:text-4xl">Contact Us</h1>
        <p className="mt-4 text-ink-soft">Questions before booking? Reach out directly or send a message.</p>
        <div className="card-gold mt-8 space-y-3 rounded-2xl border border-gold-500/20 bg-surface p-6 text-ink-soft">
          <p><strong className="text-gold-300">Email:</strong> {siteConfig.contact.email}</p>
          <p><strong className="text-gold-300">Phone:</strong> {siteConfig.contact.phone}</p>
          <p><strong className="text-gold-300">Address:</strong> {siteConfig.contact.address}</p>
          <a
            href={`https://wa.me/${siteConfig.contact.phoneDigits}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-full bg-green-600 px-6 py-2 font-bold text-white shadow transition hover:bg-green-500"
          >
            Message on WhatsApp
          </a>
        </div>
      </Reveal>

      <Reveal delay={150}>
        {status === 'done' ? (
          <FormCard>
            <div className="gradient-cta mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-black">
              &#10003;
            </div>
            <p className="text-center text-ink-soft">Thanks for reaching out &mdash; we&apos;ll get back to you shortly.</p>
          </FormCard>
        ) : (
          <FormCard>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Full name" value={form.name} onChange={update('name')} className="input" />
              <input type="email" placeholder="Email" value={form.email} onChange={update('email')} className="input" />
              <input placeholder="Phone" value={form.phone} onChange={update('phone')} className="input" />
              <textarea required placeholder="Your message" rows={5} value={form.message} onChange={update('message')} className="input" />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="gradient-cta w-full rounded-full py-3 font-bold text-black shadow disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </FormCard>
        )}
      </Reveal>
    </div>
  )
}
