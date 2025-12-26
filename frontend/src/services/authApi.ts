import api from './api'

interface LoginResponse {
  message: {
    success: boolean
    data?: {
      token: string
      user: {
        id: string
        email: string
        name: string
        role: 'admin' | 'manager' | 'employee'
      }
    }
    message?: string
  }
}

export const authApi = {
  // تسجيل الدخول
  async login(email: string, password: string) {
    try {
      console.log('🔵 Login attempt:', email)
      
      // Using GET with query params (works with current Frappe setup)
      const response = await api.get<LoginResponse>(
        '/api/method/ems.api.login_with_credentials',
        {
          params: { email, password }
        }
      )
      
      console.log('🔵 Full response:', response)
      console.log('🔵 Response data:', response.data)
      
      const result = response.data.message
      
      console.log('🔵 Result:', result)
      
      if (result.success && result.data) {
        console.log('✅ Token:', result.data.token)
        console.log('✅ User:', result.data.user)
        
        // حفظ Token وبيانات المستخدم
        localStorage.setItem('auth_token', result.data.token)
        localStorage.setItem('auth_user', JSON.stringify(result.data.user))
        
        console.log('✅ Token saved to localStorage')
        
        return {
          success: true,
          data: result.data
        }
      }
      
      console.error('❌ Login failed:', result)
      return {
        success: false,
        message: result.message || 'Login failed'
      }
      
    } catch (error: any) {
      console.error('❌ Login error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  },

  // تسجيل الخروج
  async logout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    return { success: true }
  },

  // التحقق من Token
  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('auth_token')
    if (!token) return false

    try {
      // Use a simple API call that requires authentication
      // If it succeeds, token is valid
      await api.get('/api/resource/Employee', {
        params: {
          limit_page_length: 1
        }
      })
      return true
    } catch {
      return false
    }
  }
}