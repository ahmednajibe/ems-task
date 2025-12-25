<script setup lang="ts">
import { computed } from 'vue'
import type { Employee, EmployeeStatus } from '@/store/employees'
import CandidateCard from './CandidateCard.vue'

interface Props {
  status: EmployeeStatus
  employees: Employee[]
  companyNames: Record<string, string>
  departmentNames: Record<string, string>
}

interface Emits {
  (e: 'scheduleInterview', id: string): void
  (e: 'hire', id: string): void
  (e: 'reject', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Status config with indicator dots
const statusConfig: Record<EmployeeStatus, { label: string; color: string; bgColor: string; borderColor: string; dotColor: string }> = {
  'Application Received': {
    label: 'Application Received',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    dotColor: 'bg-green-400' // Vibrant mint green
  },
  'Interview Scheduled': {
    label: 'Interview Scheduled',
    color: 'text-green-700',
    bgColor: 'bg-green-50', 
    borderColor: 'border-green-200',
    dotColor: 'bg-green-400' // Vibrant mint green
  },
  'Hired': {
    label: 'Hired',
    color: 'text-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    dotColor: 'bg-primary-600' // Deep forest green
  },
  'Not Accepted': {
    label: 'Not Accepted',
    color: 'text-neutral-400',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200',
    dotColor: 'bg-neutral-300' // Muted grey
  }
}

const config = computed(() => statusConfig[props.status])
const count = computed(() => props.employees.length)
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Column Header -->
    <div :class="['rounded-t-xl p-4', config.bgColor]">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Status Indicator Dot -->
          <div :class="['w-2 h-2 rounded-full', config.dotColor]"></div>
          <h3 :class="['font-semibold text-xs uppercase tracking-wider', config.color]">
            {{ config.label }}
          </h3>
        </div>
        <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', 'bg-white', config.color]">
          {{ count }}
        </span>
      </div>
    </div>

    <!-- Cards Container -->
    <div class="flex-1 bg-neutral-100 p-4 rounded-b-2xl border-x border-b border-neutral-200 overflow-y-auto max-h-[450px] scrollbar-hide">
      <div v-if="employees.length > 0" class="space-y-4">
        <CandidateCard
          v-for="employee in employees"
          :key="employee.id"
          :employee="employee"
          :company-name="companyNames[employee.companyId]"
          :department-name="departmentNames[employee.departmentId]"
          @schedule-interview="emit('scheduleInterview', $event)"
          @hire="emit('hire', $event)"
          @reject="emit('reject', $event)"
        />
      </div>
      <div v-else class="text-center py-8 text-neutral-400 text-sm">
        No employees in this stage
      </div>
    </div>
  </div>
</template>
