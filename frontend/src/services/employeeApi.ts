import api from './api'
import type { Employee } from '@/store/employees'

// Frappe Response Types
interface FrappeListResponse<T> {
  data: T[]
}

interface FrappeDocResponse<T> {
  data: T
}

// Map Frappe field names to Frontend field names
function mapFrappeToEmployee(frappeEmp: any): Employee {
  return {
    id: frappeEmp.name,
    name: frappeEmp.full_name,
    email: frappeEmp.email,
    mobile: frappeEmp.mobile || '',
    address: frappeEmp.address || '',
    designation: frappeEmp.designation || '',
    companyId: frappeEmp.company,
    departmentId: frappeEmp.department,
    status: frappeEmp.status,
    hiredOn: frappeEmp.hired_on
  }
}

// Map Frontend fields to Frappe fields
function mapEmployeeToFrappe(emp: Partial<Employee>) {
  const payload: any = {}
  
  if (emp.name) payload.full_name = emp.name
  if (emp.email) payload.email = emp.email
  if (emp.mobile !== undefined) payload.mobile = emp.mobile
  if (emp.address !== undefined) payload.address = emp.address
  if (emp.designation !== undefined) payload.designation = emp.designation
  if (emp.companyId) payload.company = emp.companyId
  if (emp.departmentId) payload.department = emp.departmentId
  if (emp.status) payload.status = emp.status
  if (emp.hiredOn !== undefined) payload.hired_on = emp.hiredOn
  
  return payload
}

export const employeeApi = {
  // Get all employees
  async getAll(): Promise<Employee[]> {
    try {
      const response = await api.get<FrappeListResponse<any>>('/api/resource/Employee', {
        params: {
          fields: JSON.stringify([
            'name',
            'full_name',
            'email',
            'mobile',
            'address',
            'designation',
            'company',
            'department',
            'status',
            'hired_on'
          ]),
          limit_page_length: 0
        }
      })
      
      return response.data.data.map(mapFrappeToEmployee)
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    }
  },

  // Get employee by ID
  async getById(id: string): Promise<Employee | null> {
    try {
      const response = await api.get<FrappeDocResponse<any>>(`/api/resource/Employee/${id}`)
      return mapFrappeToEmployee(response.data.data)
    } catch (error) {
      console.error('Error fetching employee:', error)
      return null
    }
  },

  // Create employee
  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    try {
      const payload = mapEmployeeToFrappe(employee)
      
      const response = await api.post<FrappeDocResponse<any>>('/api/resource/Employee', payload)
      
      return mapFrappeToEmployee(response.data.data)
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  },

  // Update employee
  async update(id: string, updates: Partial<Employee>): Promise<Employee> {
    try {
      const payload = mapEmployeeToFrappe(updates)
      
      const response = await api.put<FrappeDocResponse<any>>(
        `/api/resource/Employee/${id}`,
        payload
      )
      
      return mapFrappeToEmployee(response.data.data)
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    }
  },

  // Delete employee
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/resource/Employee/${id}`)
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  },

  // Get employees by company
  async getByCompany(companyId: string): Promise<Employee[]> {
    try {
      const response = await api.get<FrappeListResponse<any>>('/api/resource/Employee', {
        params: {
          fields: JSON.stringify([
            'name',
            'full_name',
            'email',
            'mobile',
            'address',
            'designation',
            'company',
            'department',
            'status',
            'hired_on'
          ]),
          filters: JSON.stringify([['company', '=', companyId]]),
          limit_page_length: 0
        }
      })
      
      return response.data.data.map(mapFrappeToEmployee)
    } catch (error) {
      console.error('Error fetching employees by company:', error)
      throw error
    }
  },

  // Get employees by department
  async getByDepartment(departmentId: string): Promise<Employee[]> {
    try {
      const response = await api.get<FrappeListResponse<any>>('/api/resource/Employee', {
        params: {
          fields: JSON.stringify([
            'name',
            'full_name',
            'email',
            'mobile',
            'address',
            'designation',
            'company',
            'department',
            'status',
            'hired_on'
          ]),
          filters: JSON.stringify([['department', '=', departmentId]]),
          limit_page_length: 0
        }
      })
      
      return response.data.data.map(mapFrappeToEmployee)
    } catch (error) {
      console.error('Error fetching employees by department:', error)
      throw error
    }
  }
}
