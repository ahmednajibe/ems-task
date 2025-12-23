import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Company interface
export interface Company {
  id: string
  name: string
  initials: string
  location: string
  industry: string
  employeeCount: number
  status: 'active' | 'pending' | 'inactive'
}

export const useCompaniesStore = defineStore('companies', () => {
  // Mock data
  const companies = ref<Company[]>([
    {
      id: '1',
      name: 'Acme Corp',
      initials: 'AC',
      location: 'San Francisco, CA',
      industry: 'Technology',
      employeeCount: 124,
      status: 'active'
    },
    {
      id: '2',
      name: 'Globex Inc.',
      initials: 'GL',
      location: 'New York, NY',
      industry: 'Logistics',
      employeeCount: 85,
      status: 'active'
    },
    {
      id: '3',
      name: 'Soylent Corp',
      initials: 'SO',
      location: 'Detroit, MI',
      industry: 'Food Proc.',
      employeeCount: 340,
      status: 'pending'
    },
    {
      id: '4',
      name: 'Umbrella Corp',
      initials: 'UM',
      location: 'Raccoon City',
      industry: 'Pharma',
      employeeCount: 5000,
      status: 'inactive'
    },
    {
      id: '5',
      name: 'Cyberdyne',
      initials: 'CY',
      location: 'Los Angeles, CA',
      industry: 'Defense',
      employeeCount: 200,
      status: 'active'
    },
    {
      id: '6',
      name: 'Stark Industries',
      initials: 'SI',
      location: 'New York, NY',
      industry: 'Technology',
      employeeCount: 1500,
      status: 'active'
    },
    {
      id: '7',
      name: 'Wayne Enterprises',
      initials: 'WE',
      location: 'Gotham City',
      industry: 'Technology',
      employeeCount: 2300,
      status: 'active'
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
      company.name.toLowerCase().includes(query) ||
      company.industry.toLowerCase().includes(query) ||
      company.location.toLowerCase().includes(query)
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