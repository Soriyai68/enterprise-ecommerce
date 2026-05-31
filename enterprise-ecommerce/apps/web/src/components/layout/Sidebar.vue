<template>
  <el-aside width="240px" class="sidebar">
    <div class="logo">
      <div class="logo-icon">📊</div>
      <div class="logo-text">Admin Panel</div>
    </div>
    
    <el-menu 
      :default-active="activeMenu"
      @select="handleSelect"
      class="menu"
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
        <span>Dashboard</span>
      </el-menu-item>

      <el-sub-menu index="products">
        <template #title>
          <el-icon><ShoppingCart /></el-icon>
          <span>Products</span>
        </template>
        <el-menu-item index="products">View All</el-menu-item>
        <el-menu-item index="categories">Categories</el-menu-item>
        <el-menu-item index="brands">Brands</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="orders">
        <el-icon><DocumentCopy /></el-icon>
        <span>Orders</span>
      </el-menu-item>

      <el-menu-item index="payments">
        <el-icon><CreditCard /></el-icon>
        <span>Payments</span>
      </el-menu-item>

      <el-menu-item index="analytics">
        <el-icon><DataAnalysis /></el-icon>
        <span>Analytics</span>
      </el-menu-item>

      <el-divider />

      <el-menu-item index="profile">
        <el-icon><User /></el-icon>
        <span>Profile</span>
      </el-menu-item>

      <el-menu-item @click="handleLogout" index="logout">
        <el-icon><SwitchButton /></el-icon>
        <span>Logout</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeFilled,
  ShoppingCart,
  DocumentCopy,
  CreditCard,
  DataAnalysis,
  User,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeMenu = computed(() => route.name?.toLowerCase() || '/')

const handleSelect = (index) => {
  if (index === 'logout') return
  if (index.startsWith('/')) {
    router.push(index)
  } else if (index === '/') {
    router.push('/')
  } else if (index === 'products') {
    router.push('/products')
  } else if (index === 'categories') {
    router.push('/categories')
  } else if (index === 'brands') {
    router.push('/brands')
  } else if (index === 'orders') {
    router.push('/orders')
  } else if (index === 'payments') {
    router.push('/payments')
  } else if (index === 'analytics') {
    router.push('/analytics')
  } else if (index === 'profile') {
    router.push('/profile')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
  padding: 0;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #333;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 16px;
}

.menu {
  flex: 1;
  border: none;
  padding: 10px 0;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  height: 45px;
  line-height: 45px;
  color: #606266;
  transition: all 0.3s;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;
  color: #409eff;
}

:deep(.el-menu-item.is-active) {
  background-color: #e6f7ff !important;
  color: #409eff !important;
  border-right: 3px solid #409eff;
}

:deep(.el-menu) {
  background: transparent;
}
</style>
