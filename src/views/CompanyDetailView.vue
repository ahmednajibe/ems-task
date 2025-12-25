<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompaniesStore } from '@/store/companies'
import { useDepartmentsStore } from '@/store/departments'
import { useEmployeesStore } from '@/store/employees'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import DepartmentModal from '@/components/departments/DepartmentModal.vue'
import type { Department } from '@/store/departments'
import { useAuthStore } from '@/store/auth'
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  BuildingLibraryIcon,
  UsersIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

// ==========================================
// 1. STORES & ROUTER
// ==========================================
const route = useRoute()
const router = useRouter()
const companiesStore = useCompaniesStore()
const departmentsStore = useDepartmentsStore()
const employeesStore = useEmployeesStore()
const toastStore = useToastStore()
const authStore = useAuthStore()

// ==========================================
// 2. COMPUTED - COMPANY DATA
// ==========================================
const companyId = computed(() => route.params.id as string)
const company = computed(() => companiesStore.getCompanyById(companyId.value))

// Redirect if company not found
if (!company.value) {
  toastStore.error('Company not found')
  router.push('/companies')
}

// ==========================================
// 3. COMPUTED - FILTERED DATA
// ==========================================
const companyDepartments = computed(() => {
  if (!company.value) return []
  return departmentsStore.getDepartmentsByCompany(company.value.id)
})

const companyEmployees = computed(() => {
  if (!company.value) return []
  return employeesStore.getEmployeesByCompany(company.value.id)
})

// ==========================================
// 4. REACTIVE STATE
// ==========================================
const isConfirmOpen = ref(false)
const isDepartmentModalOpen = ref(false)
const editingDepartment = ref<Department | null>(null)
const isDepartmentDeleteOpen = ref(false)
const departmentToDelete = ref<Department | null>(null)
const isEmployeeDeleteOpen = ref(false)
const employeeToDelete = ref<any>(null)

// ==========================================
// 5. COMPANY ACTIONS
// ==========================================
const handleEdit = () => {
  toastStore.info('Edit company name - Coming soon!')
}

const handleDelete = () => {
  if (!company.value) return
  isConfirmOpen.value = true
}

const confirmDelete = () => {
  if (!company.value) return
  
  companiesStore.deleteCompany(company.value.id)
  toastStore.success(`${company.value.name} deleted successfully`)
  router.push('/companies')
}

const cancelDelete = () => {
  isConfirmOpen.value = false
}

const handleBack = () => {
  router.push('/companies')
}

// ==========================================
// 6. DEPARTMENT ACTIONS
// ==========================================
const openAddDepartmentModal = () => {
  editingDepartment.value = null
  isDepartmentModalOpen.value = true
}

const openEditDepartmentModal = (dept: Department) => {
  editingDepartment.value = dept
  isDepartmentModalOpen.value = true
}

const closeDepartmentModal = () => {
  isDepartmentModalOpen.value = false
  editingDepartment.value = null
}

const handleSaveDepartment = (data: { name: string; companyId: string }) => {
  if (editingDepartment.value) {
    // Edit existing department
    departmentsStore.updateDepartment(editingDepartment.value.id, data)
    toastStore.success(`${data.name} updated successfully!`)
  } else {
    // Add new department
    departmentsStore.addDepartment({
      name: data.name,
      companyId: company.value!.id,
      employeeCount: 0
    })
    toastStore.success(`${data.name} added successfully!`)
  }
  closeDepartmentModal()
}

const handleDeleteDepartment = (id: string) => {
  const dept = departmentsStore.getDepartmentById(id)
  if (!dept) return
  
  departmentToDelete.value = dept
  isDepartmentDeleteOpen.value = true
}

const confirmDeleteDepartment = () => {
  if (!departmentToDelete.value) return
  
  departmentsStore.deleteDepartment(departmentToDelete.value.id)
  toastStore.info(`${departmentToDelete.value.name} deleted`)
  
  isDepartmentDeleteOpen.value = false
  departmentToDelete.value = null
}

const cancelDeleteDepartment = () => {
  isDepartmentDeleteOpen.value = false
  departmentToDelete.value = null
}

const handleViewDepartment = (id: string) => {
  router.push(`/departments/${id}`)
}

// ==========================================
// 7. EMPLOYEE ACTIONS
// ==========================================
const handleAddEmployee = () => {
  router.push(`/employees/create?companyId=${company.value!.id}`)
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
  toastStore.info(`${employeeToDelete.value.name} deleted`)
  
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
    <div v-if="company" class="p-4 space-y-4">
      
      <!-- Header -->
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
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <h1 class="text-xl md:text-2xl font-bold text-neutral-800 break-words">
              {{ company.name }} Details
            </h1>
            <p class="text-xs md:text-sm text-neutral-600 mt-1">
              View and manage company information
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <!-- Back Button -->
            <!-- <button
              @click="handleBack"
              class="hidden sm:flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg md:rounded-full transition-colors text-sm whitespace-nowrap"
            >
              <ArrowLeftIcon class="w-4 h-4" />
              <span>Back</span>
            </button> -->
            
            <!-- Edit Button -->
            <button
              v-if="authStore.userRole !== 'employee'"
              @click="handleEdit"
              class="flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg md:rounded-full transition-colors text-sm whitespace-nowrap"
            >
              <PencilIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Edit</span>
            </button>
            
            <!-- Delete Button -->
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
              <div class="text-3xl font-bold text-neutral-800">{{ companyDepartments.length }}</div>
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
              <div class="text-3xl font-bold text-neutral-800">{{ companyEmployees.length }}</div>
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

      <!-- Departments Section -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-800">
            📚 Departments ({{ companyDepartments.length }})
          </h2>
          <button
            v-if="authStore.userRole !== 'employee'"
            @click="openAddDepartmentModal"
            class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
            Add Department
          </button>
        </div>

        <!-- Departments List -->
        <div v-if="companyDepartments.length > 0" class="space-y-2">
          <div
            v-for="dept in companyDepartments"
            :key="dept.id"
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <div class="flex-1">
              <div class="font-semibold text-neutral-800">{{ dept.name }}</div>
              <div class="text-sm text-neutral-500">{{ dept.employeeCount }} employees</div>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="handleViewDepartment(dept.id)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="View Department"
              >
                <EyeIcon class="w-4 h-4 text-neutral-600" />
              </button>
              <button
                v-if="authStore.userRole !== 'employee'"
                @click="openEditDepartmentModal(dept)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="Edit Department"
              >
                <PencilIcon class="w-4 h-4 text-neutral-600" />
              </button>
              <button
                v-if="authStore.userRole === 'admin'"
                @click="handleDeleteDepartment(dept.id)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="Delete Department"
              >
                <TrashIcon class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-neutral-50 rounded-xl">
          <BuildingLibraryIcon class="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p class="text-neutral-500">No departments yet</p>
          <button
            v-if="authStore.userRole !== 'employee'"
            @click="openAddDepartmentModal"
            class="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            Add your first department
          </button>
        </div>
      </div>

      <!-- Employees Section -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-neutral-800">
            👥 Employees ({{ companyEmployees.length }})
          </h2>
          <button
            v-if="authStore.userRole !== 'employee'"
            @click="handleAddEmployee"
            class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm transition-colors"
          >
            <PlusIcon class="w-4 h-4" />
            Add Employee
          </button>
        </div>

        <!-- Employees List -->
        <div v-if="companyEmployees.length > 0" class="space-y-2">
          <div
            v-for="employee in companyEmployees.slice(0, 5)"
            :key="employee.id"
            class="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="font-semibold text-neutral-800 truncate">{{ employee.name }}</div>
              <div class="text-sm text-neutral-500 truncate">
                {{ departmentsStore.getDepartmentById(employee.departmentId)?.name }} • {{ employee.designation }}
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
                v-if="authStore.userRole !== 'employee'"
                @click="handleEditEmployee(employee.id)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="Edit Employee"
              >
                <PencilIcon class="w-4 h-4 text-neutral-600" />
              </button>
              <button
                v-if="authStore.userRole === 'admin'"
                @click="handleDeleteEmployee(employee.id)"
                class="p-2 hover:bg-white rounded-lg transition-colors"
                title="Delete Employee"
              >
                <TrashIcon class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          <!-- Show More Link -->
          <div v-if="companyEmployees.length > 5" class="text-center pt-2">
            <button
              @click="router.push(`/employees?companyId=${company.id}`)"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all {{ companyEmployees.length }} employees →
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-neutral-50 rounded-xl">
          <UsersIcon class="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p class="text-neutral-500">No employees yet</p>
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
      v-if="company"
      :is-open="isConfirmOpen"
      title="Delete Company"
      :message="`Are you sure you want to delete ${company.name}? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    

    <DepartmentModal
      v-if="company"
      :is-open="isDepartmentModalOpen"
      :department="editingDepartment"
      :preselected-company-id="company.id"
      @close="closeDepartmentModal"
      @save="handleSaveDepartment"
    />
    <!-- Department Delete Confirm -->
    <ConfirmDialog
      :is-open="isDepartmentDeleteOpen"
      title="Delete Department"
      :message="departmentToDelete ? `Are you sure you want to delete ${departmentToDelete.name}? This action cannot be undone.` : ''"
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDeleteDepartment"
      @cancel="cancelDeleteDepartment"
    />

    <!-- Employee Delete Confirm -->
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