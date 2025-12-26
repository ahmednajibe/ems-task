import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor - إضافة Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Frappe Token format: "token api_key:api_secret"
      config.headers.Authorization = `token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect if we're on the login page
    const isOnLoginPage = window.location.pathname === '/login'
    
    // Only redirect to login if it's an authentication error
    if (error.response?.status === 401 && !isOnLoginPage) {
      // Check if this is truly an auth failure
      const hasToken = localStorage.getItem('auth_token')
      
      if (!hasToken) {
        // No token, redirect to login
        window.location.href = '/login'
      }
    }
    
    // Log 403 errors
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.config?.url)
    }
    
    return Promise.reject(error)
  }
)

export default api