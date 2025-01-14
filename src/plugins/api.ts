import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const baseURL = import.meta.env.VITE_SUPABASE_URL as string

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    common: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
})

api.interceptors.request.use(
  function (config) {
    const token = useAuthStore().token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  function (error: any) {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    const status = error.response?.status
    switch (status) {
      case 401:
        useAuthStore().logout()
    }
    return Promise.reject(error)
  },
)

export default api
