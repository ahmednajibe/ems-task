<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

// Mobile sidebar state
const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="flex h-screen bg-neutral-100">
    
    <!-- Mobile Menu Button -->
    <button 
      @click="toggleSidebar"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-500 text-white rounded-xl shadow-lg"
    >
      <Bars3Icon v-if="!isSidebarOpen" class="w-6 h-6" />
      <XMarkIcon v-else class="w-6 h-6" />
    </button>

    <!-- Mobile Overlay -->
    <div 
      v-if="isSidebarOpen" 
      @click="closeSidebar"
      class="lg:hidden fixed inset-0 bg-black/50 z-30"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed lg:relative z-40 transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <Sidebar />
    </div>
    
    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto scrollbar-hide">
      <slot />
    </main>
  </div>
</template>