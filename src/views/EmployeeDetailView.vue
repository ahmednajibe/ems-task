<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeesStore } from '@/store/employees'
import { useCompaniesStore } from '@/store/companies'
import { useDepartmentsStore } from '@/store/departments'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { EmployeeStatus } from '@/store/employees'
import { useAuthStore } from '@/store/auth'
import {
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
//   BriefcaseIcon,
//   CalendarIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const employeesStore = useEmployeesStore()
const companiesStore = useCompaniesStore()
const departmentsStore = useDepartmentsStore()
const toastStore = useToastStore()
const authStore = useAuthStore()

const employeeId = computed(() => route.params.id as string)
const employee = computed(() => employeesStore.getEmployeeById(employeeId.value))
const company = computed(() => 
  employee.value ? companiesStore.getCompanyById(employee.value.companyId) : null
)
const department = computed(() => 
  employee.value ? departmentsStore.getDepartmentById(employee.value.departmentId) : null
)

const daysEmployed = computed(() => 
  employee.value ? employeesStore.getDaysEmployed(employee.value) : 0
)

if (!employee.value) {
  toastStore.error('Employee not found')
  router.push('/employees')
}

const isConfirmOpen = ref(false)

// Status badge config
const getStatusConfig = (status: EmployeeStatus) => {
  const config: Record<EmployeeStatus, { bg: string; text: string; dot: string }> = {
    'Hired': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Interview Scheduled': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'Application Received': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Not Accepted': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' }
  }
  return config[status]
}

const handleEdit = () => {
  router.push(`/employees/${employeeId.value}/edit`)
}

const handleDelete = () => {
  isConfirmOpen.value = true
}

const confirmDelete = () => {
  if (!employee.value) return
  
  employeesStore.deleteEmployee(employee.value.id)
  toastStore.success(`${employee.value.name} deleted successfully`)
  router.push('/employees')
}

const cancelDelete = () => {
  isConfirmOpen.value = false
}

const handleBack = () => {
  router.push('/employees')
}
</script>

<template>
  <DashboardLayout>
    <div v-if="employee" class="p-4 space-y-4">
      
      <!-- Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <button @click="handleBack" class="hover:text-primary-500 transition-colors">
            Employees
          </button>
          <span>›</span>
          <span class="text-neutral-800 font-medium">{{ employee.name }}</span>
        </div>

        <!-- Title & Actions -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl md:text-2xl font-bold text-neutral-800 break-words">
              {{ employee.name }}
            </h1>
            <p class="text-xs md:text-sm text-neutral-600 mt-1">
              {{ employee.designation || 'Employee' }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button
              v-if="authStore.userRole !== 'employee'"
              @click="handleEdit"
              class="flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg md:rounded-full transition-colors text-sm whitespace-nowrap"
            >
              <PencilIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Edit</span>
            </button>
            
            <button
              v-if="authStore.userRole === 'admin'"
              @click="handleDelete"
              class="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg md:rounded-full transition-colors text-sm whitespace-nowrap"
            >
              <TrashIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Status & Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status -->
        <div class="bg-white shadow-soft rounded-2xl p-6">
          <div class="text-sm text-neutral-600 mb-2">Status</div>
          <span 
            :class="[
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
              getStatusConfig(employee.status).bg,
              getStatusConfig(employee.status).text
            ]"
          >
            <span :class="['w-2 h-2 rounded-full', getStatusConfig(employee.status).dot]"></span>
            {{ employee.status }}
          </span>
        </div>

        <!-- Hired On (if hired) -->
        <div v-if="employee.status === 'Hired' && employee.hiredOn" class="bg-white shadow-soft rounded-2xl p-6">
          <div class="text-sm text-neutral-600 mb-1">Hired On</div>
          <div class="text-lg font-semibold text-neutral-800">
            {{ new Date(employee.hiredOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </div>
        </div>

        <!-- Days Employed (if hired) -->
        <div v-if="employee.status === 'Hired'" class="bg-white shadow-soft rounded-2xl p-6">
          <div class="text-sm text-neutral-600 mb-1">Days Employed</div>
          <div class="text-lg font-semibold text-neutral-800">{{ daysEmployed }} days</div>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">Contact Information</h2>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <EnvelopeIcon class="w-5 h-5 text-neutral-400" />
            <div>
              <div class="text-sm text-neutral-500">Email</div>
              <div class="font-medium text-neutral-800">{{ employee.email }}</div>
            </div>
          </div>
          <div v-if="employee.mobile" class="flex items-center gap-3">
            <PhoneIcon class="w-5 h-5 text-neutral-400" />
            <div>
              <div class="text-sm text-neutral-500">Mobile</div>
              <div class="font-medium text-neutral-800">{{ employee.mobile }}</div>
            </div>
          </div>
          <div v-if="employee.address" class="flex items-start gap-3">
            <MapPinIcon class="w-5 h-5 text-neutral-400 mt-0.5" />
            <div>
              <div class="text-sm text-neutral-500">Address</div>
              <div class="font-medium text-neutral-800">{{ employee.address }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Organization Info -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">Organization</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-neutral-600">Company</div>
            <div class="text-base font-medium text-neutral-800 mt-1">{{ company?.name || 'Unknown' }}</div>
          </div>
          <div>
            <div class="text-sm text-neutral-600">Department</div>
            <div class="text-base font-medium text-neutral-800 mt-1">{{ department?.name || 'Unknown' }}</div>
          </div>
          <div v-if="employee.designation">
            <div class="text-sm text-neutral-600">Position</div>
            <div class="text-base font-medium text-neutral-800 mt-1">{{ employee.designation }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      v-if="employee"
      :is-open="isConfirmOpen"
      title="Delete Employee"
      :message="`Are you sure you want to delete ${employee.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </DashboardLayout>
</template>