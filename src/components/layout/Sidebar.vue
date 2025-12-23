<script setup lang="ts">
// import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { 
  Squares2X2Icon,
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,  
  SparklesIcon  
} from '@heroicons/vue/24/outline'
import { useToastStore } from '@/store/toast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

// Navigation items
const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { path: '/companies', label: 'Company Mgmt', icon: BuildingOfficeIcon },
  { path: '/departments', label: 'Department Mgmt', icon: BuildingLibraryIcon },
  { path: '/employees', label: 'Employee Mgmt', icon: UsersIcon },
  { path: '/settings', label: 'Settings', icon: Cog6ToothIcon },
]

// Check if route is active
const isActive = (path: string) => {
  return route.path === path
}

// Logout handler
const handleLogout = () => {
  authStore.logout()
  toastStore.info('You have been logged out')
  router.push('/login')
}
</script>

<template>
  <aside class="w-64 bg-card h-[calc(100vh-2rem)] flex flex-col m-4 rounded-3xl shadow-premium">
    <!-- Logo Section -->
    <div class="p-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center shadow-medium">
          <SparklesIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-neutral-800">OrgManager</h1>
          <p class="text-xs text-neutral-500">Admin Portal</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
          isActive(item.path)
            ? 'bg-primary-500 text-white shadow-premium'
            : 'text-neutral-600 hover:bg-primary-50'
        ]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-sm font-medium">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Logout Button -->
    <div class="p-4">
      <button
        @click="handleLogout"
        class="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
      >
        <ArrowLeftEndOnRectangleIcon   class="w-5 h-5" />
        <span class="text-sm font-medium">Logout</span>
      </button>
    </div>
  </aside>
</template>