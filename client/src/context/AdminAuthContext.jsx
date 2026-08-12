import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('myastroreader_admin_token'))
    setReady(true)
  }, [])

  async function login(password) {
    const { data } = await api.post('/admin/auth/login', { password })
    localStorage.setItem('myastroreader_admin_token', data.token)
    setIsAdmin(true)
  }

  function logout() {
    localStorage.removeItem('myastroreader_admin_token')
    setIsAdmin(false)
  }

  return <AdminAuthContext.Provider value={{ isAdmin, ready, login, logout }}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
