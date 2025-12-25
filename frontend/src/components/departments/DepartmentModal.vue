<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Department } from '@/store/departments'
import { useCompaniesStore } from '@/store/companies'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  department?: Department | null
  preselectedCompanyId?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: { name: string; companyId: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const companiesStore = useCompaniesStore()

// Form data
const formData = ref({
  name: '',
  companyId: ''
})

// Reset form
const resetForm = () => {
  formData.value = {
    name: '',
    companyId: ''
  }
}

// Watch for department changes
watch(() => props.department, (department) => {
  if (department) {
    formData.value = {
      name: department.name,
      companyId: department.companyId
    }
  } else {
    formData.value = {
      name: '',
      companyId: props.preselectedCompanyId || ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  if (!formData.value.name.trim() || !formData.value.companyId) {
    return
  }
  
  emit('save', {
    name: formData.value.name.trim(),
    companyId: formData.value.companyId
  })
  resetForm()
}

const handleClose = () => {
  emit('close')
  resetForm()
}
</script>

<template>
  <Transition name="modal">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      @click.self="handleClose"
    >
      <div class="bg-card rounded-3xl shadow-premium w-full max-w-md">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 class="text-xl font-semibold text-neutral-800">
            {{ department ? 'Edit Department' : 'Add New Department' }}
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
          <!-- Company Select -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Company *
            </label>
            <select
              v-model="formData.companyId"
              required
              :disabled="!!preselectedCompanyId"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all disabled:bg-neutral-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a company...</option>
              <option
                v-for="company in companiesStore.companies"
                :key="company.id"
                :value="company.id"
              >
                {{ company.name }}
              </option>
            </select>
          </div>

          <!-- Department Name -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Department Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              placeholder="e.g. Engineering"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <!-- Info -->
          <div v-if="!department" class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <p class="text-xs text-neutral-600">
              💡 Employee count will be calculated automatically as you add employees.
            </p>
          </div>

          <!-- Show current count when editing -->
          <div v-if="department" class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <div class="text-xs text-neutral-500">Employees</div>
            <div class="text-lg font-semibold text-neutral-800">{{ department.employeeCount }}</div>
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
              {{ department ? 'Update' : 'Add Department' }}
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