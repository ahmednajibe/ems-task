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
const statusConfig: Record<EmployeeStatus, { label: string; color: string; borderColor: string; dotColor: string }> = {
  'Application Received': {
    label: 'Application Received',
    color: 'text-primary-700',
    borderColor: 'border-green-200',
    dotColor: 'bg-accent-400' // Vibrant mint green
  },
  'Interview Scheduled': {
    label: 'Interview Scheduled',
    color: 'text-primary-700',
    borderColor: 'border-green-200',
    dotColor: 'bg-accent-600' // Vibrant mint green
  },
  'Hired': {
    label: 'Hired',
    color: 'text-primary-700',
    borderColor: 'border-primary-200',
    dotColor: 'bg-primary-600' // Deep forest green
  },
  'Not Accepted': {
    label: 'Not Accepted',
    color: 'text-primary-700',
    borderColor: 'border-neutral-200',
    dotColor: 'bg-neutral-300' // Muted grey
  }
}

const config = computed(() => statusConfig[props.status])
const count = computed(() => props.employees.length)
</script>

<template>
  <div class="flex flex-col h-full justify-center">
    <!-- Column Header -->
    <div :class="['p-4']">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Status Indicator Dot -->
          <div :class="['w-2 h-2 rounded-full', config.dotColor]"></div>
          <h3 :class="['font-semibold text-xs uppercase tracking-wider', config.color]">
            {{ config.label }}
          </h3>
          <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', 'bg-primary-300', config.color]">
            {{ count }}
          </span>
        </div>
          <span :class="['flex text-xl font-bold  jusitfy-center items-center text-neutral-300']">
            . . .
          </span>
      </div>
    </div>

    <!-- Cards Container -->
    <div class="flex-1 p-4 overflow-y-auto max-h-[500px] scrollbar-hide">
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
