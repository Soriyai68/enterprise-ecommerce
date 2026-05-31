<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-input placeholder="Search categories..." style="width: 200px" clearable />
        <el-button type="primary">Add Category</el-button>
      </div>
    </template>
    <el-table :data="categories" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" min-width="200" />
      <el-table-column prop="products" label="Products" width="100" />
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

const categories = ref([
  { id: 1, name: 'Electronics', products: 156 },
  { id: 2, name: 'Clothing', products: 289 },
  { id: 3, name: 'Home & Garden', products: 124 },
  { id: 4, name: 'Sports', products: 87 }
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
