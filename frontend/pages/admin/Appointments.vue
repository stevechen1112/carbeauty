<template>
  <div v-if="loading" class="loading-container">
    <LoadingSpinner />
  </div>
  <div v-else-if="error" class="error-container">
    <p>{{ error }}</p>
  </div>
  <div v-else class="admin-appointments">
    <h1>預約管理</h1>
    
    <div class="filter-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜尋用戶、商家名稱..." 
        class="search-input"
        @input="filterAppointments"
      />
      <div class="filter-options">
        <label class="filter-option">
          <span>狀態:</span>
          <select v-model="filterStatus" @change="filterAppointments">
            <option value="all">全部</option>
            <option value="confirmed">已確認</option>
            <option value="pending">等待中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </label>
        <label class="filter-option">
          <span>日期範圍:</span>
          <input 
            type="date" 
            v-model="filterDateStart" 
            @change="filterAppointments"
            class="date-input"
          >
          <span>至</span>
          <input 
            type="date" 
            v-model="filterDateEnd" 
            @change="filterAppointments"
            class="date-input"
          >
        </label>
      </div>
    </div>
    
    <div class="appointments-table-container">
      <table class="appointments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用戶</th>
            <th>商家</th>
            <th>服務</th>
            <th>日期</th>
            <th>時間</th>
            <th>狀態</th>
            <th>價格</th>
            <th>建立時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in filteredAppointments" :key="appointment.id" :class="getAppointmentClass(appointment)">
            <td>{{ appointment.id }}</td>
            <td>{{ appointment.user ? appointment.user.name : '未知用戶' }}</td>
            <td>{{ appointment.provider ? appointment.provider.name : '未知商家' }}</td>
            <td>{{ appointment.service ? appointment.service.name : '未知服務' }}</td>
            <td>{{ appointment.date }}</td>
            <td>{{ appointment.time_slot }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(appointment.status)">
                {{ translateStatus(appointment.status) }}
              </span>
            </td>
            <td>NT$ {{ appointment.service ? formatNumber(appointment.service.price) : '0' }}</td>
            <td>{{ formatDate(appointment.created_at) }}</td>
            <td>
              <button class="action-btn view-btn" @click="viewAppointmentDetails(appointment)">
                詳情
              </button>
            </td>
          </tr>
          <tr v-if="filteredAppointments.length === 0">
            <td colspan="10" class="no-appointments">沒有找到符合條件的預約</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 預約詳情對話框 -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>預約詳情</h2>
          <button @click="closeDetailsModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedAppointment">
          <div class="appointment-details">
            <div class="detail-group">
              <h3>基本信息</h3>
              <div class="detail-item">
                <span class="detail-label">預約ID:</span>
                <span class="detail-value">{{ selectedAppointment.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">狀態:</span>
                <span class="detail-value">
                  <span class="status-badge" :class="getStatusClass(selectedAppointment.status)">
                    {{ translateStatus(selectedAppointment.status) }}
                  </span>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">預約日期:</span>
                <span class="detail-value">{{ selectedAppointment.date }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">預約時間:</span>
                <span class="detail-value">{{ selectedAppointment.time_slot }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">建立時間:</span>
                <span class="detail-value">{{ formatDate(selectedAppointment.created_at) }}</span>
              </div>
            </div>
            
            <div class="detail-group">
              <h3>用戶信息</h3>
              <div class="detail-item" v-if="selectedAppointment.user">
                <span class="detail-label">用戶名稱:</span>
                <span class="detail-value">{{ selectedAppointment.user.name }}</span>
              </div>
              <div class="detail-item" v-if="selectedAppointment.user">
                <span class="detail-label">手機號碼:</span>
                <span class="detail-value">{{ selectedAppointment.user.phone }}</span>
              </div>
            </div>
            
            <div class="detail-group">
              <h3>商家與服務信息</h3>
              <div class="detail-item" v-if="selectedAppointment.provider">
                <span class="detail-label">商家名稱:</span>
                <span class="detail-value">{{ selectedAppointment.provider.name }}</span>
              </div>
              <div class="detail-item" v-if="selectedAppointment.service">
                <span class="detail-label">服務名稱:</span>
                <span class="detail-value">{{ selectedAppointment.service.name }}</span>
              </div>
              <div class="detail-item" v-if="selectedAppointment.service">
                <span class="detail-label">服務價格:</span>
                <span class="detail-value">NT$ {{ formatNumber(selectedAppointment.service.price) }}</span>
              </div>
            </div>
            
            <div class="detail-group" v-if="selectedAppointment.notes">
              <h3>備註</h3>
              <div class="detail-item">
                <div class="notes-content">{{ selectedAppointment.notes }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeDetailsModal" class="cancel-btn">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAllAppointments } from '../../services/admin';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

export default {
  name: 'AdminAppointments',
  components: {
    LoadingSpinner
  },
  setup() {
    const appointments = ref([]);
    const filteredAppointments = ref([]);
    const loading = ref(true);
    const error = ref('');
    
    // 過濾條件
    const searchQuery = ref('');
    const filterStatus = ref('all');
    const filterDateStart = ref('');
    const filterDateEnd = ref('');
    
    // 預約詳情
    const showDetailsModal = ref(false);
    const selectedAppointment = ref(null);
    
    // 加載所有預約
    const loadAppointments = async () => {
      try {
        loading.value = true;
        const data = await getAllAppointments();
        appointments.value = data;
        filterAppointments();
        loading.value = false;
      } catch (err) {
        error.value = err.message || '無法載入預約數據';
        loading.value = false;
      }
    };
    
    // 過濾預約
    const filterAppointments = () => {
      let filtered = [...appointments.value];
      
      // 根據搜尋關鍵字過濾
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(appointment => {
          const userName = appointment.user && appointment.user.name ? appointment.user.name.toLowerCase() : '';
          const providerName = appointment.provider && appointment.provider.name ? appointment.provider.name.toLowerCase() : '';
          return userName.includes(query) || providerName.includes(query);
        });
      }
      
      // 根據狀態過濾
      if (filterStatus.value !== 'all') {
        filtered = filtered.filter(a => a.status === filterStatus.value);
      }
      
      // 根據日期範圍過濾
      if (filterDateStart.value) {
        const startDate = new Date(filterDateStart.value);
        filtered = filtered.filter(a => new Date(a.date) >= startDate);
      }
      
      if (filterDateEnd.value) {
        const endDate = new Date(filterDateEnd.value);
        endDate.setHours(23, 59, 59, 999); // 設置為當天的最後一毫秒
        filtered = filtered.filter(a => new Date(a.date) <= endDate);
      }
      
      // 更新過濾後的預約列表
      filteredAppointments.value = filtered;
    };
    
    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // 格式化數字
    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    // 狀態翻譯
    const translateStatus = (status) => {
      const statusMap = {
        confirmed: '已確認',
        pending: '等待中',
        completed: '已完成',
        cancelled: '已取消'
      };
      return statusMap[status] || status;
    };
    
    // 獲取狀態CSS類
    const getStatusClass = (status) => {
      const classMap = {
        confirmed: 'status-confirmed',
        pending: 'status-pending',
        completed: 'status-completed',
        cancelled: 'status-cancelled'
      };
      return classMap[status] || '';
    };
    
    // 獲取預約行CSS類
    const getAppointmentClass = (appointment) => {
      return {
        'status-row-confirmed': appointment.status === 'confirmed',
        'status-row-pending': appointment.status === 'pending',
        'status-row-completed': appointment.status === 'completed',
        'status-row-cancelled': appointment.status === 'cancelled'
      };
    };
    
    // 查看預約詳情
    const viewAppointmentDetails = (appointment) => {
      selectedAppointment.value = appointment;
      showDetailsModal.value = true;
    };
    
    // 關閉詳情對話框
    const closeDetailsModal = () => {
      showDetailsModal.value = false;
    };
    
    onMounted(() => {
      loadAppointments();
    });
    
    return {
      appointments,
      filteredAppointments,
      loading,
      error,
      searchQuery,
      filterStatus,
      filterDateStart,
      filterDateEnd,
      showDetailsModal,
      selectedAppointment,
      filterAppointments,
      formatDate,
      formatNumber,
      translateStatus,
      getStatusClass,
      getAppointmentClass,
      viewAppointmentDetails,
      closeDetailsModal
    };
  },
  metaInfo: {
    title: '預約管理 - 汽車美容預約平台'
  }
}
</script>

<style scoped>
.admin-appointments {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.filter-container {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-option select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.date-input {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.appointments-table-container {
  overflow-x: auto;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.appointments-table th, .appointments-table td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.appointments-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.status-confirmed {
  background-color: #e3f2fd;
  color: #1565c0;
}

.status-pending {
  background-color: #fff8e1;
  color: #f57f17;
}

.status-completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.status-row-confirmed {
  background-color: #f7fbff;
}

.status-row-pending {
  background-color: #fffdf7;
}

.status-row-completed {
  background-color: #f7fff8;
}

.status-row-cancelled {
  background-color: #fff7f8;
}

.action-btn {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.view-btn {
  background-color: #1976d2;
  color: white;
}

.view-btn:hover {
  background-color: #1565c0;
}

.no-appointments {
  text-align: center;
  color: #666;
  padding: 2rem !important;
}

/* 模態對話框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.appointment-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-group {
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.detail-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-group h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
}

.detail-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.detail-label {
  width: 120px;
  font-weight: 500;
  color: #666;
}

.detail-value {
  flex: 1;
}

.notes-content {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-line;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
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

@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-item {
    flex-direction: column;
  }
  
  .detail-label {
    width: 100%;
    margin-bottom: 0.3rem;
  }
}
</style> 