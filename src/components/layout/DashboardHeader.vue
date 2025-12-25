<script setup lang="ts">
// import { useAuthStore } from '@/store/auth'

interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
// const authStore = useAuthStore()

// // Get initials from name
// const userInitials = () => {
//   const name = authStore.user?.name || 'User'
//   return name
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2)
// }
</script>

<template>
  <div class="  px-6 py-4 flex items-center justify-between">
    <!-- Title Section -->
    <div>
      <h1 class="text-2xl font-bold text-neutral-800">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-neutral-600 mt-1">{{ subtitle }}</p>
    </div>

    <!-- User Info -->
    <!-- <div class="p-4 border-neutral-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold text-sm">
          {{ authStore.user?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-neutral-800 truncate">
            {{ authStore.user?.name }}
          </div>
          <div class="text-xs text-neutral-500 capitalize">
            {{ authStore.user?.role }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>