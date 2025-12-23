<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
const authStore = useAuthStore()

// Get initials from name
const userInitials = () => {
  const name = authStore.user?.name || 'User'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="bg-white border-b border-neutral-200 px-8 py-6 flex items-center justify-between">
    <!-- Title Section -->
    <div>
      <h1 class="text-2xl font-bold text-neutral-800">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">{{ subtitle }}</p>
    </div>

    <!-- User Avatar -->
    <div class="flex items-center gap-3">
      <div class="text-right">
        <div class="text-sm font-medium text-neutral-800">{{ authStore.user?.name }}</div>
        <div class="text-xs text-neutral-500">{{ authStore.user?.role }}</div>
      </div>
      <div class="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
        <span class="text-white font-semibold text-sm">{{ userInitials() }}</span>
      </div>
    </div>
  </div>
</template>