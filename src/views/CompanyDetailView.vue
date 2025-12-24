<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompaniesStore } from '@/store/companies'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  BuildingLibraryIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const companiesStore = useCompaniesStore()
const toastStore = useToastStore()

// Get company from route params
const companyId = computed(() => route.params.id as string)
const company = computed(() => companiesStore.getCompanyById(companyId.value))

// If company not found, redirect
if (!company.value) {
  toastStore.error('Company not found')
  router.push('/companies')
}

const handleEdit = () => {
  // TODO: Open edit modal or navigate to edit page
  toastStore.info('Edit functionality - Coming soon!')
}

const handleDelete = () => {
  if (!company.value) return
  
  if (confirm(`Are you sure you want to delete ${company.value.name}?`)) {
    companiesStore.deleteCompany(company.value.id)
    toastStore.success(`${company.value.name} deleted successfully`)
    router.push('/companies')
  }
}

const handleBack = () => {
  router.push('/companies')
}
</script>

<template>
  <DashboardLayout>
    <div v-if="company" class="p-4 space-y-4">
      
      <!-- Breadcrumb & Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <button @click="handleBack" class="hover:text-primary-500 transition-colors">
            Companies
          </button>
          <span>›</span>
          <span class="text-neutral-800 font-medium">{{ company.name }}</span>
        </div>

        <!-- Title & Actions -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-neutral-800">{{ company.name }} Details</h1>
            <p class="text-sm text-neutral-600 mt-1">
              View and manage company information
            </p>
          </div>

          <div class="flex gap-2">
            <button
              @click="handleBack"
              class="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              Back
            </button>
            <button
              @click="handleEdit"
              class="flex items-center gap-2 px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full transition-colors"
            >
              <PencilIcon class="w-4 h-4" />
              Edit
            </button>
            <button
              @click="handleDelete"
              class="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors"
            >
              <TrashIcon class="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Departments Card -->
        <div class="bg-white shadow-soft rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary-100 rounded-xl">
              <BuildingLibraryIcon class="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <div class="text-sm text-neutral-600">Total Departments</div>
              <div class="text-3xl font-bold text-neutral-800">{{ company.departmentCount }}</div>
            </div>
          </div>
        </div>

        <!-- Employees Card -->
        <div class="bg-white shadow-soft rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-cyan-100 rounded-xl">
              <UsersIcon class="w-8 h-8 text-cyan-600" />
            </div>
            <div>
              <div class="text-sm text-neutral-600">Total Employees</div>
              <div class="text-3xl font-bold text-neutral-800">{{ company.employeeCount.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Information -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">Company Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-neutral-600">Company Name</div>
            <div class="text-base font-medium text-neutral-800 mt-1">{{ company.name }}</div>
          </div>
          <div>
            <div class="text-sm text-neutral-600">Company ID</div>
            <div class="text-base font-medium text-neutral-800 mt-1">{{ company.id }}</div>
          </div>
        </div>
      </div>

      <!-- Departments Section (Placeholder) -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-800">
            📚 Departments ({{ company.departmentCount }})
          </h2>
        </div>
        <div class="text-center py-12 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
          <BuildingLibraryIcon class="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p class="text-neutral-500">Departments will be displayed here once added</p>
          <p class="text-sm text-neutral-400 mt-1">Future feature - Coming with backend integration</p>
        </div>
      </div>

      <!-- Employees Section (Placeholder) -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-800">
            👥 Employees ({{ company.employeeCount }})
          </h2>
        </div>
        <div class="text-center py-12 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
          <UsersIcon class="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p class="text-neutral-500">Employees will be displayed here once added</p>
          <p class="text-sm text-neutral-400 mt-1">Future feature - Coming with backend integration</p>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>