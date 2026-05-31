<template>
  <div class="products-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <el-input
            v-model="searchQuery"
            placeholder="Search products..."
            style="width: 200px"
            prefix-icon="Search"
            clearable
          />
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            Add Product
          </el-button>
        </div>
      </template>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'id', order: 'descending' }"
      >
        <el-table-column prop="id" label="ID" width="80" sortable />
        <el-table-column prop="name" label="Name" min-width="200" />
        <el-table-column prop="category" label="Category" min-width="120" />
        <el-table-column prop="price" label="Price" min-width="100">
          <template #default="{ row }">
            <span class="price">${{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="Stock" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.stock > 10 ? 'success' : 'warning'">{{ row.stock }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" min-width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'Active' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Action" min-width="150">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleEdit(row)">Edit</el-button>
            <el-button text type="danger" size="small" @click="handleDelete(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        class="mt-3"
      />
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="showAddDialog" :title="isEdit ? 'Edit Product' : 'Add Product'" width="60%">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="Name" required>
          <el-input v-model="formData.name" placeholder="Product name" />
        </el-form-item>
        <el-form-item label="Category" required>
          <el-select v-model="formData.category" placeholder="Select category">
            <el-option label="Electronics" value="electronics" />
            <el-option label="Clothing" value="clothing" />
            <el-option label="Home & Garden" value="home" />
          </el-select>
        </el-form-item>
        <el-form-item label="Price" required>
          <el-input-number v-model="formData.price" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item label="Stock" required>
          <el-input-number v-model="formData.stock" :min="0" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="formData.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="formData.status">
            <el-option label="Active" value="Active" />
            <el-option label="Inactive" value="Inactive" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span>
          <el-button @click="showAddDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleSave">Save</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)
const showAddDialog = ref(false)
const isEdit = ref(false)

const tableData = ref([
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 79.99, stock: 45, status: 'Active' },
  { id: 2, name: 'USB-C Cable', category: 'Electronics', price: 12.99, stock: 150, status: 'Active' },
  { id: 3, name: 'Laptop Stand', category: 'Home', price: 49.99, stock: 23, status: 'Active' },
  { id: 4, name: 'Coffee Mug', category: 'Home', price: 14.99, stock: 5, status: 'Active' },
  { id: 5, name: 'T-Shirt', category: 'Clothing', price: 29.99, stock: 0, status: 'Inactive' },
])

const formData = ref({
  id: null,
  name: '',
  category: '',
  price: 0,
  stock: 0,
  description: '',
  status: 'Active'
})

const handleEdit = (row) => {
  isEdit.value = true
  formData.value = { ...row }
  showAddDialog.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `Are you sure to delete "${row.name}"?`,
    'Warning',
    { confirmButtonText: 'OK', cancelButtonText: 'Cancel', type: 'warning' }
  ).then(() => {
    ElMessage.success('Product deleted successfully')
  }).catch(() => {})
}

const handleSave = () => {
  ElMessage.success(isEdit.value ? 'Product updated successfully' : 'Product added successfully')
  showAddDialog.value = false
  isEdit.value = false
  formData.value = { id: null, name: '', category: '', price: 0, stock: 0, description: '', status: 'Active' }
}
</script>

<style scoped>
.products-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .price {
    color: #67c23a;
    font-weight: 600;
  }

  .mt-3 {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
