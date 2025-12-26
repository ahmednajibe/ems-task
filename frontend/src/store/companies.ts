import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { companyApi } from '@/services/companyApi'

// Company interface
export interface Company {
  id: string
  name: string
  departmentCount: number
  employeeCount: number
}

export const useCompaniesStore = defineStore('companies', () => {
  // State
  const companies = ref<Company[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Search query
  const searchQuery = ref('')

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(5)

  // Filtered companies (based on search)
  const filteredCompanies = computed(() => {
    if (!searchQuery.value) return companies.value
    
    const query = searchQuery.value.toLowerCase()
    return companies.value.filter(company =>
        company.name.toLowerCase().includes(query)
    )
  })

  // Paginated companies
  const paginatedCompanies = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredCompanies.value.slice(start, end)
  })

  // Total pages
  const totalPages = computed(() => 
    Math.ceil(filteredCompanies.value.length / itemsPerPage.value)
  )

  // Total count
  const totalCount = computed(() => filteredCompanies.value.length)

  // Fetch companies from API
  async function fetchCompanies() {
    isLoading.value = true
    error.value = null
    
    try {
      companies.value = await companyApi.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch companies'
      console.error('Error fetching companies:', err)
    } finally {
      isLoading.value = false
    }
  }

  // CRUD Actions
  async function addCompany(company: Omit<Company, 'id' | 'departmentCount' | 'employeeCount'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const newCompany = await companyApi.create(company)
      companies.value.push(newCompany)
      return newCompany
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add company'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateCompany(id: string, updates: Partial<Company>) {
    isLoading.value = true
    error.value = null
    
    try {
      const updated = await companyApi.update(id, updates)
      const index = companies.value.findIndex(c => c.id === id)
      if (index !== -1) {
        companies.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update company'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteCompany(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await companyApi.delete(id)
      const index = companies.value.findIndex(c => c.id === id)
      if (index !== -1) {
        companies.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete company'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function getCompanyById(id: string) {
    return companies.value.find(c => c.id === id)
  }

  // Pagination actions
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  function previousPage() {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
    currentPage.value = 1 // Reset to first page when searching
  }

  // Load companies on initialization
  fetchCompanies()

  return {
    companies,
    isLoading,
    error,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredCompanies,
    paginatedCompanies,
    totalPages,
    totalCount,
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    nextPage,
    previousPage,
    setSearchQuery
  }
})