<script setup lang="ts">
import { computed } from 'vue'
import type { Employee } from '@/store/employees'
import {
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

interface Props {
  employee: Employee
  companyName?: string
  departmentName?: string
}

interface Emits {
  (e: 'scheduleInterview', id: string): void
  (e: 'hire', id: string): void
  (e: 'reject', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Actions based on status
const canScheduleInterview = computed(() => props.employee.status === 'Application Received')
const canHire = computed(() => props.employee.status === 'Interview Scheduled')
const canReject = computed(() => ['Application Received', 'Interview Scheduled'].includes(props.employee.status))
const isFinalState = computed(() => ['Hired', 'Not Accepted'].includes(props.employee.status))

// Get initials for avatar
const initials = computed(() => {
  const names = props.employee.name.split(' ')
  if (names.length >= 2) {
    const first = names[0]?.[0]
    const last = names[names.length - 1]?.[0]
    if (first && last) {
      return `${first}${last}`.toUpperCase()
    }
  }
  return props.employee.name.substring(0, 2).toUpperCase()
})

// Pastel avatar color rotation
const avatarColorClasses = [
  'bg-purple-100 text-purple-700',  // Lavender
  'bg-orange-100 text-orange-700',  // Peach
  'bg-green-100 text-green-700',    // Mint
  'bg-blue-100 text-blue-700',      // Sky
  'bg-pink-100 text-pink-700'       // Rose
]

const avatarColor = computed(() => {
  const charCode = props.employee.name.charCodeAt(0)
  return avatarColorClasses[charCode % avatarColorClasses.length]
})
</script>

<template>
  <div 
    :class="[
      'bg-white rounded-2xl p-5 transition-all duration-200',
      isFinalState && employee.status === 'Not Accepted' 
        ? 'opacity-60 shadow-sm' 
        : 'shadow-md hover:shadow-lg'
    ]"
  >
    <!-- Avatar & Name -->
    <div class="flex items-center gap-3 mb-4">
      <div :class="['w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0', avatarColor]">
        <span class="text-base font-bold">{{ initials }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-neutral-800 truncate">{{ employee.name }}</h3>
        <p class="text-xs text-neutral-500 truncate">{{ employee.designation || 'No title' }}</p>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-1.5 mb-3">
      <div class="flex items-center gap-2 text-xs text-neutral-600">
        <EnvelopeIcon class="w-3.5 h-3.5 flex-shrink-0" />
        <span class="truncate">{{ employee.email }}</span>
      </div>
      <div v-if="employee.mobile" class="flex items-center gap-2 text-xs text-neutral-600">
        <PhoneIcon class="w-3.5 h-3.5 flex-shrink-0" />
        <span class="truncate">{{ employee.mobile }}</span>
      </div>
      <div v-if="companyName" class="flex items-center gap-2 text-xs text-neutral-600">
        <BuildingOfficeIcon class="w-3.5 h-3.5 flex-shrink-0" />
        <span class="truncate">{{ companyName }} - {{ departmentName }}</span>
      </div>
      <div v-if="employee.hiredOn" class="flex items-center gap-2 text-xs text-neutral-600">
        <CalendarIcon class="w-3.5 h-3.5 flex-shrink-0" />
        <span>Hired: {{ new Date(employee.hiredOn).toLocaleDateString() }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="!isFinalState" class="flex gap-2.5 pt-4 border-t border-neutral-100">
      <!-- Schedule Interview / Hire -->
      <button
        v-if="canScheduleInterview || canHire"
        @click="canScheduleInterview ? emit('scheduleInterview', employee.id) : emit('hire', employee.id)"
        class="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow"
      >
        {{ canScheduleInterview ? 'Schedule' : 'Hire' }}
      </button>

      <!-- Reject -->
      <button
        v-if="canReject"
        @click="emit('reject', employee.id)"
        class="flex-1 px-4 py-2.5 bg-white hover:bg-neutral-50 text-neutral-600 border-2 border-neutral-300 hover:border-neutral-400 text-sm font-medium rounded-lg transition-all"
      >
        Reject
      </button>
    </div>

    <!-- Final State Message -->
    <div v-else class="pt-3 border-t border-neutral-100">
      <p class="text-xs text-center text-neutral-500">
        {{ employee.status === 'Hired' ? '✓ Hired' : '✗ Not Accepted' }}
      </p>
    </div>
  </div>
</template>
