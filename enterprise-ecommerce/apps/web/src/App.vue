<template>
  <router-view v-if="isAuthenticated" />
  <LoginPage v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoginPage from '@/pages/LoginPage.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
}

html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
