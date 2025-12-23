<script setup lang="ts">
import { computed } from 'vue'
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
import { useDashboardStore } from '@/store/dashboard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const dashboardStore = useDashboardStore()

// Get max value for track effect
const maxValue = computed(() => {
  const values = dashboardStore.departmentDistribution.map(d => d.count)
  return Math.max(...values) * 1.2
})

const chartData = computed(() => {
  const labels = dashboardStore.departmentDistribution.map(d => d.name)
  const data = dashboardStore.departmentDistribution.map(d => d.count)

  return {
    labels,
    datasets: [
      // Background tracks (light green) - ORDER 1 (behind)
      {
        label: 'Track',
        data: data.map(() => maxValue.value),
        backgroundColor: '#E8F5E8',
        borderRadius: 12,
        barThickness: 100,
        order: 1,  // ← Render first (behind)
      },
      // Actual data bars (dark green) - ORDER 0 (front)
      {
        label: 'Employees',
        data,
        backgroundColor: '#2D5A43',
        borderRadius: 12,
        barThickness: 100,
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