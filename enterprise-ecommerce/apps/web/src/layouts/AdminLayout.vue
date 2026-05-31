<template>
  <el-container class="admin-layout">
    <Sidebar />
    <el-container direction="vertical">
      <Header />
      <el-main class="main-content">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </Transition>
          </router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  background-color: #f5f7fa;
}

:deep(.el-container) {
  height: 100%;
}

:deep(.el-aside) {
  height: 100vh;
}

.main-content {
  overflow-y: auto;
  padding: 20px;
  background-color: #f5f7fa;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
