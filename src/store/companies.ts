import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Company interface
export interface Company {
  id: string
  name: string
  departmentCount: number
  employeeCount: number
}

export const useCompaniesStore = defineStore('companies', () => {
  // Mock data
  const companies = ref<Company[]>([
    {
        id: '1',
        name: 'Acme Corp',
        departmentCount: 5,
        employeeCount: 124
    },
    {
        id: '2',
        name: 'Globex Inc.',
        departmentCount: 3,
        employeeCount: 85
    },
    {
        id: '3',
        name: 'Soylent Corp',
        departmentCount: 8,
        employeeCount: 340
    },
    {
        id: '4',
        name: 'Umbrella Corp',
        departmentCount: 12,
        employeeCount: 5000
    },
    {
        id: '5',
        name: 'Cyberdyne Systems',
        departmentCount: 4,
        employeeCount: 200
    }
    ])

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

  // CRUD Actions
  function addCompany(company: Omit<Company, 'id'>) {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString()
    }
    companies.value.push(newCompany)
  }

  function updateCompany(id: string, updates: Partial<Company>) {
    const index = companies.value.findIndex(c => c.id === id)
    if (index !== -1) {
      companies.value[index] = { ...companies.value[index], ...updates }as Company
    }
  }

  function deleteCompany(id: string) {
    const index = companies.value.findIndex(c => c.id === id)
    if (index !== -1) {
      companies.value.splice(index, 1)
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

  return {
    companies,
    searchQuery,
    currentPage,
    itemsPerPage,
    filteredCompanies,
    paginatedCompanies,
    totalPages,
    totalCount,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    nextPage,
    previousPage,
    setSearchQuery
  }
})