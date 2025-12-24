<script setup lang="ts">
import type { Employee } from '@/store/employees'
import { useCompaniesStore } from '@/store/companies'
import { useDepartmentsStore } from '@/store/departments'
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  employees: Employee[]
}

interface Emits {
  (e: 'view', id: string): void
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const companiesStore = useCompaniesStore()
const departmentsStore = useDepartmentsStore()

// Get company name
const getCompanyName = (companyId: string) => {
  return companiesStore.getCompanyById(companyId)?.name || 'Unknown'
}

// Get department name
const getDepartmentName = (departmentId: string) => {
  return departmentsStore.getDepartmentById(departmentId)?.name || 'Unknown'
}

// Status badge config
const getStatusConfig = (status: Employee['status']) => {
  const config = {
    'Hired': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Interview Scheduled': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'Application Received': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Not Accepted': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
  }
  return config[status]
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
    <div class="hidden lg:block">
      <!-- Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200">
        <div class="col-span-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Employee
        </div>
        <div class="col-span-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Organization
        </div>
        <div class="col-span-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Position
        </div>
        <div class="col-span-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Status
        </div>
        <div class="col-span-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Actions
        </div>
      </div>

      <!-- Body -->
      <div class="divide-y divide-neutral-200">
        <div
          v-for="employee in employees"
          :key="employee.id"
          class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors"
        >
          <!-- Employee Name & Email -->
          <div class="col-span-4 flex items-center gap-3">
            <div 
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0',
                getAvatarColor(employee.name)
              ]"
            >
              {{ getInitials(employee.name) }}
            </div>
            <div class="min-w-0">
              <div class="font-semibold text-neutral-900 truncate">{{ employee.name }}</div>
              <div class="text-sm text-neutral-500 truncate">{{ employee.email }}</div>
            </div>
          </div>

          <!-- Organization (Company / Department) -->
          <div class="col-span-3 flex items-start py-1">
            <div class="min-w-0">
              <div class="text-neutral-800 font-medium truncate">{{ getCompanyName(employee.companyId) }}</div>
              <div class="text-sm text-neutral-500 truncate">{{ getDepartmentName(employee.departmentId) }}</div>
            </div>
          </div>

          <!-- Position -->
          <div class="col-span-2 flex items-center">
            <span class="text-neutral-700 truncate">{{ employee.designation || '-' }}</span>
          </div>

          <!-- Status -->
          <div class="col-span-2 flex items-center">
            <span 
              :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                getStatusConfig(employee.status).bg,
                getStatusConfig(employee.status).text
              ]"
            >
              <span :class="['w-1.5 h-1.5 rounded-full', getStatusConfig(employee.status).dot]"></span>
              {{ employee.status }}
            </span>
          </div>

          <!-- Actions -->
          <div class="col-span-1 flex items-center gap-1">
            <button
              @click="emit('view', employee.id)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="View"
            >
              <EyeIcon class="w-4 h-4 text-neutral-500" />
            </button>
            <button
              @click="emit('edit', employee.id)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Edit"
            >
              <PencilIcon class="w-4 h-4 text-neutral-500" />
            </button>
            <button
              @click="emit('delete', employee.id)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Delete"
            >
              <TrashIcon class="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Cards -->
    <div class="lg:hidden divide-y divide-neutral-200">
      <div
        v-for="employee in employees"
        :key="employee.id"
        class="p-4 hover:bg-neutral-50 transition-colors"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-3">
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0',
              getAvatarColor(employee.name)
            ]"
          >
            {{ getInitials(employee.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-neutral-900 truncate">{{ employee.name }}</div>
            <div class="text-sm text-neutral-500 truncate">{{ employee.email }}</div>
          </div>
        </div>

        <!-- Info Grid -->
        <div class="space-y-2 mb-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">Company:</span>
            <span class="text-neutral-800 font-medium">{{ getCompanyName(employee.companyId) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">Department:</span>
            <span class="text-neutral-800 font-medium">{{ getDepartmentName(employee.departmentId) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">Position:</span>
            <span class="text-neutral-800 font-medium truncate ml-2">{{ employee.designation || '-' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">Status:</span>
            <span 
              :class="[
                'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                getStatusConfig(employee.status).bg,
                getStatusConfig(employee.status).text
              ]"
            >
              <span :class="['w-1.5 h-1.5 rounded-full', getStatusConfig(employee.status).dot]"></span>
              {{ employee.status }}
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="emit('view', employee.id)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors text-sm"
          >
            <EyeIcon class="w-4 h-4" />
            View
          </button>
          <button
            @click="emit('edit', employee.id)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-sm"
          >
            <PencilIcon class="w-4 h-4" />
            Edit
          </button>
          <button
            @click="emit('delete', employee.id)"
            class="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="employees.length === 0" class="py-12 text-center">
      <p class="text-neutral-400">No employees found</p>
    </div>
  </div>
</template>