<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <el-input v-model="search" placeholder="Search brands..." style="width: 200px" clearable />
        <el-button type="primary" @click="openAddDialog">Add Brand</el-button>
      </div>
    </template>

    <el-table :data="filteredBrands" stripe>
      <el-table-column type="index" label="ID" width="80" />
      <el-table-column prop="brand_name" label="Name" min-width="200" />
      <el-table-column label="Products" width="100">
        <template #default="{ row }">
          {{ row.products?.length || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click="editBrand(row)">Edit</el-button>
          <el-button text type="danger" size="small" @click="deleteBrand(row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" :title="isEdit ? 'Edit Brand' : 'Add Brand'" width="500px" @close="resetForm">
    <el-form :model="brandForm" label-position="top">
      <el-form-item label="Brand Name" required>
        <el-input v-model="brandForm.brand_name" placeholder="Enter brand name" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="brandForm.description" type="textarea" placeholder="Enter description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="saveBrand">Save</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { brandApi } from '@/api/api-brand'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const brands = ref([])
const loading = ref(false)
const search = ref('')
const dialogVisible = ref(false)
const isEdit = ref(false)
const brandForm = ref({
  id: null,
  brand_name: '',
  description: ''
})

const filteredBrands = computed(() => {
  if (!search.value) return brands.value
  return brands.value.filter(b => 
    b.brand_name?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const loadBrands = async () => {
  loading.value = true
  try {
    const response = await brandApi.getAllBrands({ limit: 100 })
    brands.value = response.data?.data?.brands || []
  } catch (error) {
    ElMessage.error('Failed to load brands')
    console.error('Failed to load brands:', error)
  } finally {
    loading.value = false
  }
}

watch(() => route.path, loadBrands)

const saveBrand = async () => {
  if (!brandForm.value.brand_name) {
    ElMessage.error('Brand name is required')
    return
  }

  try {
    if (isEdit.value) {
      await brandApi.updateBrand(brandForm.value.id, {
        brand_name: brandForm.value.brand_name,
        description: brandForm.value.description
      })
      ElMessage.success('Brand updated successfully')
    } else {
      await brandApi.createBrand({
        brand_name: brandForm.value.brand_name,
        description: brandForm.value.description
      })
      ElMessage.success('Brand created successfully')
    }
    dialogVisible.value = false
    loadBrands()
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Failed to save brand')
  }
}

const editBrand = (row) => {
  isEdit.value = true
  brandForm.value = {
    id: row.brand_id,
    brand_name: row.brand_name,
    description: row.description || ''
  }
  dialogVisible.value = true
}

const deleteBrand = async (row) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this brand?', 'Confirm', {
      type: 'warning'
    })
    await brandApi.deleteBrand(row.brand_id)
    ElMessage.success('Brand deleted successfully')
    loadBrands()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete brand')
    }
  }
}

const resetForm = () => {
  isEdit.value = false
  brandForm.value = {
    id: null,
    brand_name: '',
    description: ''
  }
}

const openAddDialog = () => {
  resetForm()
  dialogVisible.value = true
}

onMounted(loadBrands)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>