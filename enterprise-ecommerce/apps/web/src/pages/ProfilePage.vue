<template>
  <el-row :gutter="20">
    <el-col :xs="24" :md="6">
      <el-card class="profile-card">
        <template #header>
          <span>Profile Picture</span>
        </template>
        <div class="profile-picture">
          <el-avatar 
            :src="user.avatar" 
            size="large"
            shape="circle"
          />
          <el-button type="primary" text @click="uploadPicture">Change</el-button>
        </div>
      </el-card>
    </el-col>

    <el-col :xs="24" :md="18">
      <el-card>
        <template #header>
          <span>My Profile</span>
        </template>
        <el-form :model="form" label-width="120px">
          <el-form-item label="Name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="form.email" type="email" />
          </el-form-item>
          <el-form-item label="Phone">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="Address">
            <el-input v-model="form.address" type="textarea" />
          </el-form-item>
          <el-form-item label="Joined">
            <el-input v-model="form.joined" disabled />
          </el-form-item>
          <el-button type="primary">Save Changes</el-button>
        </el-form>
      </el-card>

      <el-card style="margin-top: 20px">
        <template #header>
          <span>Change Password</span>
        </template>
        <el-form label-width="120px">
          <el-form-item label="Old Password">
            <el-input type="password" show-password />
          </el-form-item>
          <el-form-item label="New Password">
            <el-input type="password" show-password />
          </el-form-item>
          <el-form-item label="Confirm Password">
            <el-input type="password" show-password />
          </el-form-item>
          <el-button type="primary">Update Password</el-button>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from 'vue'

const user = ref({
  avatar: 'https://cube.elemecdn.com/0/88/03b0f5b99a86f122131e64a2b3b897.png'
})

const form = ref({
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Admin Street, New York, NY 10001',
  joined: '2024-01-01'
})

const uploadPicture = () => {
  alert('Picture upload functionality')
}
</script>

<style scoped>
.profile-card {
  text-align: center;

  .profile-picture {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}
</style>
