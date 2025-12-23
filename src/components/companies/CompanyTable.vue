<script setup lang="ts">
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

// Avatar color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-cyan-100 text-cyan-700',
    'bg-pink-100 text-pink-700',
    'bg-blue-100 text-blue-700',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="bg-card rounded-3xl shadow-premium overflow-hidden">
    <!-- Table Header -->
    <div class="grid grid-cols-12 gap-4 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
      <div class="col-span-5 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Company Name
      </div>
      <div class="col-span-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Departments
      </div>
      <div class="col-span-2 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
        Employees
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
        <!-- Company Name with Avatar -->
        <div class="col-span-5 flex items-center gap-3">
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm',
              getAvatarColor(company.name)
            ]"
          >
            {{ getInitials(company.name) }}
          </div>
          <div class="font-medium text-neutral-800">{{ company.name }}</div>
        </div>

        <!-- Departments -->
        <div class="col-span-3 flex items-center">
          <span class="text-neutral-800 font-medium">
            {{ company.departmentCount }}
          </span>
        </div>

        <!-- Employees -->
        <div class="col-span-2 flex items-center">
          <span class="text-neutral-800 font-medium">
            {{ company.employeeCount.toLocaleString() }}
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