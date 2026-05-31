<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-input v-model="search" placeholder="Search categories..." style="width: 200px" clearable />
        <el-button type="primary" @click="openAddDialog">Add Category</el-button>
      </div>
    </template>

    <el-table :data="filteredCategories" stripe>
      <el-table-column type="index" label="ID" width="80" />
      <el-table-column prop="category_name" label="Name" min-width="200" />
      <el-table-column label="Products" width="100">
        <template #default="{ row }">
          {{ row.products?.length || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click="editCategory(row)">Edit</el-button>
          <el-button text type="danger" size="small" @click="deleteCategory(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Category' : 'Add Category'" width="500px" @close="resetForm">
    <el-form :model="categoryForm" label-position="top">
      <el-form-item label="Category Name" required>
        <el-input v-model="categoryForm.category_name" placeholder="Enter category name" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="categoryForm.description" type="textarea" placeholder="Enter description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="saveCategory">Save</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categoryApi } from '@/api/api-category'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const categories = ref([])
const loading = ref(false)
const search = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const categoryForm = ref({
  id: null,
  category_name: '',
  description: ''
})

const filteredCategories = computed(() => {
  if (!search.value) return categories.value
  return categories.value.filter(c => 
    c.category_name?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const loadCategories = async () => {
  loading.value = true
  try {
    const response = await categoryApi.getAllCategories()
    categories.value = response.data?.data?.categories || []
  } catch (error) {
    ElMessage.error('Failed to load categories')
    console.error('Failed to load categories:', error)
  } finally {
    loading.value = false
  }
}

watch(() => route.path, loadCategories)

const saveCategory = async () => {
  if (!categoryForm.value.category_name) {
    ElMessage.error('Category name is required')
    return
  }

  try {
    if (isEdit.value) {
      await categoryApi.updateCategory(categoryForm.value.id, {
        category_name: categoryForm.value.category_name,
        description: categoryForm.value.description
      })
      ElMessage.success('Category updated successfully')
    } else {
      await categoryApi.createCategory({
        category_name: categoryForm.value.category_name,
        description: categoryForm.value.description
      })
      ElMessage.success('Category created successfully')
    }
    dialogVisible.value = false
    loadCategories()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Failed to save category')
  }
}

const editCategory = (row) => {
  isEdit.value = true
  categoryForm.value = {
    id: row.category_id,
    category_name: row.category_name,
    description: row.description || ''
  }
  dialogVisible.value = true
}

const deleteCategory = async (row) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this category?', 'Confirm', {
      type: 'warning'
    })
    await categoryApi.deleteCategory(row.category_id)
    ElMessage.success('Category deleted successfully')
    loadCategories()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete category')
    }
  }
}

const resetForm = () => {
  isEdit.value = false
  categoryForm.value = {
    id: null,
    category_name: '',
    description: ''
  }
}

const openAddDialog = () => {
  resetForm()
  dialogVisible.value = true
}

onMounted(loadCategories)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
