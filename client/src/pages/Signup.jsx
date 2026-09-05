import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FormCard from '../components/FormCard'
import Reveal from '../components/Reveal'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signup(form.name, form.email, form.password, form.phone)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4 py-10">
      <Reveal className="w-full">
        <div className="mb-6 text-center">
          <span className="text-3xl text-gold-400">&#10022;</span>
          <h1 className="mt-2 font-display text-2xl font-normal">Create Account</h1>
          <p className="mt-1 text-sm text-ink-soft">Book sessions and track your requests in one place.</p>
        </div>
        <FormCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Full name" value={form.name} onChange={update('name')} className="input" />
            <input required type="email" placeholder="Email" value={form.email} onChange={update('email')} className="input" />
            <input placeholder="Phone" value={form.phone} onChange={update('phone')} className="input" />
            <input required type="password" placeholder="Password" value={form.password} onChange={update('password')} className="input" />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={busy} className="gradient-cta w-full rounded-full py-3 font-bold text-black shadow disabled:opacity-60">
              {busy ? 'Creating…' : 'Sign Up'}
            </button>
          </form>
        </FormCard>
        <p className="mt-4 text-center text-sm text-ink-soft">
          Already have an account? <Link to="/login" className="font-semibold text-gold-400 hover:underline">Log in</Link>
        </p>
      </Reveal>
    </div>
  )
}
