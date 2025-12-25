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
  <div class="  px-6 py-4 flex items-center justify-between">
    <!-- Title Section -->
    <div>
      <h1 class="text-2xl font-bold text-neutral-800">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>