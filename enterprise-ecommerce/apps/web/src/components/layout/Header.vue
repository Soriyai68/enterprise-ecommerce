<template>
  <el-header class="header">
    <div class="header-left">
      <span class="breadcrumb-text">{{ pageTitle }}</span>
    </div>

    <div class="header-right">
      <el-input
        v-model="searchQuery"
        placeholder="Search..."
        style="width: 200px"
        prefix-icon="Search"
        clearable
        @input="handleSearch"
      />

      <el-dropdown>
        <div class="user-info">
          <el-avatar 
            :src="userAvatar" 
            size="small"
            shape="circle"
          />
          <span class="user-name">{{ userName }}</span>
          <el-icon style="margin-left: 4px"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="User" @click="goToProfile">Profile</el-dropdown-item>
            <el-dropdown-item icon="Setting">Settings</el-dropdown-item>
            <el-divider style="margin: 5px 0" />
            <el-dropdown-item icon="SwitchButton" @click="handleLogout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button-group>
        <el-tooltip content="Full Screen">
          <el-button icon="FullScreen" @click="toggleFullscreen" text />
        </el-tooltip>
        <el-tooltip content="Theme">
          <el-button icon="Moon" text />
        </el-tooltip>
      </el-button-group>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const searchQuery = ref('')

const pageTitle = computed(() => {
  const titles = {
    Dashboard: 'Dashboard',
    Products: 'Products Management',
    ProductDetail: 'Product Details',
    Categories: 'Categories',
    Brands: 'Brands',
    Orders: 'Orders',
    OrderDetail: 'Order Details',
    Payments: 'Payments',
    Analytics: 'Analytics & Reports',
    Profile: 'My Profile'
  }
  return titles[route.name] || 'Dashboard'
})

const userName = computed(() => authStore.userName)
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0f5b99a86f122131e64a2b3b897.png')

const handleSearch = () => {
  ElMessage.info(`Searching for: ${searchQuery.value}`)
}

const goToProfile = () => {
  router.push('/profile')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.header-left {
  flex: 1;
}

.breadcrumb-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

:deep(.el-input) {
  --el-input-border-color: #e6e6e6;
  --el-input-border-radius: 4px;
}
</style>
