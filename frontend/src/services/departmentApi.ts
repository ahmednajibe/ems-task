import api from './api'
import type { Department } from '@/store/departments'

// Frappe Response Types
interface FrappeListResponse<T> {
  data: T[]
}

interface FrappeDocResponse<T> {
  data: T
}

// Map Frappe field names to Frontend field names
function mapFrappeToDepartment(frappeDept: any): Department {
  return {
    id: frappeDept.name,
    name: frappeDept.department_name,
    companyId: frappeDept.company,
    employeeCount: frappeDept.number_of_employees || 0
  }
}

// Map Frontend fields to Frappe fields
function mapDepartmentToFrappe(dept: Partial<Department>) {
  const payload: any = {}
  
  if (dept.name) payload.department_name = dept.name
  if (dept.companyId) payload.company = dept.companyId
  // Note: employee count is auto-calculated in Frappe
  
  return payload
}

export const departmentApi = {
  // Get all departments
  async getAll(): Promise<Department[]> {
    try {
      const response = await api.get<FrappeListResponse<any>>('/api/resource/Department', {
        params: {
          fields: JSON.stringify([
            'name',
            'department_name',
            'company',
            'number_of_employees'
          ]),
          limit_page_length: 0
        }
      })
      
      return response.data.data.map(mapFrappeToDepartment)
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  },

  // Get department by ID
  async getById(id: string): Promise<Department | null> {
    try {
      const response = await api.get<FrappeDocResponse<any>>(`/api/resource/Department/${id}`)
      return mapFrappeToDepartment(response.data.data)
    } catch (error) {
      console.error('Error fetching department:', error)
      return null
    }
  },

  // Create department
  async create(department: Omit<Department, 'id' | 'employeeCount'>): Promise<Department> {
    try {
      const payload = mapDepartmentToFrappe(department)
      
      const response = await api.post<FrappeDocResponse<any>>('/api/resource/Department', payload)
      
      return mapFrappeToDepartment(response.data.data)
    } catch (error) {
      console.error('Error creating department:', error)
      throw error
    }
  },

  // Update department
  async update(id: string, updates: Partial<Department>): Promise<Department> {
    try {
      const payload = mapDepartmentToFrappe(updates)
      
      const response = await api.put<FrappeDocResponse<any>>(
        `/api/resource/Department/${id}`,
        payload
      )
      
      return mapFrappeToDepartment(response.data.data)
    } catch (error) {
      console.error('Error updating department:', error)
      throw error
    }
  },

  // Delete department
  async delete(id: string): Promise<void> {
    try {
      await api.post('/api/method/ems.api.delete_department', {
        department_id: id
      })
    } catch (error) {
      console.error('Error deleting department:', error)
      throw error
    }
  },

  // Get departments by company
  async getByCompany(companyId: string): Promise<Department[]> {
    try {
      const response = await api.get<FrappeListResponse<any>>('/api/resource/Department', {
        params: {
          fields: JSON.stringify([
            'name',
            'department_name',
            'company',
            'number_of_employees'
          ]),
          filters: JSON.stringify([['company', '=', companyId]]),
          limit_page_length: 0
        }
      })
      
      return response.data.data.map(mapFrappeToDepartment)
    } catch (error) {
      console.error('Error fetching departments by company:', error)
      throw error
    }
  }
}
