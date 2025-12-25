<script setup lang="ts">
import { computed } from 'vue'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'
import type { Toast } from '@/store/toast'

interface Props {
  toast: Toast
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// Icon based on type (أيقونة حسب النوع)
const icon = computed(() => {
  switch (props.toast.type) {
    case 'success': return CheckCircleIcon
    case 'error': return XCircleIcon
    case 'warning': return ExclamationTriangleIcon
    case 'info': return InformationCircleIcon
  }
})

// Colors based on type (ألوان حسب النوع)
const colorClasses = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    case 'info':
      return 'bg-blue-50 border-blue-200 text-blue-800'
  }
})

const iconColorClass = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'text-green-500'
    case 'error': return 'text-red-500'
    case 'warning': return 'text-yellow-500'
    case 'info': return 'text-blue-500'
  }
})
</script>

<template>
  <div
    :class="[
      'flex items-start gap-3 p-4 rounded-xl border shadow-medium min-w-[320px] max-w-md',
      colorClasses
    ]"
  >
    <!-- Icon -->
    <component :is="icon" :class="['w-6 h-6 flex-shrink-0', iconColorClass]" />

    <!-- Message -->
    <p class="flex-1 text-sm font-medium">
      {{ toast.message }}
    </p>

    <!-- Close Button -->
    <button
      @click="emit('close')"
      class="flex-shrink-0 hover:opacity-70 transition-opacity"
    >
      <XMarkIcon class="w-5 h-5" />
    </button>
  </div>
</template>