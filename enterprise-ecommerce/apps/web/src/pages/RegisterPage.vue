<template>
  <div class="register-container">
    <el-card class="register-card">
      <div class="register-header">
        <div class="register-logo">📊</div>
        <h1>Create Account</h1>
        <p>Sign up for admin access</p>
      </div>

      <el-form
        ref="formRef"
        :model="registerForm"
        :rules="rules"
        @submit.prevent="handleRegister"
        label-position="top"
      >
        <el-form-item label="First Name" prop="firstName">
          <el-input
            v-model="registerForm.firstName"
            placeholder="Enter your first name"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="Last Name" prop="lastName">
          <el-input
            v-model="registerForm.lastName"
            placeholder="Enter your last name"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input
            v-model="registerForm.email"
            type="email"
            placeholder="Enter your email"
            prefix-icon="Message"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="Enter your password"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="handleRegister"
            :loading="loading"
          >
            Sign Up
          </el-button>
        </el-form-item>

        <p class="login-link">
          Already have an account?
          <router-link to="/login">Sign in here</router-link>
        </p>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref(null)

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

const loading = ref(false)

const rules = {
  firstName: [
    { required: true, message: 'First name is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Last name is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return

  const isValid = await formRef.value.validate().catch(() => false)
  if (!isValid) return

  loading.value = true
  try {
    await authStore.register(registerForm.value)
    ElMessage.success('Registration successful! Please check your email.')
    router.push('/login')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

:deep(.el-card__body) {
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-logo {
  font-size: 48px;
  margin-bottom: 16px;
}

.register-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.register-header p {
  margin: 0;
  color: #999;
  font-size: 12px;
}

.login-link {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
}
</style>