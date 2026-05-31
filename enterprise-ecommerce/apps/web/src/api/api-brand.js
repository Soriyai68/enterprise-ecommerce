import { apiClient } from './api-client'

export const brandApi = {
  getAllBrands: (params = {}) => apiClient.get('/products/brands', { params }),
  getBrandById: (id) => apiClient.get(`/products/brands/${id}`),
  createBrand: (data) => apiClient.post('/products/brands', data),
  updateBrand: (id, data) => apiClient.put(`/products/brands/${id}`, data),
  deleteBrand: (id) => apiClient.delete(`/products/brands/${id}`)
}

export default brandApi