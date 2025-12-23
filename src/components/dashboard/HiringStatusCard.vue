<script setup lang="ts">
interface Props {
  label: string
  count: number
  icon: any
  color: 'blue' | 'yellow' | 'green' | 'red'
}

const props = defineProps<Props>()

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  green: 'bg-green-50 text-green-600',
  red: 'bg-red-50 text-red-600'
}
</script>

<template>
  <div class="bg-white rounded-2xl p-4 border border-neutral-200 hover:shadow-md transition-shadow">
    <div class="flex items-center gap-3">
      <!-- Icon -->
      <div :class="['p-2 rounded-xl', colorClasses[color]]">
        <component :is="icon" class="w-5 h-5" />
      </div>
      
      <!-- Content -->
      <div class="flex-1">
        <div class="text-xs text-neutral-600 mb-1">{{ label }}</div>
        <div class="text-2xl font-bold text-neutral-800">{{ count }}</div>
      </div>
    </div>
  </div>
</template>