<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
    </div>
    <input
      type="text"
      :value="modelValue"
      @input="handleInput"
      placeholder="Search companies by name, industry..."
      class="w-full pl-11 pr-4 py-3 bg-card border-0 rounded-2xl shadow-soft focus:shadow-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all text-neutral-800 placeholder-neutral-400"
    />
  </div>
</template>