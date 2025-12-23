<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useDashboardStore } from '@/store/dashboard'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import {
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  UsersIcon,
  UserPlusIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
</script>

<template>
  <DashboardLayout>
    <!-- Header -->
    <div class="bg-white border-b border-neutral-200 px-8 py-6">
      <h1 class="text-2xl font-bold text-neutral-800">Summary Dashboard</h1>
      <p class="text-sm text-neutral-600">Welcome back, {{ authStore.user?.name }}</p>
    </div>

    <!-- Content -->
    <div class="p-8 space-y-6">
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Companies"
          :value="dashboardStore.totalCompanies"
          :icon="BuildingOfficeIcon"
          :trend="dashboardStore.companiesTrend"
        />
        
        <StatsCard
          title="Departments"
          :value="dashboardStore.totalDepartments"
          :icon="BuildingLibraryIcon"
          :trend="dashboardStore.departmentsTrend"
        />
        
        <StatsCard
          title="Total Employees"
          :value="dashboardStore.totalEmployees.toLocaleString()"
          :icon="UsersIcon"
          :trend="dashboardStore.employeesTrend"
        />
        
        <StatsCard
          title="New Hires"
          :value="dashboardStore.newHires"
          :icon="UserPlusIcon"
          :trend="dashboardStore.hiresTrend"
        />
      </div>

      <!-- Placeholder for Charts (next step) -->
      <div class="bg-white rounded-3xl p-8 border border-neutral-200">
        <p class="text-neutral-600">Charts will go here next! 📊</p>
      </div>
    </div>
  </DashboardLayout>
</template>