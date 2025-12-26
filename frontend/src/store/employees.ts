import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { employeeApi } from '@/services/employeeApi'

export type EmployeeStatus = 'Application Received' | 'Interview Scheduled' | 'Hired' | 'Not Accepted'

export interface Employee {
  id: string
  name: string
  email: string
  mobile: string
  address: string
  designation: string
  companyId: string
  departmentId: string
  status: EmployeeStatus
  hiredOn?: string  // ISO date string (only if status = 'Hired')
}

export const useEmployeesStore = defineStore('employees', () => {
  // State
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Search & Pagination
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Filtered employees
  const filteredEmployees = computed(() => {
    if (!searchQuery.value) return employees.value
    
    const query = searchQuery.value.toLowerCase()
    return employees.value.filter(emp =>
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.designation.toLowerCase().includes(query)
    )
  })

  // Paginated
  const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredEmployees.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredEmployees.value.length / itemsPerPage.value)
  )

  const totalCount = computed(() => filteredEmployees.value.length)

  // Fetch employees from API
  async function fetchEmployees() {
    isLoading.value = true
    error.value = null
    
    try {
      employees.value = await employeeApi.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch employees'
      console.error('Error fetching employees:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Calculate days employed
  const getDaysEmployed = (employee: Employee): number => {
    if (employee.status !== 'Hired' || !employee.hiredOn) return 0
    
    const hiredDate = new Date(employee.hiredOn)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - hiredDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get employees by company
  const getEmployeesByCompany = (companyId: string) => {
    return employees.value.filter(e => e.companyId === companyId)
  }

  // Get employees by department
  const getEmployeesByDepartment = (departmentId: string) => {
    return employees.value.filter(e => e.departmentId === departmentId)
  }

  // CRUD
  async function addEmployee(emp: Omit<Employee, 'id'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const newEmployee = await employeeApi.create(emp)
      employees.value.push(newEmployee)
      return newEmployee
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add employee'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateEmployee(id: string, updates: Partial<Employee>) {
    isLoading.value = true
    error.value = null
    
    try {
      const updated = await employeeApi.update(id, updates)
      const index = employees.value.findIndex(e => e.id === id)
      if (index !== -1) {
        employees.value[index] = updated
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update employee'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteEmployee(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await employeeApi.delete(id)
      const index = employees.value.findIndex(e => e.id === id)
      if (index !== -1) {
        employees.value.splice(index, 1)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete employee'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function getEmployeeById(id: string) {
    return employees.value.find(e => e.id === id)
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

  // Load employees on initialization
  fetchEmployees()

  return {
    employees,
    isLoading,
    error,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredEmployees,
    paginatedEmployees,
    totalPages,
    totalCount,
    fetchEmployees,
    getDaysEmployed,
    getEmployeesByCompany,
    getEmployeesByDepartment,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    nextPage,
    previousPage,
    setSearchQuery
  }
})