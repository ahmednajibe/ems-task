<script setup lang="ts">
import { useToastStore } from '@/store/toast'
import ToastNotification from './ToastNotification.vue'
import { TransitionGroup } from 'vue'

const toastStore = useToastStore()
</script>

<template>
  <!-- Toast Container - Fixed Position -->
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    <TransitionGroup name="toast">
      <ToastNotification
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :toast="toast"
        @close="toastStore.removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Toast animations (تحريكات الرسائل) */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>