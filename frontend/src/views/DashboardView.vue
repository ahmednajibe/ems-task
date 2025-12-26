<template>
  <DashboardLayout>
    <div class="p-4 space-y-6">
      <!-- Welcome Section -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <h2 class="text-xl md:text-2xl font-bold text-neutral-800">
          Welcome back, {{ authStore.user?.name }}! 👋
        </h2>
        <p class="text-sm text-neutral-600 mt-1">
          Here's an overview of your organization
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white shadow-soft rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-xl">
              <BuildingOfficeIcon class="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <div class="text-sm text-neutral-600">Companies</div>
              <div class="text-3xl font-bold text-neutral-800">{{ companiesStore.companies.length }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-soft rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-100 rounded-xl">
              <BuildingLibraryIcon class="w-8 h-8 text-green-600" />
            </div>
            <div>
              <div class="text-sm text-neutral-600">Departments</div>
              <div class="text-3xl font-bold text-neutral-800">{{ departmentsStore.departments.length }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-soft rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-100 rounded-xl">
              <UsersIcon class="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <div class="text-sm text-neutral-600">Employees</div>
              <div class="text-3xl font-bold text-neutral-800">{{ employeesStore.employees.length }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow-soft rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-orange-100 rounded-xl">
              <UserGroupIcon class="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <div class="text-sm text-neutral-600">Hired</div>
              <div class="text-3xl font-bold text-neutral-800">{{ hiredCount }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin & Manager: Charts + Quick Actions -->
      <div v-if="authStore.userRole !== 'employee'" class="space-y-6">
        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <router-link
            to="/companies"
            class="bg-white shadow-soft rounded-2xl p-6 hover:shadow-medium transition-shadow group"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                <BuildingOfficeIcon class="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <div class="font-semibold text-neutral-800">Companies</div>
                <div class="text-sm text-neutral-500">Manage companies</div>
              </div>
            </div>
          </router-link>

          <router-link
            to="/departments"
            class="bg-white shadow-soft rounded-2xl p-6 hover:shadow-medium transition-shadow group"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <BuildingLibraryIcon class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div class="font-semibold text-neutral-800">Departments</div>
                <div class="text-sm text-neutral-500">Manage departments</div>
              </div>
            </div>
          </router-link>

          <router-link
            to="/employees"
            class="bg-white shadow-soft rounded-2xl p-6 hover:shadow-medium transition-shadow group"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <UsersIcon class="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div class="font-semibold text-neutral-800">Employees</div>
                <div class="text-sm text-neutral-500">Manage employees</div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Top Companies Chart -->
        <div class="bg-white shadow-soft rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-4">
            📊 Top 5 Companies by Employee Count
          </h3>
          <EmployeeDistributionChart />
        </div>
      </div>

      <!-- Employee Role: Simple View -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Links -->
        <div class="bg-white shadow-soft rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-4">
            🔗 Quick Links
          </h3>
          <div class="space-y-3">
            <router-link
              to="/employees"
              class="flex items-center p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
            >
              <div class="p-2 bg-primary-100 rounded-lg mr-3 group-hover:bg-primary-200 transition-colors">
                <UsersIcon class="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div class="font-medium text-neutral-800">View All Employees</div>
                <div class="text-sm text-neutral-500">Browse employee directory</div>
              </div>
            </router-link>

            <router-link
              to="/reports/employees"
              class="flex items-center p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
            >
              <div class="p-2 bg-green-100 rounded-lg mr-3 group-hover:bg-green-200 transition-colors">
                <DocumentChartBarIcon class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div class="font-medium text-neutral-800">Employee Reports</div>
                <div class="text-sm text-neutral-500">View detailed reports</div>
              </div>
            </router-link>

            <router-link
              to="/account/profile"
              class="flex items-center p-4 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group"
            >
              <div class="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                <UserCircleIcon class="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div class="font-medium text-neutral-800">My Account</div>
                <div class="text-sm text-neutral-500">Manage your profile</div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Employee Stats -->
        <div class="bg-white shadow-soft rounded-2xl p-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-4">
            📈 Organization Overview
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div class="flex items-center gap-3">
                <BuildingOfficeIcon class="w-5 h-5 text-blue-600" />
                <span class="font-medium text-neutral-800">Companies</span>
              </div>
              <span class="text-xl font-bold text-blue-600">{{ companiesStore.companies.length }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div class="flex items-center gap-3">
                <BuildingLibraryIcon class="w-5 h-5 text-green-600" />
                <span class="font-medium text-neutral-800">Departments</span>
              </div>
              <span class="text-xl font-bold text-green-600">{{ departmentsStore.departments.length }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div class="flex items-center gap-3">
                <UsersIcon class="w-5 h-5 text-purple-600" />
                <span class="font-medium text-neutral-800">Total Employees</span>
              </div>
              <span class="text-xl font-bold text-purple-600">{{ employeesStore.employees.length }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <div class="flex items-center gap-3">
                <UserGroupIcon class="w-5 h-5 text-orange-600" />
                <span class="font-medium text-neutral-800">Hired Employees</span>
              </div>
              <span class="text-xl font-bold text-orange-600">{{ hiredCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useCompaniesStore } from '@/store/companies'
import { useDepartmentsStore } from '@/store/departments'
import { useEmployeesStore } from '@/store/employees'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import EmployeeDistributionChart from '@/components/dashboard/EmployeeDistributionChart.vue'
import {
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  UserCircleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const companiesStore = useCompaniesStore()
const departmentsStore = useDepartmentsStore()
const employeesStore = useEmployeesStore()

const hiredCount = computed(() => {
  return employeesStore.employees.filter(emp => emp.status === 'Hired').length
})
</script>