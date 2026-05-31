<template>
  <div class="not-found">
    <div class="container">
      <div class="error-code">404</div>
      <div class="error-title">Page Not Found</div>
      <div class="error-message">The page you're looking for doesn't exist.</div>
      <el-button type="primary" @click="$router.push('/')">Back to Dashboard</el-button>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;

  .container {
    text-align: center;
  }

  .error-code {
    font-size: 120px;
    font-weight: 700;
    color: #409eff;
    margin-bottom: 20px;
  }

  .error-title {
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }

  .error-message {
    font-size: 16px;
    color: #999;
    margin-bottom: 30px;
  }
}
</style>
