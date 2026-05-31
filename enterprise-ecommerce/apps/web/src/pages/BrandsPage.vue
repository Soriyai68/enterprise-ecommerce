<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-input placeholder="Search brands..." style="width: 200px" clearable />
        <el-button type="primary">Add Brand</el-button>
      </div>
    </template>
    <el-table :data="brands" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" min-width="200" />
      <el-table-column prop="products" label="Products" width="100" />
      <el-table-column prop="status" label="Status">
        <template #default="{ row }">
          <el-tag :type="row.status === 'Active' ? 'success' : 'info'">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default>
          <el-button text type="primary" size="small">Edit</el-button>
          <el-button text type="danger" size="small">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

const brands = ref([
  { id: 1, name: 'Apple', products: 45, status: 'Active' },
  { id: 2, name: 'Samsung', products: 67, status: 'Active' },
  { id: 3, name: 'Sony', products: 34, status: 'Active' },
  { id: 4, name: 'LG', products: 28, status: 'Active' }
])
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
