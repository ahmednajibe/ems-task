<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDepartmentsStore } from '@/store/departments'
import { useCompaniesStore } from '@/store/companies'
import { useEmployeesStore } from '@/store/employees'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. STORES & ROUTER
// ==========================================
const route = useRoute()
const router = useRouter()
const departmentsStore = useDepartmentsStore()
const companiesStore = useCompaniesStore()
const employeesStore = useEmployeesStore()
const toastStore = useToastStore()

// ==========================================
// 2. COMPUTED - DEPARTMENT DATA
// ==========================================
const departmentId = computed(() => route.params.id as string)
const department = computed(() => departmentsStore.getDepartmentById(departmentId.value))
const company = computed(() => 
  department.value ? companiesStore.getCompanyById(department.value.companyId) : null
)

// Redirect if not found
if (!department.value) {
  toastStore.error('Department not found')
  router.push('/departments')
}

// ==========================================
// 3. COMPUTED - FILTERED DATA
// ==========================================
const departmentEmployees = computed(() => {
  if (!department.value) return []
  return employeesStore.getEmployeesByDepartment(department.value.id)
})

// ==========================================
// 4. REACTIVE STATE
// ==========================================
const isConfirmOpen = ref(false)
const isEmployeeDeleteOpen = ref(false)
const employeeToDelete = ref<any>(null)

// ==========================================
// 5. DEPARTMENT ACTIONS
// ==========================================
const handleEdit = () => {
  toastStore.info('Edit department name - Coming soon!')
}

const handleDelete = () => {
  isConfirmOpen.value = true
}

const confirmDelete = () => {
  if (!department.value) return
  
  departmentsStore.deleteDepartment(department.value.id)
  toastStore.success(`${department.value.name} deleted successfully`)
  router.push('/departments')
}

const cancelDelete = () => {
  isConfirmOpen.value = false
}

const handleBack = () => {
  router.push('/departments')
}

// ==========================================
// 6. EMPLOYEE ACTIONS
// ==========================================
const handleAddEmployee = () => {
  if (!department.value || !company.value) return
  router.push(`/employees/create?companyId=${company.value.id}&departmentId=${department.value.id}`)
}

const handleViewEmployee = (id: string) => {
  router.push(`/employees/${id}`)
}

const handleEditEmployee = (id: string) => {
  router.push(`/employees/${id}/edit`)
}

const handleDeleteEmployee = (id: string) => {
  const employee = employeesStore.getEmployeeById(id)
  if (!employee) return
  
  employeeToDelete.value = employee
  isEmployeeDeleteOpen.value = true
}

const confirmDeleteEmployee = () => {
  if (!employeeToDelete.value) return
  
  employeesStore.deleteEmployee(employeeToDelete.value.id)
  toastStore.success(`${employeeToDelete.value.name} deleted successfully`)
  
  isEmployeeDeleteOpen.value = false
  employeeToDelete.value = null
}

const cancelDeleteEmployee = () => {
  isEmployeeDeleteOpen.value = false
  employeeToDelete.value = null
}
</script>

<template>
  <DashboardLayout>
    <div v-if="department" class="p-4 space-y-4">
      
      <!-- Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-neutral-500 mb-3">
          <button @click="handleBack" class="hover:text-primary-500 transition-colors">
            Departments
          </button>
          <span>›</span>
          <span class="text-neutral-800 font-medium">{{ department.name }}</span>
        </div>

        <!-- Title & Actions -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl md:text-2xl font-bold text-neutral-800 break-words">
              {{ department.name }} Details
            </h1>
            <p class="text-xs md:text-sm text-neutral-600 mt-1">
              View and manage department information
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <!-- Edit Button -->
            <button
              @click="handleEdit"
              class="hidden sm:flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg md:rounded-full transition-colors text-sm whitespace-nowrap"
            >
              <PencilIcon class="w-4 h-4" />
              <span>Edit</span>
            </button>
            
            <!-- Delete Button -->
            <button
              @click="handleDelete"
              class="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg md:rounded-full transition-colors text-sm whitespace-nowrap"
            >
              <TrashIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Card -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cyan-100 rounded-xl">
            <UsersIcon class="w-8 h-8 text-cyan-600" />
          </div>
          <div>
            <div class="text-sm text-neutral-600">Total Employees</div>
            <div class="text-3xl font-bold text-neutral-800">{{ departmentEmployees.length }}</div>
          </div>
        </div>
      </div>

      <!-- Department Info -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">Department Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-neutral-600">Department Name</div>
            <div class="text-base font-medium text-neutral-800 mt-1">{{ department.name }}</div>
          </div>
          <div>
            <div class="text-sm text-neutral-600">Company</div>
            <div class="text-base font-medium text-neutral-800 mt-1">
              {{ company?.name || 'Unknown' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Employees Section -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-800">
            👥 Employees ({{ departmentEmployees.length }})
          </h2>
          <button
            @click="handleAddEmployee"
            class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
            Add Employee
          </button>
        </div>

        <!-- Employees List -->
        <div v-if="departmentEmployees.length > 0" class="space-y-2">
          <div
            v-for="employee in departmentEmployees"
            :key="employee.id"
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-neutral-800 truncate">{{ employee.name }}</div>
              <div class="text-sm text-neutral-500 truncate">
                {{ employee.designation || 'No position' }} • {{ employee.email }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="handleViewEmployee(employee.id)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="View Employee"
              >
                <EyeIcon class="w-4 h-4 text-neutral-600" />
              </button>
              <button
                @click="handleEditEmployee(employee.id)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="Edit Employee"
              >
                <PencilIcon class="w-4 h-4 text-neutral-600" />
              </button>
              <button
                @click="handleDeleteEmployee(employee.id)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="Delete Employee"
              >
                <TrashIcon class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-neutral-50 rounded-xl">
          <UsersIcon class="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p class="text-neutral-500">No employees in this department yet</p>
          <button
            @click="handleAddEmployee"
            class="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Add your first employee
          </button>
        </div>
      </div>
    </div>

    <!-- Modals & Dialogs -->
    <ConfirmDialog
      v-if="department"
      :is-open="isConfirmOpen"
      title="Delete Department"
      :message="`Are you sure you want to delete ${department.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <ConfirmDialog
      :is-open="isEmployeeDeleteOpen"
      title="Delete Employee"
      :message="employeeToDelete ? `Are you sure you want to delete ${employeeToDelete.name}? This action cannot be undone.` : ''"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDeleteEmployee"
      @cancel="cancelDeleteEmployee"
    />
  </DashboardLayout>
</template>