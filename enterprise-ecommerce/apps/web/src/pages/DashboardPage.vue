<template>
  <div class="dashboard-page">
    <!-- Stats Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card primary">
          <div class="stat-header">
            <el-icon class="stat-icon"><ShoppingCart /></el-icon>
            <span>Total Sales</span>
          </div>
          <div class="stat-value">${{ formatNumber(stats.totalSales) }}</div>
          <div class="stat-change">+12% from last month</div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card success">
          <div class="stat-header">
            <el-icon class="stat-icon"><DocumentCopy /></el-icon>
            <span>Total Orders</span>
          </div>
          <div class="stat-value">{{ formatNumber(stats.totalOrders) }}</div>
          <div class="stat-change">+8% from last month</div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card warning">
          <div class="stat-header">
            <el-icon class="stat-icon"><User /></el-icon>
            <span>Total Customers</span>
          </div>
          <div class="stat-value">{{ formatNumber(stats.totalCustomers) }}</div>
          <div class="stat-change">+15% from last month</div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card danger">
          <div class="stat-header">
            <el-icon class="stat-icon"><Goods /></el-icon>
            <span>Products</span>
          </div>
          <div class="stat-value">{{ formatNumber(stats.totalProducts) }}</div>
          <div class="stat-change">5 new added today</div>
        </div>
      </el-col>
    </el-row>

    <!-- Charts -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :md="14">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>Sales Overview</span>
              <el-button-group>
                <el-button text size="small" type="primary">Day</el-button>
                <el-button text size="small">Week</el-button>
                <el-button text size="small">Month</el-button>
              </el-button-group>
            </div>
          </template>
          <div class="chart-container">
            <SalesChart />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="10">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>Revenue Distribution</span>
            </div>
          </template>
          <div class="chart-container">
            <RevenueChart />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Orders & Top Products -->
    <el-row :gutter="20" class="data-row">
      <el-col :xs="24" :md="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Recent Orders</span>
              <router-link to="/orders" class="view-all">View All →</router-link>
            </div>
          </template>
          <el-table :data="recentOrders" stripe style="width: 100%">
            <el-table-column prop="id" label="Order ID" min-width="100" />
            <el-table-column prop="customer" label="Customer" min-width="150" />
            <el-table-column prop="amount" label="Amount" min-width="100">
              <template #default="{ row }">
                <span class="amount">${{ row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="Status" min-width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Action" min-width="100">
              <template #default>
                <el-button text type="primary" size="small">View</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Top Products</span>
            </div>
          </template>
          <div class="product-list">
            <div v-for="product in topProducts" :key="product.id" class="product-item">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-sales">{{ product.sales }} sales</div>
              </div>
              <div class="product-revenue">${{ product.revenue }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import {
  ShoppingCart,
  DocumentCopy,
  User,
  Goods
} from '@element-plus/icons-vue'
import SalesChart from '@/components/charts/SalesChart.vue'
import RevenueChart from '@/components/charts/RevenueChart.vue'

const dashboardStore = useDashboardStore()

const stats = ref({
  totalSales: 45678,
  totalOrders: 342,
  totalCustomers: 1250,
  totalProducts: 856,
  revenue: 45678,
  avgOrderValue: 134.56
})

const recentOrders = ref([
  { id: '#ORD001', customer: 'John Doe', amount: '$234.50', status: 'Completed' },
  { id: '#ORD002', customer: 'Jane Smith', amount: '$189.00', status: 'Pending' },
  { id: '#ORD003', customer: 'Bob Johnson', amount: '$456.75', status: 'Completed' },
  { id: '#ORD004', customer: 'Alice Brown', amount: '$123.45', status: 'Processing' },
  { id: '#ORD005', customer: 'Charlie Davis', amount: '$567.89', status: 'Completed' }
])

const topProducts = ref([
  { id: 1, name: 'Premium Headphones', image: 'https://via.placeholder.com/40', sales: 145, revenue: '$12,450' },
  { id: 2, name: 'Wireless Mouse', image: 'https://via.placeholder.com/40', sales: 98, revenue: '$4,900' },
  { id: 3, name: 'USB-C Cable', image: 'https://via.placeholder.com/40', sales: 234, revenue: '$5,850' },
  { id: 4, name: 'Laptop Stand', image: 'https://via.placeholder.com/40', sales: 67, revenue: '$4,700' }
])

onMounted(async () => {
  await dashboardStore.fetchDashboardStats()
})

const formatNumber = (value) => {
  return value.toLocaleString()
}

const getStatusType = (status) => {
  const statusMap = {
    'Completed': 'success',
    'Pending': 'warning',
    'Processing': 'info',
    'Cancelled': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  border-radius: 8px;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    right: -40px;
    top: -40px;
    width: 100px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    font-size: 14px;
    opacity: 0.9;

    .stat-icon {
      font-size: 20px;
    }
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .stat-change {
    font-size: 12px;
    opacity: 0.8;
  }

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.success {
    background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
    color: #333;
  }

  &.warning {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    color: #333;
  }

  &.danger {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  :deep(.el-card__header) {
    border-bottom: 1px solid #e6e6e6;
    padding: 15px 20px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-row {
  margin-bottom: 20px;
}

.amount {
  color: #67c23a;
  font-weight: 600;
}

.view-all {
  color: #409eff;
  text-decoration: none;
  font-size: 12px;

  &:hover {
    color: #66b1ff;
  }
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 4px;
  background-color: #f5f7fa;
  transition: all 0.3s;

  &:hover {
    background-color: #e6f7ff;
  }

  .product-image {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: cover;
  }

  .product-info {
    flex: 1;

    .product-name {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .product-sales {
      font-size: 12px;
      color: #999;
    }
  }

  .product-revenue {
    font-size: 14px;
    font-weight: 600;
    color: #67c23a;
  }
}

:deep(.el-table) {
  --el-table-header-bg-color: #f5f7fa;
}
</style>
