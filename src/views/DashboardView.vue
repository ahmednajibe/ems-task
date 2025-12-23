<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-5xl shadow-medium p-8 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-neutral-800 mb-2">
              Welcome, {{ authStore.user?.name }}!
            </h1>
            <p class="text-neutral-600">
              Role: <span class="font-medium text-primary-500">{{ authStore.user?.role }}</span>
            </p>
          </div>
          <button
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- User Info Card -->
      <div class="bg-white rounded-5xl shadow-medium p-8">
        <h2 class="text-xl font-semibold text-neutral-800 mb-4">User Information</h2>
        <div class="space-y-3">
          <div>
            <span class="text-neutral-600">ID:</span>
            <span class="ml-2 font-medium">{{ authStore.user?.id }}</span>
          </div>
          <div>
            <span class="text-neutral-600">Email:</span>
            <span class="ml-2 font-medium">{{ authStore.user?.email }}</span>
          </div>
          <div>
            <span class="text-neutral-600">Avatar:</span>
            <span class="ml-2 font-medium">{{ authStore.user?.avatar }}</span>
          </div>
          <div>
            <span class="text-neutral-600">Authenticated:</span>
            <span class="ml-2 font-medium text-green-600">{{ authStore.isAuthenticated ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>