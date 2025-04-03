<template>
  <div v-if="loading" class="loading-container">
    <LoadingSpinner />
  </div>
  <div v-else-if="error" class="error-container">
    <p>{{ error }}</p>
  </div>
  <div v-else class="admin-dashboard">
    <h1>管理員儀表板</h1>
    
    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>用戶總數</h3>
        <div class="stat-value">{{ dashboardData.userCount }}</div>
      </div>
      <div class="stat-card">
        <h3>商家總數</h3>
        <div class="stat-value">{{ dashboardData.providerCount }}</div>
      </div>
      <div class="stat-card">
        <h3>預約總數</h3>
        <div class="stat-value">{{ dashboardData.appointmentCount }}</div>
      </div>
      <div class="stat-card">
        <h3>總營收</h3>
        <div class="stat-value">NT$ {{ formatNumber(dashboardData.totalRevenue) }}</div>
      </div>
      <div class="stat-card">
        <h3>本週新增預約</h3>
        <div class="stat-value">{{ dashboardData.recentAppointmentsCount }}</div>
      </div>
    </div>
    
    <div class="quick-links">
      <h2>快速導航</h2>
      <div class="links">
        <router-link to="/admin/users" class="link-card">
          <h3>用戶管理</h3>
          <p>查看和管理所有用戶</p>
        </router-link>
        <router-link to="/admin/appointments" class="link-card">
          <h3>預約管理</h3>
          <p>查看和管理所有預約</p>
        </router-link>
        <router-link to="/admin/providers" class="link-card">
          <h3>商家管理</h3>
          <p>查看和管理所有商家</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getDashboardData } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

export default {
  name: 'AdminDashboard',
  components: {
    LoadingSpinner
  },
  setup() {
    const dashboardData = ref({
      userCount: 0,
      providerCount: 0,
      appointmentCount: 0,
      totalRevenue: 0,
      recentAppointmentsCount: 0
    });
    const loading = ref(true);
    const error = ref('');
    
    // 格式化數字顯示（添加千位分隔符）
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    // 加載儀表板數據
    const loadDashboardData = async () => {
      try {
        loading.value = true;
        const data = await getDashboardData();
        dashboardData.value = data;
        loading.value = false;
      } catch (err) {
        error.value = err.message || '無法載入儀表板數據';
        loading.value = false;
      }
    };
    
    onMounted(() => {
      loadDashboardData();
    });
    
    return {
      dashboardData,
      loading,
      error,
      formatNumber
    };
  },
  metaInfo: {
    title: '管理員儀表板 - 汽車美容預約平台'
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  color: #666;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1976d2;
}

.quick-links {
  margin-top: 2rem;
}

.links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.link-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: inherit;
}

.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.link-card h3 {
  color: #1976d2;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.link-card p {
  color: #666;
  margin: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #ffebee;
  border-radius: 8px;
  color: #d32f2f;
  text-align: center;
}
</style> 