<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="login-header">
        <div class="login-logo">📊</div>
        <h1>Admin Dashboard</h1>
        <p>Enterprise E-Commerce Management System</p>
      </div>

      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        @submit.prevent="handleLogin"
        label-position="top"
      >
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="loginForm.email"
            type="email"
            placeholder="Enter your email"
            prefix-icon="Message"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="rememberMe">Remember me</el-checkbox>
          <router-link to="#" class="forgot-password">Forgot Password?</router-link>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="handleLogin"
            :loading="loading"
          >
            Sign In
          </el-button>
        </el-form-item>

        <el-divider>OR</el-divider>

        <p class="register-link">
          Don't have an account?
          <router-link to="/register">Sign up here</router-link>
        </p>
      </el-form>

      <!-- Demo credentials -->
      <div class="demo-credentials">
        <p>Demo Credentials:</p>
        <p>Email: admin@ecommerce.com</p>
        <p>Password: Admin@123456</p>
      </div>
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

const loginForm = ref({
  email: 'admin@ecommerce.com',
  password: 'Admin@123456'
})

const rememberMe = ref(false)
const loading = ref(false)

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  const isValid = await formRef.value.validate().catch(() => false)
  if (!isValid) return

  loading.value = true
  try {
    await authStore.login(loginForm.value)
    ElMessage.success('Login successful!')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  border-radius: 8px;

  :deep(.el-card__body) {
    padding: 40px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  .login-logo {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
    color: #999;
    font-size: 12px;
  }
}

.forgot-password {
  float: right;
  color: #409eff;
  text-decoration: none;
  font-size: 12px;

  &:hover {
    color: #66b1ff;
  }
}

.register-link {
  text-align: center;
  color: #666;
  font-size: 14px;
  margin: 0;

  a {
    color: #409eff;
    text-decoration: none;

    &:hover {
      color: #66b1ff;
    }
  }
}

.demo-credentials {
  margin-top: 20px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #666;

  p {
    margin: 4px 0;
  }
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  background-color: #fafafa;
}
</style>
