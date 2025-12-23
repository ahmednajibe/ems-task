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
  type ChartOptions  // ← Type import
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

const chartData = computed(() => {
  const labels = dashboardStore.departmentDistribution.map(d => d.name)
  const data = dashboardStore.departmentDistribution.map(d => d.count)

  return {
    labels,
    datasets: [
      {
        label: 'Employees',
        data,
        backgroundColor: '#2D5A43',
        borderRadius: 8,
        barThickness: 40,
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
    tooltip: {
      backgroundColor: '#1A202C',
      padding: 12,
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: '#2D5A43',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#F5F5F5',
        drawBorder: false
      },
      ticks: {
        color: '#4A5568',
        font: {
          size: 12
        }
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false
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