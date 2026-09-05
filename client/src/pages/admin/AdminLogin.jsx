import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function AdminLogin() {
  const { login, isAdmin } = useAdminAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-4">
      <div className="w-full">
        <h1 className="font-display text-2xl font-normal">Admin Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={busy} className="gradient-cta w-full rounded-full py-3 font-bold text-black shadow disabled:opacity-60">
            {busy ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
