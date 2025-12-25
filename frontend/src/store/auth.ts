import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// import { useToastStore } from './toast'

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
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockUsers: Record<string, User & { password: string }> = {
        'admin@org.com': {
          id: '1',
          email: 'admin@org.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin',
          avatar: 'AD'
        },
        'manager@org.com': {
          id: '2',
          email: 'manager@org.com',
          password: 'manager123',
          name: 'Manager User',
          role: 'manager',
          avatar: 'MU'
        },
        'employee@org.com': {
          id: '3',
          email: 'employee@org.com',
          password: 'employee123',
          name: 'Employee User',
          role: 'employee',
          avatar: 'EU'
        }
      }

      const foundUser = mockUsers[email]

      if (!foundUser || foundUser.password !== password) {
        throw new Error('Invalid email or password')
      }

      const { password: _, ...userData } = foundUser
      user.value = userData
      token.value = 'mock-jwt-token-' + Date.now()

      localStorage.setItem('auth_token', token.value)
      localStorage.setItem('auth_user', JSON.stringify(userData))

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  function restoreSession() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
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