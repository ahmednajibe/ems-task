<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompaniesStore } from '@/store/companies'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import CompanySearchBar from '@/components/companies/CompanySearchBar.vue'
import CompanyTable from '@/components/companies/CompanyTable.vue'
import CompanyModal from '@/components/companies/CompanyModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import type { Company } from '@/store/companies'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'



const companiesStore = useCompaniesStore()
const toastStore = useToastStore()
const router = useRouter()
const authStore = useAuthStore()

// Modal state
const isModalOpen = ref(false)
const editingCompany = ref<Company | null>(null)
// Confirm dialog state
const isConfirmOpen = ref(false)
const companyToDelete = ref<Company | null>(null)

// Search
const searchQuery = computed({
  get: () => companiesStore.searchQuery,
  set: (value) => companiesStore.setSearchQuery(value)
})

// Pagination info
const paginationText = computed(() => {
  const start = (companiesStore.currentPage - 1) * companiesStore.itemsPerPage + 1
  const end = Math.min(
    companiesStore.currentPage * companiesStore.itemsPerPage,
    companiesStore.totalCount
  )
  return `Showing ${start} to ${end} of ${companiesStore.totalCount} companies`
})

// Actions
const openAddModal = () => {
  editingCompany.value = null
  isModalOpen.value = true
}

const openEditModal = (company: Company) => {
  editingCompany.value = company
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingCompany.value = null
}

const handleSave = (companyData: { name: string }) => {
  if (editingCompany.value) {
    // Edit existing - only update name
    companiesStore.updateCompany(editingCompany.value.id, { name: companyData.name })
    toastStore.success(`${companyData.name} updated successfully!`)
  } else {
    // Add new - counts start at 0
    companiesStore.addCompany({
      name: companyData.name,
      departmentCount: 0,
      employeeCount: 0
    })
    toastStore.success(`${companyData.name} added successfully!`)
  }
  closeModal()
}

const handleDelete = (id: string) => {
  const company = companiesStore.getCompanyById(id)
  if (!company) return
  
  companyToDelete.value = company
  isConfirmOpen.value = true
}

const confirmDelete = () => {
  if (!companyToDelete.value) return
  
  companiesStore.deleteCompany(companyToDelete.value.id)
  toastStore.info(`${companyToDelete.value.name} deleted`)
  
  isConfirmOpen.value = false
  companyToDelete.value = null
}

const cancelDelete = () => {
  isConfirmOpen.value = false
  companyToDelete.value = null
}

const handleView = (id: string) => {
  router.push(`/companies/${id}`)
}
</script>

<template>

  <DashboardLayout>
    <div class="p-4 space-y-4">
      <!-- Page Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-neutral-800">Companies</h1>
            <p class="text-xs md:text-sm text-neutral-600 mt-1">
              Manage your organization's legal entities and subsidiaries
            </p>
          </div>

          <!-- Add Button -->
          <button
            v-if="authStore.userRole !== 'employee'"
            @click="openAddModal"
            class="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full shadow-soft transition-colors text-sm md:text-base min-w-[44px]"
          >
            <PlusIcon class="w-5 h-5" />
            <span class="hidden md:inline">Add New Company</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div>
        <!-- Search Bar -->
        <CompanySearchBar v-model="searchQuery" class="mb-5" />
      
      <!-- Table -->
      <CompanyTable
        :companies="companiesStore.paginatedCompanies"
        :user-role="authStore.userRole"
        @view="handleView"
        @edit="openEditModal"
        @delete="handleDelete"
      />

      <!-- Pagination -->
      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200 rounded-b-2xl shadow-soft -mt-2">
        <p class="text-sm text-neutral-600">{{ paginationText }}</p>
        
        <div class="flex gap-2">
          <button
            @click="companiesStore.previousPage()"
            :disabled="companiesStore.currentPage === 1"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              companiesStore.currentPage === 1
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            ]"
          >
            Previous
          </button>
          <button
            @click="companiesStore.nextPage()"
            :disabled="companiesStore.currentPage >= companiesStore.totalPages"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              companiesStore.currentPage >= companiesStore.totalPages
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            ]"
          >
            Next
          </button>
        </div>
      </div>
      </div>
    </div>

    <!-- Modal -->
      <CompanyModal
        :is-open="isModalOpen"
        :company="editingCompany"
        @close="closeModal"
        @save="handleSave"
      />
      <!-- Confirm Delete Dialog -->
      <ConfirmDialog
        :is-open="isConfirmOpen"
        title="Delete Company"
        :message="companyToDelete ? `Are you sure you want to delete ${companyToDelete.name}? This action cannot be undone.` : ''"
        confirm-text="Delete"
        cancel-text="Cancel"
        type="danger"
        @confirm="confirmDelete"
        @cancel="cancelDelete"
      />
  </DashboardLayout>
</template>