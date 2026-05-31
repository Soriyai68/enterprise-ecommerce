<template>
  <el-card>
    <el-tabs>
      <el-tab-pane label="Revenue Analytics">
        <div class="analytics-grid">
          <div class="metric-card">
            <div class="metric-label">Total Revenue</div>
            <div class="metric-value">$124,567</div>
            <div class="metric-change">+23% vs last month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Avg Order Value</div>
            <div class="metric-value">$156.78</div>
            <div class="metric-change">+5% vs last month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Conversion Rate</div>
            <div class="metric-value">3.2%</div>
            <div class="metric-change">+0.5% vs last month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Customer Lifetime Value</div>
            <div class="metric-value">$892</div>
            <div class="metric-change">+12% vs last month</div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Sales Analytics">
        <div class="analytics-grid">
          <div class="metric-card">
            <div class="metric-label">Total Sales</div>
            <div class="metric-value">2,457</div>
            <div class="metric-change">+18% vs last month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Top Category</div>
            <div class="metric-value">Electronics</div>
            <div class="metric-change">$45,678 in sales</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Top Product</div>
            <div class="metric-value">Headphones</div>
            <div class="metric-change">342 units sold</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Avg Items/Order</div>
            <div class="metric-value">2.3</div>
            <div class="metric-change">Stable</div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Customer Analytics">
        <div class="analytics-grid">
          <div class="metric-card">
            <div class="metric-label">New Customers</div>
            <div class="metric-value">234</div>
            <div class="metric-change">+28% vs last month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Repeat Rate</div>
            <div class="metric-value">42%</div>
            <div class="metric-change">+5% vs last month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Churn Rate</div>
            <div class="metric-value">8%</div>
            <div class="metric-change">-2% vs last month</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Satisfaction Score</div>
            <div class="metric-value">4.6/5</div>
            <div class="metric-change">+0.2 vs last month</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
</script>

<style scoped>
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.metric-card {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;

  .metric-label {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .metric-change {
    font-size: 12px;
    opacity: 0.8;
  }
}
</style>
