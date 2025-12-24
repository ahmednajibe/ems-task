import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCompaniesStore } from './companies'

export interface Department {
  id: string
  name: string
  companyId: string
  employeeCount: number
}

export const useDepartmentsStore = defineStore('departments', () => {
  const companiesStore = useCompaniesStore()

  // Mock data
  const departments = ref<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      companyId: '1', // Acme Corp
      employeeCount: 45
    },
    {
      id: '2',
      name: 'Sales',
      companyId: '1', // Acme Corp
      employeeCount: 30
    },
    {
      id: '3',
      name: 'Marketing',
      companyId: '1', // Acme Corp
      employeeCount: 15
    },
    {
      id: '4',
      name: 'HR',
      companyId: '2', // Globex Inc
      employeeCount: 12
    },
    {
      id: '5',
      name: 'Operations',
      companyId: '2', // Globex Inc
      employeeCount: 25
    },
    {
      id: '6',
      name: 'Finance',
      companyId: '3', // Soylent Corp
      employeeCount: 20
    }
  ])

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

  // Get departments by company
  const getDepartmentsByCompany = (companyId: string) => {
    return departments.value.filter(d => d.companyId === companyId)
  }

  // CRUD Actions
  function addDepartment(dept: Omit<Department, 'id'>) {
    const newDept: Department = {
      ...dept,
      id: Date.now().toString()
    }
    departments.value.push(newDept)
  }

  function updateDepartment(id: string, updates: Partial<Department>) {
    const index = departments.value.findIndex(d => d.id === id)
    if (index !== -1) {
      departments.value[index] = { ...departments.value[index], ...updates } as Department
    }
  }

  function deleteDepartment(id: string) {
    const index = departments.value.findIndex(d => d.id === id)
    if (index !== -1) {
      departments.value.splice(index, 1)
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

  return {
    departments,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredDepartments,
    paginatedDepartments,
    totalPages,
    totalCount,
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