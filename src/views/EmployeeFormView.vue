<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeesStore, type EmployeeStatus } from '@/store/employees'
import { useCompaniesStore } from '@/store/companies'
import { useDepartmentsStore } from '@/store/departments'
import { useToastStore } from '@/store/toast'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'

const route = useRoute()
const router = useRouter()
const employeesStore = useEmployeesStore()
const companiesStore = useCompaniesStore()
const departmentsStore = useDepartmentsStore()
const toastStore = useToastStore()

// Check if editing
const isEditMode = computed(() => !!route.params.id)
const employeeId = computed(() => route.params.id as string)

// Form data
const formData = ref({
  name: '',
  email: '',
  mobile: '',
  address: '',
  designation: '',
  companyId: '',
  departmentId: '',
  status: 'Application Received' as EmployeeStatus,
  hiredOn: ''
})

// Load employee data if editing
if (isEditMode.value) {
  const employee = employeesStore.getEmployeeById(employeeId.value)
  if (employee) {
    formData.value = {
      name: employee.name,
      email: employee.email,
      mobile: employee.mobile,
      address: employee.address,
      designation: employee.designation,
      companyId: employee.companyId,
      departmentId: employee.departmentId,
      status: employee.status,
      hiredOn: employee.hiredOn || ''
    }
  } else {
    toastStore.error('Employee not found')
    router.push('/employees')
  }
}

// Filtered departments based on selected company
const filteredDepartments = computed(() => {
  if (!formData.value.companyId) return []
  return departmentsStore.getDepartmentsByCompany(formData.value.companyId)
})

// Watch company change to reset department
watch(() => formData.value.companyId, () => {
  formData.value.departmentId = ''
})

// Watch status change to handle hiredOn
watch(() => formData.value.status, (newStatus) => {
  if (newStatus !== 'Hired') {
    formData.value.hiredOn = ''
  }
})

// Submit
const handleSubmit = () => {
  // Validation
  if (!formData.value.name.trim()) {
    toastStore.error('Please enter employee name')
    return
  }
  if (!formData.value.email.trim()) {
    toastStore.error('Please enter email address')
    return
  }
  if (!formData.value.companyId) {
    toastStore.error('Please select a company')
    return
  }
  if (!formData.value.departmentId) {
    toastStore.error('Please select a department')
    return
  }
  if (formData.value.status === 'Hired' && !formData.value.hiredOn) {
    toastStore.error('Please select hired date')
    return
  }

  const employeeData = {
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    mobile: formData.value.mobile.trim(),
    address: formData.value.address.trim(),
    designation: formData.value.designation.trim(),
    companyId: formData.value.companyId,
    departmentId: formData.value.departmentId,
    status: formData.value.status,
    hiredOn: formData.value.status === 'Hired' ? formData.value.hiredOn : undefined
  }

  if (isEditMode.value) {
    employeesStore.updateEmployee(employeeId.value, employeeData)
    toastStore.success(`${employeeData.name} updated successfully!`)
    router.push(`/employees/${employeeId.value}`)
  } else {
    employeesStore.addEmployee(employeeData)
    toastStore.success(`${employeeData.name} added successfully!`)
    router.push('/employees')
  }
}

const handleCancel = () => {
  if (isEditMode.value) {
    router.push(`/employees/${employeeId.value}`)
  } else {
    router.push('/employees')
  }
}
</script>

<template>
  <DashboardLayout>
    <div class="p-4 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4 mb-4">
        <h1 class="text-2xl font-bold text-neutral-800">
          {{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}
        </h1>
        <p class="text-sm text-neutral-600 mt-1">
          {{ isEditMode ? 'Update employee information' : 'Fill in the details to add a new employee' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white shadow-soft rounded-2xl p-6 space-y-6">
        
        <!-- Personal Information -->
        <div>
          <h2 class="text-lg font-semibold text-neutral-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Full Name *
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                placeholder="e.g. John Doe"
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Email Address *
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                placeholder="e.g. john.doe@company.com"
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            <!-- Mobile -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Mobile Number
              </label>
              <input
                v-model="formData.mobile"
                type="tel"
                placeholder="e.g. +1234567890"
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            <!-- Designation -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Position/Title
              </label>
              <input
                v-model="formData.designation"
                type="text"
                placeholder="e.g. Software Engineer"
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            <!-- Address (full width) -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Address
              </label>
              <textarea
                v-model="formData.address"
                rows="3"
                placeholder="e.g. 123 Main St, San Francisco, CA"
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Organization -->
        <div>
          <h2 class="text-lg font-semibold text-neutral-800 mb-4">Organization</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Company -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Company *
              </label>
              <select
                v-model="formData.companyId"
                required
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              >
                <option value="">Select a company...</option>
                <option
                  v-for="company in companiesStore.companies"
                  :key="company.id"
                  :value="company.id"
                >
                  {{ company.name }}
                </option>
              </select>
            </div>

            <!-- Department (filtered) -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Department *
              </label>
              <select
                v-model="formData.departmentId"
                required
                :disabled="!formData.companyId"
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all disabled:bg-neutral-50 disabled:cursor-not-allowed"
              >
                <option value="">{{ formData.companyId ? 'Select a department...' : 'Select company first' }}</option>
                <option
                  v-for="department in filteredDepartments"
                  :key="department.id"
                  :value="department.id"
                >
                  {{ department.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Employment Status -->
        <div>
          <h2 class="text-lg font-semibold text-neutral-800 mb-4">Employment Status</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Status *
              </label>
              <select
                v-model="formData.status"
                required
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              >
                <option value="Application Received">Application Received</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Hired">Hired</option>
                <option value="Not Accepted">Not Accepted</option>
              </select>
            </div>

            <!-- Hired On (only if status = Hired) -->
            <div v-if="formData.status === 'Hired'">
              <label class="block text-sm font-medium text-neutral-700 mb-2">
                Hired On *
              </label>
              <input
                v-model="formData.hiredOn"
                type="date"
                required
                class="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-colors shadow-soft"
          >
            {{ isEditMode ? 'Update Employee' : 'Add Employee' }}
          </button>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>