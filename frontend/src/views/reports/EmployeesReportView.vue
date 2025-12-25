<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEmployeesStore } from '@/store/employees'
import { useCompaniesStore } from '@/store/companies'
import { useDepartmentsStore } from '@/store/departments'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const employeesStore = useEmployeesStore()
const companiesStore = useCompaniesStore()
const departmentsStore = useDepartmentsStore()

// Filter: Only hired employees
const hiredEmployees = computed(() => {
  return employeesStore.employees.filter(emp => emp.status === 'Hired')
})

// Search
const searchQuery = ref('')
const filteredEmployees = computed(() => {
  if (!searchQuery.value) return hiredEmployees.value
  
  const query = searchQuery.value.toLowerCase()
  return hiredEmployees.value.filter(emp => 
    emp.name.toLowerCase().includes(query) ||
    emp.email.toLowerCase().includes(query) ||
    emp.designation?.toLowerCase().includes(query)
  )
})

// Get company/department names
const getCompanyName = (companyId: string) => {
  return companiesStore.getCompanyById(companyId)?.name || 'Unknown'
}

const getDepartmentName = (deptId: string) => {
  return departmentsStore.getDepartmentById(deptId)?.name || 'Unknown'
}

const getDaysEmployed = (employee: any) => {
  return employeesStore.getDaysEmployed(employee)
}

// Export to CSV
const exportToCSV = () => {
  const headers = ['#', 'Name', 'Email', 'Mobile', 'Position', 'Company', 'Department', 'Hired On', 'Days Employed']
  const rows = filteredEmployees.value.map((emp, index) => [
    (index + 1).toString(),  // ← 🆕 Row number
    emp.name,
    emp.email,
    emp.mobile || '',
    emp.designation || '',
    getCompanyName(emp.companyId),
    getDepartmentName(emp.departmentId),
    emp.hiredOn || '',
    getDaysEmployed(emp).toString()
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `hired-employees-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const exportToPDF = () => {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.setTextColor(45, 90, 67)
  doc.text('Hired Employees Report', 14, 20)
  
  // Subtitle
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 27)
  doc.text(`Total Employees: ${filteredEmployees.value.length}`, 14, 32)
  
  // Table data with row numbers
  const tableData = filteredEmployees.value.map((emp, index) => [
    (index + 1).toString(),  // ← 🆕 Row number
    emp.name,
    emp.email,
    emp.mobile || '-',
    emp.designation || '-',
    getCompanyName(emp.companyId),
    getDepartmentName(emp.departmentId),
    emp.hiredOn ? new Date(emp.hiredOn).toLocaleDateString() : '-',
    getDaysEmployed(emp).toString()
  ])
  
  autoTable(doc, {
    head: [['', 'Name', 'Email', 'Mobile', 'Position', 'Company', 'Department', 'Hired On', 'Days']],
    body: tableData,
    startY: 38,
    headStyles: {
      fillColor: [45, 90, 67],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251]
    },
    margin: { top: 38 },
    styles: {
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 8 },   // # ← 🆕
      1: { cellWidth: 22 },  // Name
      2: { cellWidth: 32 },  // Email
      3: { cellWidth: 18 },  // Mobile
      4: { cellWidth: 22 },  // Position
      5: { cellWidth: 22 },  // Company
      6: { cellWidth: 22 },  // Department
      7: { cellWidth: 18 },  // Hired On
      8: { cellWidth: 12 }   // Days
    }
  })
  
  // Footer
  const pageCount = doc.internal.pages.length - 1
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }
  
  doc.save(`hired-employees-${new Date().toISOString().split('T')[0]}.pdf`)
}

</script>

<template>
  <DashboardLayout>
    <div class="p-4 space-y-4">
      
      <!-- Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <h1 class="text-xl md:text-2xl font-bold text-neutral-800">
                📊 Hired Employees Report
            </h1>
            <p class="text-xs md:text-sm text-neutral-600 mt-1">
                Comprehensive report of all hired employees
            </p>
            </div>

            <!-- Export Buttons -->
            <div class="flex gap-2">
                <button
                    @click="exportToCSV"
                    class="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm transition-colors"
                >
                    <ArrowDownTrayIcon class="w-4 h-4" />
                    CSV
                </button>
                <button
                    @click="exportToPDF"
                    class="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm transition-colors"
                >
                    <ArrowDownTrayIcon class="w-4 h-4" />
                    PDF
                </button>
            </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="bg-white shadow-soft rounded-2xl p-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 rounded-xl">
            <UserGroupIcon class="w-8 h-8 text-green-600" />
          </div>
          <div>
            <div class="text-sm text-neutral-600">Total Hired Employees</div>
            <div class="text-3xl font-bold text-neutral-800">{{ hiredEmployees.length }}</div>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white shadow-soft rounded-2xl p-4">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or position..."
            class="w-full pl-12 pr-4 py-3 bg-neutral-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white shadow-soft rounded-2xl overflow-hidden">
        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto">
          <table class="w-full">
            <thead class="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Email</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Mobile</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Position</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Company</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Department</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Hired On</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase">Days</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200">
              <tr
                v-for="employee in filteredEmployees"
                :key="employee.id"
                class="hover:bg-neutral-50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-neutral-800">{{ employee.name }}</td>
                <td class="px-6 py-4 text-sm text-neutral-600">{{ employee.email }}</td>
                <td class="px-6 py-4 text-sm text-neutral-600">{{ employee.mobile || '-' }}</td>
                <td class="px-6 py-4 text-sm text-neutral-600">{{ employee.designation || '-' }}</td>
                <td class="px-6 py-4 text-sm text-neutral-600">{{ getCompanyName(employee.companyId) }}</td>
                <td class="px-6 py-4 text-sm text-neutral-600">{{ getDepartmentName(employee.departmentId) }}</td>
                <td class="px-6 py-4 text-sm text-neutral-600">
                  {{ employee.hiredOn ? new Date(employee.hiredOn).toLocaleDateString() : '-' }}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-green-600">{{ getDaysEmployed(employee) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="lg:hidden divide-y divide-neutral-200">
          <div
            v-for="employee in filteredEmployees"
            :key="employee.id"
            class="p-4"
          >
            <div class="font-semibold text-neutral-800 mb-2">{{ employee.name }}</div>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-neutral-500">Email:</span>
                <span class="text-neutral-800">{{ employee.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">Mobile:</span>
                <span class="text-neutral-800">{{ employee.mobile || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">Position:</span>
                <span class="text-neutral-800">{{ employee.designation || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">Company:</span>
                <span class="text-neutral-800">{{ getCompanyName(employee.companyId) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">Department:</span>
                <span class="text-neutral-800">{{ getDepartmentName(employee.departmentId) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">Hired On:</span>
                <span class="text-neutral-800">
                  {{ employee.hiredOn ? new Date(employee.hiredOn).toLocaleDateString() : '-' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">Days Employed:</span>
                <span class="font-semibold text-green-600">{{ getDaysEmployed(employee) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredEmployees.length === 0" class="p-12 text-center">
          <UserGroupIcon class="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p class="text-neutral-500">
            {{ searchQuery ? 'No employees found' : 'No hired employees yet' }}
          </p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>