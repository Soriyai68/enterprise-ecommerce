import { apiClient } from './api-client'

export const productApi = {
  getAllProducts: (params = {}) => apiClient.get('/products/products', { params }),
  getProductById: (id) => apiClient.get(`/products/products/${id}`),
  createProduct: (data) => apiClient.post('/products/products', data),
  updateProduct: (id, data) => apiClient.put(`/products/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/products/products/${id}`)
}

export default productApi