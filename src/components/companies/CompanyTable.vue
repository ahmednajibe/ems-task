<script setup lang="ts">
import type { Company } from '@/store/companies'
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  companies: Company[]
  userRole?: string | null
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
  <div class="bg-white shadow-soft rounded-t-2xl overflow-hidden">
    
    <!-- Desktop Table View (hidden on mobile) -->
    <div class="hidden md:block">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-4 border-b border-neutral-200">
        <div class="col-span-5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Company Name
        </div>
        <div class="col-span-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Departments
        </div>
        <div class="col-span-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Employees
        </div>
        <div class="col-span-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Actions
        </div>
      </div>

      <!-- Table Body -->
      <div class="divide-y divide-neutral-200">
        <div
          v-for="company in companies"
          :key="company.id"
          class="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-neutral-50 transition-colors"
        >
          <!-- Company Name with Avatar -->
          <div class="col-span-5 flex items-center gap-3">
            <div 
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm',
                getAvatarColor(company.name)
              ]"
            >
              {{ getInitials(company.name) }}
            </div>
            <div>
              <div class="font-semibold text-neutral-900">{{ company.name }}</div>
            </div>
          </div>

          <!-- Departments -->
          <div class="col-span-3 flex items-center">
            <span class="text-neutral-700">{{ company.departmentCount }}</span>
          </div>

          <!-- Employees -->
          <div class="col-span-2 flex items-center">
            <span class="text-neutral-700">{{ company.employeeCount.toLocaleString() }}</span>
          </div>

          <!-- Actions -->
          <div class="col-span-2 flex items-center gap-3">
            <button
              @click="emit('view', company.id)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="View"
            >
              <EyeIcon class="w-5 h-5 text-neutral-500" />
            </button>
            <button
              v-if="userRole !== 'employee'"
              @click="emit('edit', company)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Edit"
            >
              <PencilIcon class="w-5 h-5 text-neutral-500" />
            </button>
            <button
              v-if="userRole === 'admin'"
              @click="emit('delete', company.id)"
              class="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Delete"
            >
              <TrashIcon class="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Card View (visible on mobile only) -->
    <div class="md:hidden divide-y divide-neutral-200">
      <div
        v-for="company in companies"
        :key="company.id"
        class="p-4 hover:bg-neutral-50 transition-colors"
      >
        <!-- Company Header -->
        <div class="flex items-center gap-3 mb-3">
          <div 
            :class="[
              'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0',
              getAvatarColor(company.name)
            ]"
          >
            {{ getInitials(company.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-neutral-900 truncate">{{ company.name }}</div>
          </div>
        </div>

        <!-- Company Stats -->
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="bg-neutral-50 rounded-lg p-3">
            <div class="text-xs text-neutral-500">Departments</div>
            <div class="text-lg font-semibold text-neutral-800">{{ company.departmentCount }}</div>
          </div>
          <div class="bg-neutral-50 rounded-lg p-3">
            <div class="text-xs text-neutral-500">Employees</div>
            <div class="text-lg font-semibold text-neutral-800">{{ company.employeeCount.toLocaleString() }}</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="emit('view', company.id)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-colors text-sm"
          >
            <EyeIcon class="w-4 h-4" />
            View
          </button>
          <button
            v-if="userRole !== 'employee'"
            @click="emit('edit', company)"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-sm"
          >
            <PencilIcon class="w-4 h-4" />
            Edit
          </button>
          <button
            v-if="userRole === 'admin'"
            @click="emit('delete', company.id)"
            class="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <TrashIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="companies.length === 0" class="py-12 text-center">
      <p class="text-neutral-400">No companies found</p>
    </div>
  </div>
</template>