import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCompaniesStore } from './companies'
import { departmentApi } from '@/services/departmentApi'

export interface Department {
  id: string
  name: string
  companyId: string
  employeeCount: number
}

export const useDepartmentsStore = defineStore('departments', () => {
  const companiesStore = useCompaniesStore()

  // State
  const departments = ref<Department[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Search & Pagination
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(5)

  // Filtered departments
  const filteredDepartments = computed(() => {
    if (!searchQuery.value) return departments.value
    
    const query = searchQuery.value.toLowerCase()
    return departments.value.filter(dept => {
      const company = companiesStore.getCompanyById(dept.companyId)
      return (
        dept.name.toLowerCase().includes(query) ||
        company?.name.toLowerCase().includes(query)
      )
    })
  })

  // Paginated
  const paginatedDepartments = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredDepartments.value.slice(start, end)
  })

  // Total pages
  const totalPages = computed(() => 
    Math.ceil(filteredDepartments.value.length / itemsPerPage.value)
  )

  const totalCount = computed(() => filteredDepartments.value.length)

  // Fetch departments from API
  async function fetchDepartments() {
    isLoading.value = true
    error.value = null
    
    try {
      departments.value = await departmentApi.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch departments'
      console.error('Error fetching departments:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Get departments by company
  const getDepartmentsByCompany = (companyId: string) => {
    return departments.value.filter(d => d.companyId === companyId)
  }

  // CRUD Actions
  async function addDepartment(dept: Omit<Department, 'id' | 'employeeCount'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const newDept = await departmentApi.create(dept)
      departments.value.push(newDept)
      return newDept
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add department'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateDepartment(id: string, updates: Partial<Department>) {
    isLoading.value = true
    error.value = null
    
    try {
      const updated = await departmentApi.update(id, updates)
      const index = departments.value.findIndex(d => d.id === id)
      if (index !== -1) {
        departments.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update department'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteDepartment(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await departmentApi.delete(id)
      const index = departments.value.findIndex(d => d.id === id)
      if (index !== -1) {
        departments.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete department'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function getDepartmentById(id: string) {
    return departments.value.find(d => d.id === id)
  }

  // Pagination
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
    currentPage.value = 1
  }

  // Load departments on initialization
  fetchDepartments()

  return {
    departments,
    isLoading,
    error,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredDepartments,
    paginatedDepartments,
    totalPages,
    totalCount,
    fetchDepartments,
    getDepartmentsByCompany,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    nextPage,
    previousPage,
    setSearchQuery
  }
})