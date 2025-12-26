<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'
import { useCompaniesStore } from '@/store/companies'
import { useEmployeesStore } from '@/store/employees'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const companiesStore = useCompaniesStore()
const employeesStore = useEmployeesStore()

// Responsive bar thickness
const windowWidth = ref(window.innerWidth)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

// Bar thickness based on screen size
const barThickness = computed(() => {
  if (windowWidth.value < 640) return 40  // Mobile (sm)
  if (windowWidth.value < 1024) return 60  // Tablet (md)
  return 100  // Desktop (lg+)
})

// Calculate employee count per company and get Top 5
const companyDistribution = computed(() => {
  // Count employees for each company
  const companiesWithCount = companiesStore.companies.map(company => ({
    name: company.name,
    count: employeesStore.employees.filter(emp => emp.companyId === company.id).length
  }))
  
  // Sort by employee count (descending) and take top 5
  return companiesWithCount
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

// Get max value for track effect
const maxValue = computed(() => {
  const values = companyDistribution.value.map(d => d.count)
  return values.length > 0 ? Math.max(...values) * 1.2 : 100
})


const chartData = computed(() => {
  const labels = companyDistribution.value.map(d => d.name)
  const data = companyDistribution.value.map(d => d.count)

  return {
    labels,
    datasets: [
      // Background tracks (light green) - ORDER 1 (behind)
      {
        label: 'Track',
        data: data.map(() => maxValue.value),
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        barThickness: barThickness.value,  // ← Responsive!
        order: 1,  // ← Render first (behind)
      },
      // Actual data bars (dark green) - ORDER 0 (front)
      {
        label: 'Employees',
        data,
        backgroundColor: '#2D5A43',
        borderRadius: 12,
        barThickness: barThickness.value,  // ← Responsive!
        order: 0,  // ← Render second (in front)
      }
    ]
  }
})

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
     datalabels: {
      display: false  // ← إخفاء الأرقام على الـ bars
    },
    tooltip: {
      filter: (tooltipItem) => {
        // Only show tooltip for actual data, not track
        return tooltipItem.datasetIndex === 1
      },
      backgroundColor: '#1A202C',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff'
    }
  },
  scales: {
    y: {
      display: false,
      beginAtZero: true,
      max: maxValue.value,
      stacked: false
    },
    x: {
      stacked: true,  // ← Stack على نفس المكان
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        color: '#4A5568',
        font: {
          size: 12
        }
      }
    }
  }
}))
</script>

<template>
  <div class="h-80">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>