<script setup lang="ts">
import {
  BuildingOfficeIcon,
  UserPlusIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="bg-white rounded-3xl p-6 shadow-premium">
    <h2 class="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Add Company -->
      <button class="flex items-center gap-3 px-6 py-4 bg-white shadow-soft hover:shadow-medium rounded-full transition-all text-left border border-neutral-100">
        <BuildingOfficeIcon class="w-6 h-6 text-neutral-600" />
        <span class="text-sm font-medium text-neutral-700">Add Company</span>
      </button>

      <!-- Add Employee -->
      <button class="flex items-center gap-3 px-6 py-4 bg-white shadow-soft hover:shadow-medium rounded-full transition-all text-left border border-neutral-100">
        <UserPlusIcon class="w-6 h-6 text-neutral-600" />
        <span class="text-sm font-medium text-neutral-700">Add Employee</span>
      </button>

      <!-- Export Report -->
      <button class="flex items-center gap-3 px-6 py-4 bg-white shadow-soft hover:shadow-medium rounded-full transition-all text-left border border-neutral-100">
        <ArrowDownTrayIcon class="w-6 h-6 text-neutral-600" />
        <span class="text-sm font-medium text-neutral-700">Export Report</span>
      </button>
    </div>
  </div>
</template>