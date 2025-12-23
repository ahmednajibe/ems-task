<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCompaniesStore } from '@/store/companies'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import CompanySearchBar from '@/components/companies/CompanySearchBar.vue'
import CompanyTable from '@/components/companies/CompanyTable.vue'
import CompanyModal from '@/components/companies/CompanyModal.vue'
import type { Company } from '@/store/companies'
import { PlusIcon } from '@heroicons/vue/24/outline'

const companiesStore = useCompaniesStore()
const toastStore = useToastStore()

// Modal state
const isModalOpen = ref(false)
const editingCompany = ref<Company | null>(null)

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

const handleSave = (companyData: Omit<Company, 'id'>) => {
  if (editingCompany.value) {
    // Edit existing
    companiesStore.updateCompany(editingCompany.value.id, companyData)
    toastStore.success(`${companyData.name} updated successfully!`)
  } else {
    // Add new
    companiesStore.addCompany(companyData)
    toastStore.success(`${companyData.name} added successfully!`)
  }
  closeModal()
}

const handleDelete = (id: string) => {
  const company = companiesStore.getCompanyById(id)
  if (!company) return

  if (confirm(`Are you sure you want to delete ${company.name}?`)) {
    companiesStore.deleteCompany(id)
    toastStore.info(`${company.name} deleted`)
  }
}

const handleView = (_id: string) => {
  // TODO: Navigate to company detail page
  toastStore.info('Company detail page - Coming soon!')
}
</script>

<template>
  <DashboardLayout>
    <!-- Page Header -->
    <div class=" px-6 py-4">
      <div class="flex items-center justify-between">
        <div>  
          <!-- Title & Subtitle -->
          <h1 class="text-2xl font-bold text-neutral-800">Companies</h1>
          <p class="text-sm text-neutral-600 mt-1">
            Manage your organization's legal entities and subsidiaries.
          </p>
        </div>

        <!-- Add Button -->
        <button
          @click="openAddModal"
          class="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full shadow-soft transition-colors"
        >
          <PlusIcon class="w-5 h-5" />
          Add New Company
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-4">
      <!-- Search Bar -->
      <CompanySearchBar v-model="searchQuery" />

      <!-- Table -->
      <CompanyTable
        :companies="companiesStore.paginatedCompanies"
        @view="handleView"
        @edit="openEditModal"
        @delete="handleDelete"
      />

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 bg-card rounded-2xl shadow-soft">
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

    <!-- Modal -->
    <CompanyModal
      :is-open="isModalOpen"
      :company="editingCompany"
      @close="closeModal"
      @save="handleSave"
    />
  </DashboardLayout>
</template>