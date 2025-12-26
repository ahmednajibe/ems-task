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
    // Only redirect to login if it's an authentication error
    // NOT if it's a permissions error from a Server Script
    if (error.response?.status === 401) {
      // Check if this is truly an auth failure (not just a Server Script error)
      const isAuthEndpoint = error.config?.url?.includes('/login_with_credentials') || 
                             error.config?.url?.includes('/get_logged_user')
      
      if (isAuthEndpoint || !localStorage.getItem('auth_token')) {
        // Clear auth and redirect only if:
        // 1. Login endpoint failed, OR
        // 2. No token exists
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    
    // Log the error but don't redirect on 403 (might be permissions, not auth)
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.config?.url)
    }
    
    return Promise.reject(error)
  }
)

export default api