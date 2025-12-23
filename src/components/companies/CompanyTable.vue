<script setup lang="ts">
import { computed } from 'vue'
import type { Company } from '@/store/companies'
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  companies: Company[]
}

interface Emits {
  (e: 'view', id: string): void
  (e: 'edit', company: Company): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// Avatar background colors based on status
const getAvatarColor = (initials: string) => {
  const colors = [
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-cyan-100 text-cyan-700',
    'bg-pink-100 text-pink-700',
    'bg-blue-100 text-blue-700',
  ]
  const index = initials.charCodeAt(0) % colors.length
  return colors[index]
}

// Industry badge colors
const getIndustryColor = (industry: string) => {
  const colorMap: Record<string, string> = {
    'Technology': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'Logistics': 'bg-purple-50 text-purple-700 border-purple-200',
    'Food Proc.': 'bg-green-50 text-green-700 border-green-200',
    'Pharma': 'bg-red-50 text-red-700 border-red-200',
    'Defense': 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return colorMap[industry] || 'bg-neutral-50 text-neutral-700 border-neutral-200'
}

// Status badge
const getStatusConfig = (status: Company['status']) => {
  const config = {
    active: { 
      dot: 'bg-green-500', 
      text: 'text-green-700',
      label: 'Active' 
    },
    pending: { 
      dot: 'bg-yellow-500', 
      text: 'text-yellow-700',
      label: 'Pending' 
    },
    inactive: { 
      dot: 'bg-neutral-400', 
      text: 'text-neutral-600',
      label: 'Inactive' 
    },
  }
  return config[status]
}
</script>

<template>
  <div class="bg-card rounded-3xl shadow-premium overflow-hidden">
    <!-- Table Header -->
    <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      <div class="col-span-4 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Company
      </div>
      <div class="col-span-2 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Industry
      </div>
      <div class="col-span-2 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Employees
      </div>
      <div class="col-span-2 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Status
      </div>
      <div class="col-span-2 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Actions
      </div>
    </div>

    <!-- Table Body -->
    <div class="divide-y divide-neutral-100">
      <div
        v-for="company in companies"
        :key="company.id"
        class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-primary-50/30 transition-colors"
      >
        <!-- Company Info -->
        <div class="col-span-4 flex items-center gap-3">
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
              getAvatarColor(company.initials)
            ]"
          >
            {{ company.initials }}
          </div>
          <div>
            <div class="font-medium text-neutral-800">{{ company.name }}</div>
            <div class="text-sm text-neutral-500">HQ: {{ company.location }}</div>
          </div>
        </div>

        <!-- Industry -->
        <div class="col-span-2 flex items-center">
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium border',
              getIndustryColor(company.industry)
            ]"
          >
            {{ company.industry }}
          </span>
        </div>

        <!-- Employees -->
        <div class="col-span-2 flex items-center">
          <span class="text-neutral-800 font-medium">
            {{ company.employeeCount.toLocaleString() }}
          </span>
        </div>

        <!-- Status -->
        <div class="col-span-2 flex items-center gap-2">
          <div :class="['w-2 h-2 rounded-full', getStatusConfig(company.status).dot]"></div>
          <span :class="['text-sm font-medium', getStatusConfig(company.status).text]">
            {{ getStatusConfig(company.status).label }}
          </span>
        </div>

        <!-- Actions -->
        <div class="col-span-2 flex items-center gap-2">
          <button
            @click="emit('view', company.id)"
            class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title="View"
          >
            <EyeIcon class="w-5 h-5 text-neutral-600" />
          </button>
          <button
            @click="emit('edit', company)"
            class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            title="Edit"
          >
            <PencilIcon class="w-5 h-5 text-neutral-600" />
          </button>
          <button
            @click="emit('delete', company.id)"
            class="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <TrashIcon class="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="companies.length === 0" class="py-12 text-center">
        <p class="text-neutral-500">No companies found</p>
      </div>
    </div>
  </div>
</template>