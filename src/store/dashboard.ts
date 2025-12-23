import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboard', () => {
  // Mock data (سنستبدلها بـ API لاحقاً)
  const totalCompanies = ref(14)
  const totalDepartments = ref(8)
  const totalEmployees = ref(1240)
  const newHires = ref(12)

  // Trends (percentage change)
  const companiesTrend = ref(2.5)
  const departmentsTrend = ref(0)
  const employeesTrend = ref(5)
  const hiresTrend = ref(10)

  // Department distribution for chart
  const departmentDistribution = ref([
    { name: 'ENG', count: 350 },
    { name: 'SALES', count: 420 },
    { name: 'HR', count: 180 },
    { name: 'MKTG', count: 200 },
    { name: 'OPS', count: 90 }
  ])

  // Hiring pipeline status
    const hiringStatus = ref({
    applicationReceived: 45,
    interviewScheduled: 18,
    hired: 12,
    notAccepted: 15
    })

  return {
    totalCompanies,
    totalDepartments,
    totalEmployees,
    newHires,
    companiesTrend,
    departmentsTrend,
    employeesTrend,
    hiresTrend,
    departmentDistribution,
    hiringStatus
  }
})