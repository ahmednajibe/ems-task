<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Company } from '@/store/companies'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  company?: Company | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', company: Omit<Company, 'id'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Form data
const formData = ref({
  name: '',
  departmentCount: 0,
  employeeCount: 0
})

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    departmentCount: 0,
    employeeCount: 0
  }
}

// Watch for company prop changes
watch(() => props.company, (company) => {
  if (company) {
    formData.value = {
      name: company.name,
      departmentCount: company.departmentCount,
      employeeCount: company.employeeCount
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!formData.value.name) {
    return
  }
  
  emit('save', formData.value)
  resetForm()
}

const handleClose = () => {
  emit('close')
  resetForm()
}
</script>

<template>
  <!-- Modal Overlay -->
  <Transition name="modal">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="handleClose"
    >
      <!-- Modal Content -->
      <div class="bg-card rounded-3xl shadow-premium w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 class="text-xl font-semibold text-neutral-800">
            {{ company ? 'Edit Company' : 'Add New Company' }}
          </h2>
          <button
            @click="handleClose"
            class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <XMarkIcon class="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <!-- Company Name -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Company Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="e.g. Acme Corp"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <!-- Department Count -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Number of Departments
            </label>
            <input
              v-model.number="formData.departmentCount"
              type="number"
              min="0"
              placeholder="e.g. 5"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <!-- Employee Count -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Number of Employees
            </label>
            <input
              v-model.number="formData.employeeCount"
              type="number"
              min="0"
              placeholder="e.g. 124"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="handleClose"
              class="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-colors shadow-soft"
            >
              {{ company ? 'Update' : 'Add Company' }}
            </button>
          </div>
        </form>
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

.modal-enter-active .bg-card,
.modal-leave-active .bg-card {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-card,
.modal-leave-to .bg-card {
  transform: scale(0.95);
}
</style>