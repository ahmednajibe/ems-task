<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>

<template>
  <div class="flex h-screen bg-neutral-100">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content Area -->
    <main class="flex-1 overflow-y-auto scrollbar-hide">
      <slot />
    </main>
  </div>
</template>