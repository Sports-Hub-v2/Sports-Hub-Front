// src/lib/axiosInstance.ts
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  withCredentials: true,
})

// Request interceptor: attach access token if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: auto-refresh on 401 once
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return null
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await axios.post(
          '/api/auth/token/refresh',
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )
        const data = (res.data as any) || {}
        const access = data.accessToken as string | undefined
        const newRefresh = data.refreshToken as string | undefined
        if (access) localStorage.setItem('token', access)
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh)
        return access ?? null
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        return null
      } finally {
        refreshPromise = null
      }
    })()
  }
  return refreshPromise
}

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error || {}
    if (!response || response.status !== 401 || !config || (config as any)._retry) {
      return Promise.reject(error)
    }
    ;(config as any)._retry = true
    const newAccess = await refreshAccessToken()
    if (!newAccess) return Promise.reject(error)
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${newAccess}`
    return axiosInstance(config)
  }
)

export default axiosInstance

// Debug switch for HTTP logs (set VITE_HTTP_DEBUG=true or localStorage.httpDebug = "true")
const HTTP_DEBUG = ((): boolean => {
  try { if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_HTTP_DEBUG === 'true') return true } catch {}
  try { return localStorage.getItem('httpDebug') === 'true' } catch {}
  return false
})()