<template>
  <div class="sales-chart">
    <Line :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartRef = ref(null)

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Sales',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderColor: 'rgba(102, 126, 234, 1)',
      data: [12, 19, 3, 5, 2, 3, 9],
      tension: 0.4,
      borderWidth: 2,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(102, 126, 234, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}
</script>

<style scoped>
.sales-chart {
  width: 100%;
  height: 300px;
}
</style>
