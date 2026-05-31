import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '@/api/api-client'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenue: 0,
    avgOrderValue: 0
  })

  const chartData = ref({
    salesByDay: [],
    topProducts: [],
    revenueByCategory: [],
    orderStatus: []
  })

  const loading = ref(false)
  const error = ref(null)

  const fetchDashboardStats = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/analytics/dashboard')
      stats.value = response.data.stats || stats.value
      chartData.value = response.data.charts || chartData.value
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchSalesAnalytics = async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/sales', { params })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const fetchProductAnalytics = async (params = {}) => {
    try {
      const response = await apiClient.get('/analytics/products', { params })
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    stats,
    chartData,
    loading,
    error,
    fetchDashboardStats,
    fetchSalesAnalytics,
    fetchProductAnalytics
  }
})

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref(null)

  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/products/products', { params })
      products.value = response.data.data || []
      total.value = response.data.total || 0
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const getProductById = async (id) => {
    try {
      const response = await apiClient.get(`/products/products/${id}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const createProduct = async (productData) => {
    try {
      const response = await apiClient.post('/products/products', productData)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      const response = await apiClient.put(`/products/products/${id}`, productData)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteProduct = async (id) => {
    try {
      const response = await apiClient.delete(`/products/products/${id}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    products,
    total,
    loading,
    error,
    fetchProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
  }
})
