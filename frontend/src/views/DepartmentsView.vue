<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDepartmentsStore } from "@/store/departments";
import { useToastStore } from "@/store/toast";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import DepartmentSearchBar from "@/components/departments/DepartmentSearchBar.vue";
import DepartmentTable from "@/components/departments/DepartmentTable.vue";
import DepartmentModal from "@/components/departments/DepartmentModal.vue";
import ConfirmDialog from "@/components/common/ConfirmDialog.vue";
import type { Department } from "@/store/departments";
import { PlusIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/store/auth";

const router = useRouter();
const departmentsStore = useDepartmentsStore();
const toastStore = useToastStore();
const authStore = useAuthStore();

// Refresh data when component mounts
onMounted(() => {
  departmentsStore.fetchDepartments();
});

// Modal state
const isModalOpen = ref(false);
const editingDepartment = ref<Department | null>(null);

// Confirm dialog state
const isConfirmOpen = ref(false);
const departmentToDelete = ref<Department | null>(null);

// Search
const searchQuery = computed({
  get: () => departmentsStore.searchQuery,
  set: (value) => departmentsStore.setSearchQuery(value),
});

// Pagination
const paginationText = computed(() => {
  const start =
    (departmentsStore.currentPage - 1) * departmentsStore.itemsPerPage + 1;
  const end = Math.min(
    departmentsStore.currentPage * departmentsStore.itemsPerPage,
    departmentsStore.totalCount
  );
  return `Showing ${start} to ${end} of ${departmentsStore.totalCount} departments`;
});

// Actions
const openAddModal = () => {
  editingDepartment.value = null;
  isModalOpen.value = true;
};

const openEditModal = (department: Department) => {
  editingDepartment.value = department;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingDepartment.value = null;
};

const handleSave = (data: { name: string; companyId: string }) => {
  if (editingDepartment.value) {
    // Edit
    departmentsStore.updateDepartment(editingDepartment.value.id, data);
    toastStore.success(`${data.name} updated successfully!`);
  } else {
    // Add new - Server Scripts will calculate employee count automatically
    departmentsStore.addDepartment({
      name: data.name,
      companyId: data.companyId,
    });
    toastStore.success(`${data.name} added successfully!`);
  }
  closeModal();
};

const handleDelete = (id: string) => {
  const department = departmentsStore.getDepartmentById(id);
  if (!department) return;

  departmentToDelete.value = department;
  isConfirmOpen.value = true;
};

const confirmDelete = () => {
  if (!departmentToDelete.value) return;

  departmentsStore.deleteDepartment(departmentToDelete.value.id);
  toastStore.info(`${departmentToDelete.value.name} deleted`);

  isConfirmOpen.value = false;
  departmentToDelete.value = null;
};

const cancelDelete = () => {
  isConfirmOpen.value = false;
  departmentToDelete.value = null;
};

const handleView = (id: string) => {
  router.push(`/departments/${id}`);
};
</script>

<template>
  <DashboardLayout>
    <div class="p-4 space-y-4">
      <!-- Header -->
      <div class="bg-white shadow-soft rounded-2xl px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-neutral-800">
              Departments
            </h1>
            <p class="text-xs md:text-sm text-neutral-600 mt-1">
              Manage organizational departments and their structure
            </p>
          </div>

          <!-- Add Button -->
          <button
            v-if="authStore.userRole !== 'employee'"
            @click="openAddModal"
            class="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full shadow-soft transition-colors text-sm md:text-base min-w-[44px]"
          >
            <PlusIcon class="w-5 h-5" />
            <span class="hidden md:inline">Add New Department</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div>
        <!-- Search -->
        <DepartmentSearchBar v-model="searchQuery" class="mb-4" />

        <!-- Table -->
        <DepartmentTable
          :departments="departmentsStore.paginatedDepartments"
          :user-role="authStore.userRole"
          @view="handleView"
          @edit="openEditModal"
          @delete="handleDelete"
        />

        <!-- Pagination -->
        <div
          class="flex items-center justify-between px-6 py-4 bg-white border-t border-neutral-200 rounded-b-2xl shadow-soft"
        >
          <p class="text-sm text-neutral-600">{{ paginationText }}</p>

          <div class="flex gap-2">
            <button
              @click="departmentsStore.previousPage()"
              :disabled="departmentsStore.currentPage === 1"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                departmentsStore.currentPage === 1
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
              ]"
            >
              Previous
            </button>
            <button
              @click="departmentsStore.nextPage()"
              :disabled="
                departmentsStore.currentPage >= departmentsStore.totalPages
              "
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                departmentsStore.currentPage >= departmentsStore.totalPages
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700',
              ]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <DepartmentModal
      :is-open="isModalOpen"
      :department="editingDepartment"
      @close="closeModal"
      @save="handleSave"
    />

    <ConfirmDialog
      :is-open="isConfirmOpen"
      title="Delete Department"
      :message="
        departmentToDelete
          ? `Are you sure you want to delete ${departmentToDelete.name}? This action cannot be undone.`
          : ''
      "
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </DashboardLayout>
</template>
