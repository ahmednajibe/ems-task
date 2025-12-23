import { defineStore } from 'pinia'
import { ref } from 'vue'

// Toast types (أنواع الرسائل)
export type ToastType = 'success' | 'error' | 'warning' | 'info'

// Toast interface (شكل الرسالة)
export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  // State: قائمة الرسائل النشطة
  const toasts = ref<Toast[]>([])

  // Add toast (إضافة رسالة)
  function addToast(type: ToastType, message: string, duration = 3000) {
    const id = Date.now().toString() + Math.random()
    
    const toast: Toast = {
      id,
      type,
      message,
      duration
    }

    toasts.value.push(toast)

    // Auto-remove after duration (حذف تلقائي)
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  // Remove toast (حذف رسالة)
  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Shorthand methods (اختصارات)
  function success(message: string, duration?: number) {
    return addToast('success', message, duration)
  }

  function error(message: string, duration?: number) {
    return addToast('error', message, duration)
  }

  function warning(message: string, duration?: number) {
    return addToast('warning', message, duration)
  }

  function info(message: string, duration?: number) {
    return addToast('info', message, duration)
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
})