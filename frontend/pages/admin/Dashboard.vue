<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner />
    </div>
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xl mx-auto" role="alert">
      <strong class="font-bold">載入錯誤：</strong>
      <span class="block sm:inline">{{ error }}</span>
      <button @click="loadDashboardData" class="ml-4 mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
        重試
      </button>
    </div>
    <div v-else>
      <h1 class="text-3xl font-bold text-gray-800 mb-6">管理員儀表板</h1>

      <!-- 統計數據 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-sm font-medium text-gray-500 mb-2">用戶總數</h3>
          <div class="text-3xl font-bold text-primary">{{ dashboardData.userCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-sm font-medium text-gray-500 mb-2">商家總數</h3>
          <div class="text-3xl font-bold text-primary">{{ dashboardData.providerCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-sm font-medium text-gray-500 mb-2">預約總數</h3>
          <div class="text-3xl font-bold text-primary">{{ dashboardData.appointmentCount }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-sm font-medium text-gray-500 mb-2">總營收</h3>
          <div class="text-3xl font-bold text-primary">NT$ {{ formatNumber(dashboardData.totalRevenue) }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <h3 class="text-sm font-medium text-gray-500 mb-2">本週新增預約</h3>
          <div class="text-3xl font-bold text-primary">{{ dashboardData.recentAppointmentsCount }}</div>
        </div>
      </div>

      <!-- 快速導航 -->
      <div>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">快速導航</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <router-link to="/admin/users" class="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-primary-lighter transition-all duration-300 group">
            <h3 class="text-lg font-semibold text-primary group-hover:text-primary-dark mb-1">用戶管理</h3>
            <p class="text-sm text-gray-600 group-hover:text-gray-700">查看和管理所有用戶</p>
          </router-link>
          <router-link to="/admin/appointments" class="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-primary-lighter transition-all duration-300 group">
            <h3 class="text-lg font-semibold text-primary group-hover:text-primary-dark mb-1">預約管理</h3>
            <p class="text-sm text-gray-600 group-hover:text-gray-700">查看和管理所有預約</p>
          </router-link>
          <router-link to="/admin/providers" class="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-primary-lighter transition-all duration-300 group">
            <h3 class="text-lg font-semibold text-primary group-hover:text-primary-dark mb-1">商家管理</h3>
            <p class="text-sm text-gray-600 group-hover:text-gray-700">查看和管理所有商家</p>
          </router-link>
           <router-link to="/admin/seo" class="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:bg-primary-lighter transition-all duration-300 group">
            <h3 class="text-lg font-semibold text-primary group-hover:text-primary-dark mb-1">SEO 管理</h3>
            <p class="text-sm text-gray-600 group-hover:text-gray-700">管理網站 SEO 設定</p>
          </router-link>
        </div>
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
      if (typeof num !== 'number') return '0';
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // 加載儀表板數據
    const loadDashboardData = async () => {
      loading.value = true;
      error.value = '';
      try {
        const response = await getDashboardData();
        // 提供一些默認值以防API返回的數據不完整
        dashboardData.value = {
           userCount: response.userCount || 0,
           providerCount: response.providerCount || 0,
           appointmentCount: response.appointmentCount || 0,
           totalRevenue: response.totalRevenue || 0,
           recentAppointmentsCount: response.recentAppointmentsCount || 0
        };
      } catch (err) {
        console.error('載入儀表板數據錯誤:', err);
        error.value = err.message || '無法載入儀表板數據';
      } finally {
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
      formatNumber,
      loadDashboardData // 暴露 loadDashboardData 方法以供重試按鈕使用
    };
  },
  // Meta Info 似乎在 Vue 3 中有不同的處理方式，暫時移除或後續處理
  // metaInfo: {
  //   title: '管理員儀表板 - 汽車美容預約平台'
  // }
}
</script>

<!-- 移除 <style scoped> 區塊，樣式已遷移至 Tailwind CSS 類 --> 