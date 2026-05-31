<template>
  <div class="orders-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-input
            placeholder="Search orders..."
            style="width: 200px"
            prefix-icon="Search"
            clearable
          />
          <el-button type="primary">Export</el-button>
        </div>
      </template>

      <el-table :data="orders" stripe style="width: 100%">
        <el-table-column prop="id" label="Order ID" width="100" />
        <el-table-column prop="date" label="Date" width="150" />
        <el-table-column prop="customer" label="Customer" min-width="150" />
        <el-table-column prop="amount" label="Amount" width="120">
          <template #default="{ row }">
            <span class="amount">${{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action">
          <template #default>
            <el-button text type="primary" size="small">View</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
const orders = [
  { id: '#ORD001', date: '2024-01-15', customer: 'John Doe', amount: '234.50', status: 'Delivered' },
  { id: '#ORD002', date: '2024-01-14', customer: 'Jane Smith', amount: '189.00', status: 'Processing' },
  { id: '#ORD003', date: '2024-01-13', customer: 'Bob Johnson', amount: '456.75', status: 'Shipped' },
  { id: '#ORD004', date: '2024-01-12', customer: 'Alice Brown', amount: '123.45', status: 'Pending' },
  { id: '#ORD005', date: '2024-01-11', customer: 'Charlie Davis', amount: '567.89', status: 'Delivered' }
]

const getStatusType = (status) => {
  const map = { 'Delivered': 'success', 'Processing': 'info', 'Shipped': 'warning', 'Pending': 'info', 'Cancelled': 'danger' }
  return map[status] || 'info'
}
</script>

<style scoped>
.orders-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .amount {
    color: #67c23a;
    font-weight: 600;
  }
}
</style>
