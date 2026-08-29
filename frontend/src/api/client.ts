import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || '/api/v1'

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})


client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    if (status === 401) {
      useAuthStore.getState().logout()
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error('Access denied')
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (status !== 404 && status !== 400) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

export default client
