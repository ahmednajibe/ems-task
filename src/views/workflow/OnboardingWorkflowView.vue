<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEmployeesStore, type EmployeeStatus } from '@/store/employees'
import { useCompaniesStore } from '@/store/companies'
import { useDepartmentsStore } from '@/store/departments'
import { useToastStore } from '@/store/toast'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import StatusColumn from '@/components/workflow/StatusColumn.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

const employeesStore = useEmployeesStore()
const companiesStore = useCompaniesStore()
const departmentsStore = useDepartmentsStore()
const toastStore = useToastStore()
const authStore = useAuthStore()
const router = useRouter()

// Check permissions
if (authStore.userRole === 'employee') {
  toastStore.error('Access denied')
  router.push('/dashboard')
}

// Status order
const statuses: EmployeeStatus[] = [
  'Application Received',
  'Interview Scheduled',
  'Hired',
  'Not Accepted'
]

// Navigate to add employee
const handleAddEmployee = () => {
  router.push('/employees/create')
}

// Group employees by status
const employeesByStatus = computed(() => {
  const groups: Record<EmployeeStatus, typeof employeesStore.employees> = {
    'Application Received': [],
    'Interview Scheduled': [],
    'Hired': [],
    'Not Accepted': []
  }

  employeesStore.employees.forEach(emp => {
    groups[emp.status].push(emp)
  })

  return groups
})

// Company/Department name lookups
const companyNames = computed(() => {
  const names: Record<string, string> = {}
  companiesStore.companies.forEach(c => {
    names[c.id] = c.name
  })
  return names
})

const departmentNames = computed(() => {
  const names: Record<string, string> = {}
  departmentsStore.departments.forEach(d => {
    names[d.id] = d.name
  })
  return names
})

// Hire dialog state
const showHireDialog = ref(false)
const employeeToHire = ref<string | null>(null)
const hireDate = ref('')

// Confirm dialog state
const showConfirmDialog = ref(false)
const confirmAction = ref<'interview' | 'reject' | null>(null)
const confirmEmployeeId = ref<string | null>(null)

// Actions
const handleScheduleInterview = (id: string) => {
  const employee = employeesStore.getEmployeeById(id)
  if (!employee) return

  confirmAction.value = 'interview'
  confirmEmployeeId.value = id
  showConfirmDialog.value = true
}

const handleHire = (id: string) => {
  employeeToHire.value = id
  hireDate.value = new Date().toISOString().split('T')[0] ?? ''
  showHireDialog.value = true
}

const handleReject = (id: string) => {
  const employee = employeesStore.getEmployeeById(id)
  if (!employee) return

  confirmAction.value = 'reject'
  confirmEmployeeId.value = id
  showConfirmDialog.value = true
}

const confirmScheduleInterview = () => {
  if (!confirmEmployeeId.value) return
  
  const employee = employeesStore.getEmployeeById(confirmEmployeeId.value)
  if (!employee) return

  employeesStore.updateEmployee(confirmEmployeeId.value, {
    status: 'Interview Scheduled'
  })

  toastStore.success(`Interview scheduled for ${employee.name || 'employee'}`)
  showConfirmDialog.value = false
  confirmEmployeeId.value = null
  confirmAction.value = null
}

const confirmReject = () => {
  if (!confirmEmployeeId.value) return
  
  const employee = employeesStore.getEmployeeById(confirmEmployeeId.value)
  if (!employee) return

  employeesStore.updateEmployee(confirmEmployeeId.value, {
    status: 'Not Accepted'
  })

  toastStore.info(`${employee.name} marked as not accepted`)
  showConfirmDialog.value = false
  confirmEmployeeId.value = null
  confirmAction.value = null
}

const confirmHire = () => {
  if (!employeeToHire.value || !hireDate.value) return

  const employee = employeesStore.getEmployeeById(employeeToHire.value)
  if (!employee) return

  employeesStore.updateEmployee(employeeToHire.value, {
    status: 'Hired',
    hiredOn: hireDate.value
  })

  toastStore.success(`${employee.name} hired successfully! 🎉`)
  showHireDialog.value = false
  employeeToHire.value = null
  hireDate.value = ''
}

const cancelDialog = () => {
  showConfirmDialog.value = false
  showHireDialog.value = false
  confirmEmployeeId.value = null
  confirmAction.value = null
  employeeToHire.value = null
  hireDate.value = ''
}

// Confirm dialog text
const confirmDialogData = computed(() => {
  if (!confirmEmployeeId.value || !confirmAction.value) return null

  const employee = employeesStore.getEmployeeById(confirmEmployeeId.value)
  if (!employee) return null

  if (confirmAction.value === 'interview') {
    return {
      title: 'Schedule Interview',
      message: `Schedule an interview for ${employee.name}?`,
      confirmText: 'Schedule',
      type: 'primary'
    }
  } else {
    return {
      title: 'Reject Candidate',
      message: `Mark ${employee.name} as not accepted?`,
      confirmText: 'Reject',
      type: 'danger'
    }
  }
})

const hireEmployeeName = computed(() => {
  if (!employeeToHire.value) return ''
  const employee = employeesStore.getEmployeeById(employeeToHire.value)
  return employee?.name || ''
})
</script>

<template>
  <DashboardLayout>
    <div class="p-4 flex flex-col h-full">
      <!-- Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-neutral-800">Employee Onboarding Workflow</h1>
            <p class="text-xs md:text-sm text-neutral-600 mt-1">
              Manage candidate progression through hiring stages
            </p>
          </div>
          
          <!-- Add Employee Button -->
          <button
            @click="handleAddEmployee"
            class="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full shadow-soft transition-colors text-sm md:text-base min-w-[44px]"
          >
            <PlusIcon class="w-5 h-5" />
            <span class="hidden md:inline">Add Employee</span>
          </button>
        </div>
      </div>

      <!-- Kanban Board - Takes remaining space -->
      <div class="flex-1 flex items-center">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full h-full">
          <StatusColumn
          v-for="status in statuses"
          :key="status"
          :status="status"
          :employees="employeesByStatus[status]"
          :company-names="companyNames"
          :department-names="departmentNames"
          @schedule-interview="handleScheduleInterview"
          @hire="handleHire"
          @reject="handleReject"
        />
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <Teleport to="body">
      <div
        v-if="showConfirmDialog && confirmDialogData"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="cancelDialog"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
          <h3 class="text-lg font-semibold text-neutral-800">{{ confirmDialogData.title }}</h3>
          <p class="text-neutral-600">{{ confirmDialogData.message }}</p>
          
          <div class="flex gap-3">
            <button
              @click="cancelDialog"
              class="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmAction === 'interview' ? confirmScheduleInterview() : confirmReject()"
              :class="[
                'flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors',
                confirmAction === 'interview'
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              ]"
            >
              {{ confirmDialogData.confirmText }}
            </button>
          </div>
        </div>
      </div>

      <!-- Hire Dialog -->
      <div
        v-if="showHireDialog"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="cancelDialog"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
          <h3 class="text-lg font-semibold text-neutral-800">Hire Employee</h3>
          <p class="text-neutral-600">Enter hire date for <strong>{{ hireEmployeeName }}</strong></p>
          
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-2">
              Hire Date *
            </label>
            <input
              v-model="hireDate"
              type="date"
              required
              class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div class="flex gap-3">
            <button
              @click="cancelDialog"
              class="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="confirmHire"
              :disabled="!hireDate"
              class="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Hire
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </DashboardLayout>
</template>
