<template>
  <div v-if="loading" class="loading-container">
    <LoadingSpinner />
  </div>
  <div v-else-if="error" class="error-container">
    <p>{{ error }}</p>
  </div>
  <div v-else class="admin-providers">
    <h1>商家管理</h1>
    
    <div class="admin-toolbar">
      <div class="search-and-filter">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜尋商家..." 
          class="search-input"
          @input="debouncedSearch"
        />
        <select v-model="statusFilter" class="filter-select" @change="loadProviders">
          <option value="all">所有狀態</option>
          <option value="verified">已認證</option>
          <option value="unverified">未認證</option>
        </select>
      </div>
      <button class="add-btn" @click="showAddProviderModal = true">
        新增商家
      </button>
    </div>
    
    <div class="providers-table-container">
      <table class="providers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>名稱</th>
            <th>聯絡電話</th>
            <th>地址</th>
            <th>評分</th>
            <th>狀態</th>
            <th>註冊日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="provider in providers" :key="provider.id">
            <td>{{ provider.id }}</td>
            <td>{{ provider.name }}</td>
            <td>{{ provider.phone }}</td>
            <td>{{ provider.address }}</td>
            <td>{{ provider.rating }} ⭐ ({{ provider.reviewCount }})</td>
            <td>
              <span 
                class="status-badge" 
                :class="{ 'verified': provider.verified, 'unverified': !provider.verified }"
              >
                {{ provider.verified ? '已認證' : '未認證' }}
              </span>
            </td>
            <td>{{ formatDate(provider.createdAt) }}</td>
            <td class="actions">
              <button class="action-btn view-btn" @click="viewProvider(provider)">查看</button>
              <button class="action-btn edit-btn" @click="editProvider(provider)">編輯</button>
              <button 
                class="action-btn" 
                :class="provider.verified ? 'disable-btn' : 'enable-btn'" 
                @click="toggleProviderStatus(provider)"
              >
                {{ provider.verified ? '取消認證' : '認證' }}
              </button>
            </td>
          </tr>
          <tr v-if="providers.length === 0">
            <td colspan="8" class="no-data">無商家數據</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="pagination">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1" 
        @click="changePage(currentPage - 1)"
      >
        上一頁
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages" 
        @click="changePage(currentPage + 1)"
      >
        下一頁
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getProviders, updateProviderStatus } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

export default {
  name: 'AdminProviders',
  components: {
    LoadingSpinner
  },
  setup() {
    const providers = ref([]);
    const loading = ref(true);
    const error = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalItems = ref(0);
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const showAddProviderModal = ref(false);
    const currentProvider = ref(null);
    
    const totalPages = computed(() => {
      return Math.ceil(totalItems.value / pageSize.value) || 1;
    });
    
    // 防抖搜索
    let searchTimeout;
    const debouncedSearch = () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentPage.value = 1;
        loadProviders();
      }, 300);
    };
    
    // 加載商家數據
    const loadProviders = async () => {
      try {
        loading.value = true;
        error.value = '';
        
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          query: searchQuery.value || undefined,
          status: statusFilter.value !== 'all' ? statusFilter.value : undefined
        };
        
        const response = await getProviders(params);
        
        providers.value = response.providers;
        totalItems.value = response.total;
        
        loading.value = false;
      } catch (err) {
        console.error('獲取商家列表錯誤:', err);
        error.value = err.message || '無法載入商家列表';
        loading.value = false;
      }
    };
    
    // 切換頁碼
    const changePage = (page) => {
      currentPage.value = page;
      loadProviders();
    };
    
    // 切換商家狀態
    const toggleProviderStatus = async (provider) => {
      try {
        const newStatus = provider.verified ? 'unverified' : 'verified';
        
        if (confirm(`確認要${newStatus === 'verified' ? '認證' : '取消認證'}「${provider.name}」嗎？`)) {
          await updateProviderStatus(provider.id, newStatus);
          
          // 更新本地數據
          const index = providers.value.findIndex(p => p.id === provider.id);
          if (index !== -1) {
            providers.value[index].verified = !provider.verified;
          }
        }
      } catch (err) {
        console.error('更新商家狀態錯誤:', err);
        alert('更新商家狀態失敗');
      }
    };
    
    // 查看商家
    const viewProvider = (provider) => {
      // 在新窗口打開商家詳情
      window.open(`/providers/${provider.id}`, '_blank');
    };
    
    // 編輯商家
    const editProvider = (provider) => {
      currentProvider.value = provider;
      // 這裡需要實現編輯功能，可以是彈窗或者跳轉到編輯頁面
      alert(`編輯商家功能尚未實現: ${provider.name}`);
    };
    
    // 日期格式化
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW');
    };
    
    onMounted(() => {
      loadProviders();
    });
    
    return {
      providers,
      loading,
      error,
      currentPage,
      totalPages,
      searchQuery,
      statusFilter,
      showAddProviderModal,
      debouncedSearch,
      loadProviders,
      changePage,
      toggleProviderStatus,
      viewProvider,
      editProvider,
      formatDate
    };
  }
}
</script>

<style scoped>
.admin-providers {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-and-filter {
  display: flex;
  gap: 1rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 300px;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.add-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #45a049;
}

.providers-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.providers-table {
  width: 100%;
  border-collapse: collapse;
}

.providers-table th,
.providers-table td {
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.providers-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #555;
}

.providers-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-badge.verified {
  background-color: #e3f7e6;
  color: #2e7d32;
}

.status-badge.unverified {
  background-color: #fff8e1;
  color: #f57c00;
}

.actions {
  white-space: nowrap;
}

.action-btn {
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  color: white;
}

.view-btn {
  background-color: #2196f3;
}

.edit-btn {
  background-color: #ff9800;
}

.enable-btn {
  background-color: #4caf50;
}

.disable-btn {
  background-color: #f44336;
}

.action-btn:hover {
  opacity: 0.9;
}

.no-data {
  text-align: center;
  color: #888;
  padding: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}

.pagination-btn {
  background-color: white;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background-color: #f5f5f5;
}

.page-info {
  margin: 0 1rem;
  font-size: 0.9rem;
  color: #666;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-container {
  color: #d32f2f;
}
</style> 