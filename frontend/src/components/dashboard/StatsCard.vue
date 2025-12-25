<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: any
  trend?: number // Percentage change (positive or negative)
}

defineProps<Props>()
</script>

<template>
  <div class="bg-card rounded-3xl p-6 shadow-soft hover:shadow-premium transition-all">
    <!-- Icon and Trend -->
    <div class="flex items-start justify-between mb-4">
      <!-- Icon -->
      <div class="p-3 bg-primary-100 rounded-2xl">
        <component :is="icon" class="w-6 h-6 text-primary-500" />
      </div>

      <!-- Trend Badge -->
      <div
        v-if="trend !== undefined"
        :class="[
          'px-2 py-1 rounded-full text-xs font-medium',
          trend > 0 ? 'bg-accent-100 text-accent-600' : 'bg-neutral-200 text-neutral-600'
        ]"
      >
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </div>
    </div>

    <!-- Value -->
    <div class="text-3xl font-bold text-neutral-800 mb-1">
      {{ value }}
    </div>

    <!-- Title -->
    <div class="text-sm text-neutral-600">
      {{ title }}
    </div>
  </div>
</template>