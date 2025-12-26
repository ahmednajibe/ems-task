import api from './api'
import type { Company } from '@/store/companies'

// Frappe Response Types
interface FrappeListResponse<T> {
  data: T[]
}

interface FrappeDocResponse<T> {
  data: T
}

// Map Frappe field names to Frontend field names
function mapFrappeToCompany(frappeCompany: any): Company {
  return {
    id: frappeCompany.name,
    name: frappeCompany.company_name,
    departmentCount: frappeCompany.number_of_departments || 0,
    employeeCount: frappeCompany.number_of_employees || 0
  }
}

// Map Frontend fields to Frappe fields
function mapCompanyToFrappe(company: Partial<Company>) {
  const payload: any = {}
  
  if (company.name) payload.company_name = company.name
  // Note: counts are auto-calculated in Frappe, no need to send
  
  return payload
}

export const companyApi = {
  // Get all companies
  async getAll(): Promise<Company[]> {
    try {
      const response = await api.get<FrappeListResponse<any>>('/api/resource/Company', {
        params: {
          fields: JSON.stringify([
            'name',
            'company_name',
            'number_of_departments',
            'number_of_employees'
          ]),
          limit_page_length: 0
        }
      })
      
      return response.data.data.map(mapFrappeToCompany)
    } catch (error) {
      console.error('Error fetching companies:', error)
      throw error
    }
  },

  // Get company by ID
  async getById(id: string): Promise<Company | null> {
    try {
      const response = await api.get<FrappeDocResponse<any>>(`/api/resource/Company/${id}`)
      return mapFrappeToCompany(response.data.data)
    } catch (error) {
      console.error('Error fetching company:', error)
      return null
    }
  },

  // Create company
  async create(company: Omit<Company, 'id' | 'departmentCount' | 'employeeCount'>): Promise<Company> {
    try {
      const payload = mapCompanyToFrappe(company)
      
      const response = await api.post<FrappeDocResponse<any>>('/api/resource/Company', payload)
      
      return mapFrappeToCompany(response.data.data)
    } catch (error) {
      console.error('Error creating company:', error)
      throw error
    }
  },

  // Update company
  async update(id: string, updates: Partial<Company>): Promise<Company> {
    try {
      const payload = mapCompanyToFrappe(updates)
      
      const response = await api.put<FrappeDocResponse<any>>(
        `/api/resource/Company/${id}`,
        payload
      )
      
      return mapFrappeToCompany(response.data.data)
    } catch (error) {
      console.error('Error updating company:', error)
      throw error
    }
  },

  // Delete company
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/resource/Company/${id}`)
    } catch (error) {
      console.error('Error deleting company:', error)
      throw error
    }
  }
}
