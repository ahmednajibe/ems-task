<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeesStore } from '@/store/employees'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import EmployeeSearchBar from '@/components/employees/EmployeeSearchBar.vue'
import EmployeeTable from '@/components/employees/EmployeeTable.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const employeesStore = useEmployeesStore()
const toastStore = useToastStore()
const authStore = useAuthStore()


// Confirm dialog
const isConfirmOpen = ref(false)
const employeeToDelete = ref<string | null>(null)

// Search
const searchQuery = computed({
  get: () => employeesStore.searchQuery,
  set: (value) => employeesStore.setSearchQuery(value)
})

// Pagination
const paginationText = computed(() => {
  const start = (employeesStore.currentPage - 1) * employeesStore.itemsPerPage + 1
  const end = Math.min(
    employeesStore.currentPage * employeesStore.itemsPerPage,
    employeesStore.totalCount
  )
  return `Showing ${start} to ${end} of ${employeesStore.totalCount} employees`
})

// Actions
const handleCreate = () => {
  router.push('/employees/create')
}

const handleView = (id: string) => {
  router.push(`/employees/${id}`)
}

const handleEdit = (id: string) => {
  router.push(`/employees/${id}/edit`)
}

const handleDelete = (id: string) => {
  employeeToDelete.value = id
  isConfirmOpen.value = true
}

const confirmDelete = () => {
  if (!employeeToDelete.value) return
  
  const employee = employeesStore.getEmployeeById(employeeToDelete.value)
  if (employee) {
    employeesStore.deleteEmployee(employeeToDelete.value)
    toastStore.info(`${employee.name} deleted`)
  }
  
  isConfirmOpen.value = false
  employeeToDelete.value = null
}

const cancelDelete = () => {
  isConfirmOpen.value = false
  employeeToDelete.value = null
}
</script>

<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-neutral-800">Employees</h1>
          <p class="text-sm text-neutral-600 mt-1">
            Manage employee information and track hiring progress.
          </p>
        </div>

        <!-- Add Button -->
        <button
          @click="handleCreate"
          class="flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full shadow-soft transition-colors text-sm md:text-base"
        >
          <PlusIcon class="w-5 h-5" />
          <span class="hidden sm:inline">Add New Employee</span>
          <span class="sm:hidden">Add</span>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Search -->
      <EmployeeSearchBar v-model="searchQuery" class="mb-4" />

      <!-- Table -->
      <EmployeeTable
        :employees="employeesStore.paginatedEmployees"
        :user-role="authStore.userRole"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200 rounded-b-2xl shadow-soft">
        <p class="text-sm text-neutral-600">{{ paginationText }}</p>
        
        <div class="flex gap-2">
          <button
            @click="employeesStore.previousPage()"
            :disabled="employeesStore.currentPage === 1"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
              employeesStore.currentPage === 1
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            ]"
          >
            Previous
          </button>
          <button
            @click="employeesStore.nextPage()"
            :disabled="employeesStore.currentPage >= employeesStore.totalPages"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors text-sm',
              employeesStore.currentPage >= employeesStore.totalPages
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            ]"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
      :is-open="isConfirmOpen"
      title="Delete Employee"
      message="Are you sure you want to delete this employee? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </DashboardLayout>
</template>