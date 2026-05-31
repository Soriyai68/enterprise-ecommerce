<template>
  <el-card>
    <el-descriptions title="Product Details" :column="2" border>
      <el-descriptions-item label="ID">{{ product.id }}</el-descriptions-item>
      <el-descriptions-item label="Status">
        <el-tag :type="product.status === 'Active' ? 'success' : 'info'">{{ product.status }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Name">{{ product.name }}</el-descriptions-item>
      <el-descriptions-item label="Category">{{ product.category }}</el-descriptions-item>
      <el-descriptions-item label="Price">${{ product.price }}</el-descriptions-item>
      <el-descriptions-item label="Stock">{{ product.stock }}</el-descriptions-item>
      <el-descriptions-item label="Description" :span="2">{{ product.description }}</el-descriptions-item>
      <el-descriptions-item label="Created" :span="2">{{ product.created }}</el-descriptions-item>
    </el-descriptions>

    <div style="margin-top: 20px">
      <el-button type="primary">Edit</el-button>
      <el-button>Cancel</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const product = ref({
  id: 1,
  name: 'Premium Headphones',
  category: 'Electronics',
  price: 79.99,
  stock: 45,
  status: 'Active',
  description: 'High-quality wireless headphones with noise cancellation',
  created: '2024-01-10'
})
</script>
