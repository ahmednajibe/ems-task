<script setup lang="ts">
import type { Department } from '@/store/departments'
import { useCompaniesStore } from '@/store/companies'
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  departments: Department[]
  userRole?: string | null
}

interface Emits {
  (e: 'view', id: string): void
  (e: 'edit', department: Department): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const companiesStore = useCompaniesStore()

// Get company name by ID
const getCompanyName = (companyId: string) => {
  const company = companiesStore.getCompanyById(companyId)
  return company?.name || 'Unknown Company'
}

// Avatar colors
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-cyan-100 text-cyan-700',
    'bg-pink-100 text-pink-700',
    'bg-blue-100 text-blue-700',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="bg-white shadow-soft rounded-t-2xl overflow-hidden">
    
    <!-- Desktop Table -->
    <div class="hidden md:block">
      <!-- Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200">
        <div class="col-span-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Department Name
        </div>
        <div class="col-span-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Company
        </div>
        <div class="col-span-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Employees
        </div>
        <div class="col-span-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Actions
        </div>
      </div>

      <!-- Body -->
      <div class="divide-y divide-neutral-200">
        <div
          v-for="department in departments"
          :key="department.id"
          class="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-neutral-50 transition-colors"
        >
          <!-- Department Name -->
          <div class="col-span-4 flex items-center gap-3">
            <div 
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm',
                getAvatarColor(department.name)
              ]"
            >
              {{ getInitials(department.name) }}
            </div>
            <div class="font-semibold text-neutral-900">{{ department.name }}</div>
          </div>

          <!-- Company -->
          <div class="col-span-3 flex items-center">
            <span class="text-neutral-700">{{ getCompanyName(department.companyId) }}</span>
          </div>

          <!-- Employees -->
          <div class="col-span-3 flex items-center">
            <span class="text-neutral-700">{{ department.employeeCount }}</span>
          </div>

          <!-- Actions -->
          <div class="col-span-2 flex items-center gap-3">
            <button
              @click="emit('view', department.id)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="View"
            >
              <EyeIcon class="w-5 h-5 text-neutral-500" />
            </button>
            <button
              v-if="userRole !== 'employee'"
              @click="emit('edit', department)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Edit"
            >
              <PencilIcon class="w-5 h-5 text-neutral-500" />
            </button>
            <button
              v-if="userRole === 'admin'"
              @click="emit('delete', department.id)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Delete"
            >
              <TrashIcon class="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden divide-y divide-neutral-200">
      <div
        v-for="department in departments"
        :key="department.id"
        class="p-4 hover:bg-neutral-50 transition-colors"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-3">
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0',
              getAvatarColor(department.name)
            ]"
          >
            {{ getInitials(department.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-neutral-900 truncate">{{ department.name }}</div>
            <div class="text-sm text-neutral-500 truncate">{{ getCompanyName(department.companyId) }}</div>
          </div>
        </div>

        <!-- Stats -->
        <div class="bg-neutral-50 rounded-lg p-3 mb-3">
          <div class="text-xs text-neutral-500">Employees</div>
          <div class="text-lg font-semibold text-neutral-800">{{ department.employeeCount }}</div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="emit('view', department.id)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors text-sm"
          >
            <EyeIcon class="w-4 h-4" />
            View
          </button>
          <button
            v-if="userRole !== 'employee'"
            @click="emit('edit', department)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-sm"
          >
            <PencilIcon class="w-4 h-4" />
            Edit
          </button>
          <button
            v-if="userRole === 'admin'"
            @click="emit('delete', department.id)"
            class="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="departments.length === 0" class="py-12 text-center">
      <p class="text-neutral-400">No departments found</p>
    </div>
  </div>
</template>