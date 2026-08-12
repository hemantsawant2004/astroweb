import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export function AdminProtectedRoute({ children }) {
  const { isAdmin, ready } = useAdminAuth()
  if (!ready) return null
  if (!isAdmin) return <Navigate to="/admin" replace />
  return children
}
