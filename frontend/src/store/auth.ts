import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/authApi'

// User interface
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'employee'
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isManager = computed(() => user.value?.role === 'manager')
  const isEmployee = computed(() => user.value?.role === 'employee')

  // Actions
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    try {
      const result = await authApi.login(email, password)
      
      if (!result.success || !result.data) {
        error.value = result.message || 'Login failed'
        return false
      }

      user.value = result.data.user
      token.value = result.data.token
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    authApi.logout()
    user.value = null
    token.value = null
  }

  async function restoreSession() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      // Restore immediately for better UX
      token.value = savedToken
      user.value = JSON.parse(savedUser)
      
      // Verify in background (optional)
      try {
        await authApi.verifyToken()
      } catch (error) {
        // If token is invalid, interceptor will handle logout
        console.error('Token verification failed:', error)
      }
    }
  }

  restoreSession()

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    userRole,
    isAdmin,
    isManager,
    isEmployee,
    login,
    logout,
    restoreSession
  }
})