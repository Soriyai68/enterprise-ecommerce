<template>
  <el-card>
    <el-descriptions title="Order Details" :column="2" border>
      <el-descriptions-item label="Order ID">#ORD001</el-descriptions-item>
      <el-descriptions-item label="Status">
        <el-tag type="success">Delivered</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Customer">John Doe</el-descriptions-item>
      <el-descriptions-item label="Email">john@example.com</el-descriptions-item>
      <el-descriptions-item label="Order Date">2024-01-15</el-descriptions-item>
      <el-descriptions-item label="Delivery Date">2024-01-18</el-descriptions-item>
      <el-descriptions-item label="Total Amount" :span="2">${{ total }}</el-descriptions-item>
    </el-descriptions>

    <h3 style="margin-top: 30px">Order Items</h3>
    <el-table :data="items" stripe>
      <el-table-column prop="name" label="Product" />
      <el-table-column prop="qty" label="Quantity" width="100" />
      <el-table-column prop="price" label="Price" width="100" />
      <el-table-column label="Total" width="100">
        <template #default="{ row }">
          ${{ row.qty * row.price }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
  { name: 'Headphones', qty: 1, price: 79.99 },
  { name: 'USB Cable', qty: 2, price: 12.99 }
])

const total = ref(105.97)
</script>
