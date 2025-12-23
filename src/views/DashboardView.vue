<script setup lang="ts">
import { useDashboardStore } from '@/store/dashboard'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import DashboardHeader from '@/components/layout/DashboardHeader.vue'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import EmployeeDistributionChart from '@/components/dashboard/EmployeeDistributionChart.vue'
import HiringStatusCard from '@/components/dashboard/HiringStatusCard.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import {
  BuildingOfficeIcon,
  BuildingLibraryIcon,
  UsersIcon,
  UserPlusIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const dashboardStore = useDashboardStore()
</script>

<template>
  <DashboardLayout>
    <!-- Header -->
    <DashboardHeader 
      title="Summary Dashboard"
      subtitle="Welcome back, Admin"
    />

    <!-- Content -->
    <div class="p-4 space-y-4">
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <!-- Chart + Hiring Status - 2 Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Employee Distribution Chart (2/3 width) -->
        <div class="lg:col-span-2 bg-card rounded-3xl p-5 shadow-premium flex flex-col">
          <div class="mb-9">
            <h2 class="text-xl font-semibold text-neutral-800">Employee Distribution</h2>
            <p class="text-sm text-neutral-600">Headcount by department</p>
          </div>
          <div class="flex-1 flex items-center">
            <div class="w-full">
              <EmployeeDistributionChart />
            </div>
          </div>
        </div>

        <!-- Hiring Pipeline (1/3 width) -->
        <div class="bg-card rounded-3xl p-5 shadow-premium">
          <h2 class="text-lg font-semibold text-neutral-800 mb-3">Hiring Pipeline</h2>
          <div class="space-y-2">
            <HiringStatusCard
              label="Application Received"
              :count="dashboardStore.hiringStatus.applicationReceived"
              :icon="DocumentTextIcon"
              color="blue"
            />
            <HiringStatusCard
              label="Interview Scheduled"
              :count="dashboardStore.hiringStatus.interviewScheduled"
              :icon="CalendarDaysIcon"
              color="yellow"
            />
            <HiringStatusCard
              label="Hired"
              :count="dashboardStore.hiringStatus.hired"
              :icon="CheckCircleIcon"
              color="green"
            />
            <HiringStatusCard
              label="Not Accepted"
              :count="dashboardStore.hiringStatus.notAccepted"
              :icon="XCircleIcon"
              color="red"
            />
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <QuickActions />
    </div>
  </DashboardLayout>
</template>