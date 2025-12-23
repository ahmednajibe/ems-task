<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Company } from '@/store/companies'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  company?: Company | null  // null = Add mode, Company = Edit mode
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
  initials: '',
  location: '',
  industry: '',
  employeeCount: 0,
  status: 'active' as Company['status']
})

const resetForm = () => {
  formData.value = {
    name: '',
    initials: '',
    location: '',
    industry: '',
    employeeCount: 0,
    status: 'active'
  }
}

// Watch for company prop changes (when editing)
watch(() => props.company, (company) => {
  if (company) {
    // Edit mode - fill form with existing data
    formData.value = {
      name: company.name,
      initials: company.initials,
      location: company.location,
      industry: company.industry,
      employeeCount: company.employeeCount,
      status: company.status
    }
  } else {
    // Add mode - reset form
    resetForm()
  }
}, { immediate: true })


const handleSubmit = () => {
  // Validation
  if (!formData.value.name || !formData.value.industry) {
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

          <!-- Initials -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Initials *
            </label>
            <input
              v-model="formData.initials"
              type="text"
              required
              maxlength="2"
              placeholder="e.g. AC"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all uppercase"
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Headquarters Location *
            </label>
            <input
              v-model="formData.location"
              type="text"
              required
              placeholder="e.g. San Francisco, CA"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <!-- Industry -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Industry *
            </label>
            <select
              v-model="formData.industry"
              required
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            >
              <option value="">Select industry...</option>
              <option value="Technology">Technology</option>
              <option value="Logistics">Logistics</option>
              <option value="Food Proc.">Food Processing</option>
              <option value="Pharma">Pharmaceutical</option>
              <option value="Defense">Defense</option>
            </select>
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

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Status
            </label>
            <select
              v-model="formData.status"
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
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
/* Modal Animation */
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