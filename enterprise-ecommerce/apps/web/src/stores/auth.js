import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/api/api-client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const userName = computed(() => {
  if (user.value?.firstName && user.value?.lastName) {
    return `${user.value.firstName} ${user.value.lastName}`
  }
  return user.value?.name || 'Admin'
})

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      token.value = response.data.data.accessToken
      user.value = response.data.data.user
      localStorage.setItem('token', token.value)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    delete apiClient.defaults.headers.common['Authorization']
  }

  const register = async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getProfile = async () => {
    try {
      const response = await apiClient.get('/auth/profile')
      user.value = response.data.data.user
      return response.data
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData)
      user.value = response.data.user
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Initialize token in headers if exists
  if (token.value) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    user,
    token,
    isAuthenticated,
    userName,
    login,
    logout,
    register,
    getProfile,
    updateProfile
  }
})
