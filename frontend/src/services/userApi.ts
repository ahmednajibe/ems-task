import api from './api'

export const userApi = {
  // Update user profile
  async updateProfile(data: { full_name?: string; email?: string }) {
    try {
      const response = await api.post('/api/method/ems.api.update_user_profile', data)
      
      if (response.data.message?.success) {
        return {
          success: true,
          data: response.data.message.data
        }
      } else {
        return {
          success: false,
          message: response.data.message?.message || 'Failed to update profile'
        }
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      }
    }
  },

  // Change password
  async changePassword(data: { old_password: string; new_password: string }) {
    try {
      const response = await api.post('/api/method/ems.api.change_user_password', data)
      
      if (response.data.message?.success) {
        return { success: true }
      } else {
        return {
          success: false,
          message: response.data.message?.message || 'Failed to change password'
        }
      }
    } catch (error: any) {
      console.error('Error changing password:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      }
    }
  }
}
