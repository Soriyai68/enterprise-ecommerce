<template>
  <el-card>
    <template #header>
      <span>Payments Management</span>
    </template>
    <el-table :data="payments" stripe>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="date" label="Date" width="150" />
      <el-table-column prop="amount" label="Amount">
        <template #default="{ row }">
          <span class="amount">${{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="method" label="Method" width="120" />
      <el-table-column prop="status" label="Status">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const payments = ref([
  { id: 'PAY001', date: '2024-01-15', amount: '234.50', method: 'Credit Card', status: 'Completed' },
  { id: 'PAY002', date: '2024-01-14', amount: '189.00', method: 'PayPal', status: 'Completed' },
  { id: 'PAY003', date: '2024-01-13', amount: '456.75', method: 'Bank Transfer', status: 'Pending' }
])

const getStatusType = (status) => {
  return status === 'Completed' ? 'success' : 'warning'
}
</script>

<style scoped>
.amount {
  color: #67c23a;
  font-weight: 600;
}
</style>
