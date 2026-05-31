<template>
  <div class="revenue-chart">
    <Doughnut :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartRef = ref(null)

const chartData = {
  labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Others'],
  datasets: [
    {
      backgroundColor: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(132, 250, 176, 0.8)',
        'rgba(250, 112, 154, 0.8)',
        'rgba(255, 193, 7, 0.8)',
        'rgba(144, 202, 249, 0.8)'
      ],
      data: [30, 25, 20, 15, 10]
    }
  ]
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}
</script>

<style scoped>
.revenue-chart {
  width: 100%;
  height: 300px;
}
</style>
