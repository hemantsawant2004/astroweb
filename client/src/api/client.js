import axios from 'axios'
import { mockApi, mockAdminApi, isDemoMode } from '../demo/mockApi'

const demo = isDemoMode()

export const api = demo ? mockApi : axios.create({ baseURL: '/api' })
export const adminApi = demo ? mockAdminApi : axios.create({ baseURL: '/api/admin' })

if (!demo) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('myastroreader_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('myastroreader_admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
}
