import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  // Mock data
  const employees = ref<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@acme.com',
      mobile: '+1234567890',
      address: '123 Main St, San Francisco, CA',
      designation: 'Senior Software Engineer',
      companyId: '1', // Acme Corp
      departmentId: '1', // Engineering
      status: 'Hired',
      hiredOn: '2023-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@acme.com',
      mobile: '+1234567891',
      address: '456 Oak Ave, San Francisco, CA',
      designation: 'Sales Manager',
      companyId: '1', // Acme Corp
      departmentId: '2', // Sales
      status: 'Hired',
      hiredOn: '2023-03-20'
    },
    {
      id: '3',
      name: 'Bob Wilson',
      email: 'bob.wilson@globex.com',
      mobile: '+1234567892',
      address: '789 Pine Rd, New York, NY',
      designation: 'HR Specialist',
      companyId: '2', // Globex Inc
      departmentId: '4', // HR
      status: 'Hired',
      hiredOn: '2023-06-10'
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice.brown@acme.com',
      mobile: '+1234567893',
      address: '321 Elm St, San Francisco, CA',
      designation: 'Marketing Coordinator',
      companyId: '1',
      departmentId: '3', // Marketing
      status: 'Interview Scheduled'
    }
  ])

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
  function addEmployee(emp: Omit<Employee, 'id'>) {
    const newEmployee: Employee = {
      ...emp,
      id: Date.now().toString()
    }
    employees.value.push(newEmployee)
  }

  function updateEmployee(id: string, updates: Partial<Employee>) {
    const index = employees.value.findIndex(e => e.id === id)
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...updates } as Employee
    }
  }

  function deleteEmployee(id: string) {
    const index = employees.value.findIndex(e => e.id === id)
    if (index !== -1) {
      employees.value.splice(index, 1)
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

  return {
    employees,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredEmployees,
    paginatedEmployees,
    totalPages,
    totalCount,
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