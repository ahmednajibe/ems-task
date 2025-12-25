<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import {
  UserCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const toastStore = useToastStore()

// Edit mode
const isEditing = ref(false)
const isChangingPassword = ref(false)

// Form data
const formData = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPasswords = ref({
  current: false,
  new: false,
  confirm: false
})

// Avatar initials
const avatarInitials = computed(() => {
  if (!authStore.user?.name) return 'U'
  return authStore.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Role badge color
const getRoleBadgeColor = (role: string) => {
  const colors = {
    admin: 'bg-purple-100 text-purple-700',
    manager: 'bg-blue-100 text-blue-700',
    employee: 'bg-green-100 text-green-700'
  }
  return colors[role as keyof typeof colors] || 'bg-neutral-100 text-neutral-700'
}

// Profile edit functions
const startEdit = () => {
  formData.value = {
    name: authStore.user?.name || '',
    email: authStore.user?.email || ''
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveChanges = () => {
  if (!formData.value.name || !formData.value.email) {
    toastStore.error('Name and email are required')
    return
  }
  
  if (authStore.user) {
    authStore.user.name = formData.value.name
    authStore.user.email = formData.value.email
    localStorage.setItem('auth_user', JSON.stringify(authStore.user))
  }
  
  toastStore.success('Profile updated successfully!')
  isEditing.value = false
}

// Password change functions
const startPasswordChange = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showPasswords.value = {
    current: false,
    new: false,
    confirm: false
  }
  isChangingPassword.value = true
}

const cancelPasswordChange = () => {
  isChangingPassword.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showPasswords.value = {
    current: false,
    new: false,
    confirm: false
  }
}

const changePassword = () => {
  if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || !passwordForm.value.confirmPassword) {
    toastStore.error('All password fields are required')
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    toastStore.error('New password must be at least 6 characters')
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    toastStore.error('New passwords do not match')
    return
  }
  
  if (passwordForm.value.currentPassword !== 'admin123' && 
      passwordForm.value.currentPassword !== 'manager123' && 
      passwordForm.value.currentPassword !== 'employee123') {
    toastStore.error('Current password is incorrect')
    return
  }
  
  toastStore.success('Password changed successfully!')
  cancelPasswordChange()
}
</script>

<template>
  <DashboardLayout>
    <div class="p-4 max-w-4xl mx-auto space-y-4">
      
      <!-- Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <h1 class="text-xl md:text-2xl font-bold text-neutral-800">
          My Account
        </h1>
        <p class="text-xs md:text-sm text-neutral-600 mt-1">
          Manage your profile information
        </p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <!-- Avatar & Role -->
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
        <div class="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {{ avatarInitials }}
        </div>
        <div class="flex-1 min-w-0">
            <h2 class="text-xl md:text-2xl font-bold text-neutral-800 truncate">{{ authStore.user?.name }}</h2>
            <div class="flex items-center gap-2 mt-1">
            <span 
                :class="[
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize',
                getRoleBadgeColor(authStore.user?.role || '')
                ]"
            >
                <ShieldCheckIcon class="w-3 h-3" />
                {{ authStore.user?.role }}
            </span>
            </div>
        </div>
        
        <!-- Edit/Save Buttons - Responsive -->
        <div v-if="!isEditing" class="flex-shrink-0">
            <!-- Desktop: Full button -->
            <button
            @click="startEdit"
            class="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm transition-colors"
            >
            <PencilIcon class="w-4 h-4" />
            Edit Profile
            </button>
            <!-- Mobile: Icon only -->
            <button
            @click="startEdit"
            class="flex md:hidden items-center justify-center w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
            title="Edit Profile"
            >
            <PencilIcon class="w-5 h-5" />
            </button>
        </div>
        
        <!-- Save/Cancel - Responsive -->
        <div v-else class="flex gap-2 flex-shrink-0">
            <!-- Desktop: Side by side -->
            <div class="hidden md:flex gap-2">
            <button
                @click="saveChanges"
                class="flex items-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-full text-sm transition-colors"
            >
                <CheckIcon class="w-4 h-4" />
                Save
            </button>
            <button
                @click="cancelEdit"
                class="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm transition-colors"
            >
                <XMarkIcon class="w-4 h-4" />
                Cancel
            </button>
            </div>
            
            <!-- Mobile: Icons only -->
            <div class="flex md:hidden gap-2">
            <button
                @click="saveChanges"
                class="flex items-center justify-center w-10 h-10 bg-accent-500 hover:bg-accent-600 text-white rounded-full transition-colors"
                title="Save"
            >
                <CheckIcon class="w-5 h-5" />
            </button>
            <button
                @click="cancelEdit"
                class="flex items-center justify-center w-10 h-10 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
                title="Cancel"
            >
                <XMarkIcon class="w-5 h-5" />
            </button>
            </div>
        </div>
        </div>

        <!-- Profile Info -->
        <div class="space-y-6">
          <!-- Name -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-neutral-600 mb-2">
              <UserCircleIcon class="w-4 h-4" />
              Full Name
            </label>
            <input
              v-if="isEditing"
              v-model="formData.name"
              type="text"
              class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
            <div v-else class="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800">
              {{ authStore.user?.name }}
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-neutral-600 mb-2">
              <EnvelopeIcon class="w-4 h-4" />
              Email Address
            </label>
            <input
              v-if="isEditing"
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
            <div v-else class="px-4 py-3 bg-neutral-50 rounded-xl text-neutral-800">
              {{ authStore.user?.email }}
            </div>
          </div>

          <!-- Role (Read-only) -->
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-neutral-600 mb-2">
              <ShieldCheckIcon class="w-4 h-4" />
              Role
            </label>
            <div class="px-4 py-3 bg-neutral-100 rounded-xl text-neutral-500 capitalize">
              {{ authStore.user?.role }} (Cannot be changed)
            </div>
          </div>

          <!-- Password Section -->
          <div class="pt-4 border-t border-neutral-200">
            <div v-if="!isChangingPassword">
              <label class="flex items-center gap-2 text-sm font-medium text-neutral-600 mb-2">
                <LockClosedIcon class="w-4 h-4" />
                Password
              </label>
              <div class="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-xl">
                <span class="text-neutral-400">••••••••••</span>
                <button
                  @click="startPasswordChange"
                  :disabled="isEditing"
                  :class="[
                    'text-sm font-medium transition-colors',
                    isEditing 
                      ? 'text-neutral-400 cursor-not-allowed' 
                      : 'text-primary-600 hover:text-primary-700'
                  ]"
                >
                  Change Password
                </button>
              </div>
            </div>

            <!-- Change Password Form -->
            <div v-else class="space-y-4">
              <div class="flex items-center justify-between mb-3">
                <label class="flex items-center gap-2 text-sm font-medium text-neutral-600">
                  <LockClosedIcon class="w-4 h-4" />
                  Change Password
                </label>
                <button
                  @click="cancelPasswordChange"
                  class="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Cancel
                </button>
              </div>

              <!-- Current Password -->
              <div>
                <label class="text-xs text-neutral-600 mb-1 block">Current Password</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.currentPassword"
                    :type="showPasswords.current ? 'text' : 'password'"
                    placeholder="Enter current password"
                    class="w-full px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    @click="showPasswords.current = !showPasswords.current"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <EyeIcon v-if="!showPasswords.current" class="w-4 h-4" />
                    <EyeSlashIcon v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- New Password -->
              <div>
                <label class="text-xs text-neutral-600 mb-1 block">New Password</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.newPassword"
                    :type="showPasswords.new ? 'text' : 'password'"
                    placeholder="Enter new password (min. 6 characters)"
                    class="w-full px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    @click="showPasswords.new = !showPasswords.new"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <EyeIcon v-if="!showPasswords.new" class="w-4 h-4" />
                    <EyeSlashIcon v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="text-xs text-neutral-600 mb-1 block">Confirm New Password</label>
                <div class="relative">
                  <input
                    v-model="passwordForm.confirmPassword"
                    :type="showPasswords.confirm ? 'text' : 'password'"
                    placeholder="Re-enter new password"
                    class="w-full px-4 py-2.5 pr-10 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
                  />
                  <button
                    type="button"
                    @click="showPasswords.confirm = !showPasswords.confirm"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <EyeIcon v-if="!showPasswords.confirm" class="w-4 h-4" />
                    <EyeSlashIcon v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                @click="changePassword"
                class="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-colors"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Note -->
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div class="flex gap-3">
          <div class="text-blue-600 text-sm">
            ℹ️
          </div>
          <div class="text-sm text-blue-800">
            <strong>Note:</strong> Your role is assigned by system administrators and cannot be changed from here.
            Contact your admin if you need role modifications.
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>