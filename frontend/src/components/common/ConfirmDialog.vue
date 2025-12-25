<script setup lang="ts">
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'danger'
})

const emit = defineEmits<Emits>()

const typeConfig = {
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-600 hover:bg-red-700',
    buttonText: 'text-white'
  },
  warning: {
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
    buttonText: 'text-white'
  },
  info: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    buttonText: 'text-white'
  }
}

const config = typeConfig[props.type]
</script>

<template>
  <Transition name="modal">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="emit('cancel')"
    >
      <div class="bg-white rounded-3xl shadow-premium w-full max-w-md">
        <!-- Header -->
        <div class="p-6 border-b border-neutral-200">
          <div class="flex items-start gap-4">
            <!-- Icon -->
            <div :class="['p-3 rounded-xl', config.iconBg]">
              <ExclamationTriangleIcon :class="['w-6 h-6', config.iconColor]" />
            </div>
            
            <!-- Content -->
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-neutral-800">{{ title }}</h2>
              <p class="text-sm text-neutral-600 mt-1">{{ message }}</p>
            </div>

            <!-- Close Button -->
            <button
              @click="emit('cancel')"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <XMarkIcon class="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-6 flex gap-3">
          <button
            @click="emit('cancel')"
            class="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-full transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="emit('confirm')"
            :class="['flex-1 px-4 py-2.5 font-medium rounded-full transition-colors shadow-soft', config.buttonBg, config.buttonText]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>