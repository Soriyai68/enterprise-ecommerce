import { apiClient } from './api-client'

export const categoryApi = {
  getAllCategories: (params = {}) => apiClient.get('/products/categories', { params }),
  getCategoryById: (id) => apiClient.get(`/products/categories/${id}`),
  createCategory: (data) => apiClient.post('/products/categories', data),
  updateCategory: (id, data) => apiClient.put(`/products/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/products/categories/${id}`),
  bulkCreateCategories: (data) => apiClient.post('/products/categories/bulk', data),
  getCategoryStats: (id) => apiClient.get(`/products/categories/${id}/stats`)
}

export default categoryApi