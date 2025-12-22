<script setup lang="ts">
import { ref } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
// Reactive variables (متغيرات تفاعلية)
const username = ref('')
const password = ref('')
const showPassword = ref(false)

// Handle form submission (معالجة إرسال النموذج)
const handleLogin = () => {
  console.log('Login attempt:', { username: username.value, password: password.value })
  // TODO: سنضيف منطق تسجيل الدخول الحقيقي لاحقاً
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
    <!-- Login Card -->
    <div class="bg-white rounded-5xl shadow-medium p-12 w-full max-w-md">
      
      <!-- Logo/Avatar -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center">
          <span class="text-3xl font-bold text-white">OM</span>
        </div>
      </div>

      <!-- Heading -->
      <h1 class="text-3xl font-bold text-neutral-800 text-center mb-2">
        Welcome Back
      </h1>
      <p class="text-neutral-600 text-center mb-8">
        Enter your credentials to manage your organization.
      </p>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        
        <!-- Username Input -->
        <div>
          <label for="username" class="block text-sm font-medium text-neutral-700 mb-2">
            Email or Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your email"
            class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-neutral-700 mb-2">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              class="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <EyeIcon v-if="!showPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Forgot Password -->
        <div class="text-right">
          <a href="#" class="text-sm text-primary-500 hover:text-primary-600 font-medium">
            Forgot Password?
          </a>
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-full transition-colors shadow-soft"
        >
          Login
        </button>

      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-neutral-500 mt-8">
        OrgManager Platform
      </p>
    </div>
  </div>
</template>

<style scoped>
/* No custom CSS - pure Tailwind! */
</style>