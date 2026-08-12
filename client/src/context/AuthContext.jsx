import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('myastroreader_user')
    if (stored) setUser(JSON.parse(stored))
    setReady(true)
  }, [])

  function persist(token, userData) {
    localStorage.setItem('myastroreader_token', token)
    localStorage.setItem('myastroreader_user', JSON.stringify(userData))
    setUser(userData)
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    persist(data.token, data.user)
    return data.user
  }

  async function signup(name, email, password, phone) {
    const { data } = await api.post('/auth/signup', { name, email, password, phone })
    persist(data.token, data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('myastroreader_token')
    localStorage.removeItem('myastroreader_user')
    setUser(null)
  }

  function updateWalletBalance(balancePaise) {
    setUser((prev) => {
      const next = { ...prev, wallet_balance_paise: balancePaise }
      localStorage.setItem('myastroreader_user', JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout, updateWalletBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
