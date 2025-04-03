<template>
  <div class="my-appointments">
    <h1>我的預約</h1>
    
    <div v-if="!isLoggedIn" class="login-required">
      <p>請先登入查看您的預約記錄</p>
      <router-link to="/login" class="login-btn">前往登入</router-link>
    </div>
    
    <div v-else-if="loading" class="loading">
      載入中...
    </div>
    
    <div v-else-if="appointments.length === 0" class="no-appointments">
      <p>您暫無預約記錄</p>
      <router-link to="/providers" class="browse-btn">瀏覽服務商</router-link>
    </div>
    
    <div v-else>
      <div class="filters">
        <select v-model="statusFilter" @change="filterAppointments">
          <option value="all">全部狀態</option>
          <option value="pending">待確認</option>
          <option value="confirmed">已確認</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>
      
      <div class="appointments-list">
        <div 
          v-for="appointment in filteredAppointments" 
          :key="appointment.id" 
          class="appointment-card"
          :class="{ 'status-confirmed': appointment.status === 'confirmed', 'status-cancelled': appointment.status === 'cancelled' }"
        >
          <div class="appointment-header">
            <h3>{{ appointment.providerName }}</h3>
            <div class="appointment-status" :class="`status-${appointment.status}`">
              {{ getStatusText(appointment.status) }}
            </div>
          </div>
          
          <div class="appointment-details">
            <p class="service">
              <strong>服務項目:</strong> {{ appointment.serviceName }}
            </p>
            <p class="datetime">
              <strong>預約時間:</strong> {{ formatDate(appointment.date) }} {{ appointment.timeSlot }}
            </p>
            <p class="price">
              <strong>費用:</strong> NT$ {{ appointment.price }}
            </p>
            <p v-if="appointment.notes" class="notes">
              <strong>備註:</strong> {{ appointment.notes }}
            </p>
          </div>
          
          <div class="appointment-actions">
            <button 
              v-if="appointment.status === 'pending' || appointment.status === 'confirmed'" 
              @click="cancelAppointment(appointment.id)" 
              class="cancel-btn"
            >
              取消預約
            </button>
            
            <button 
              v-if="appointment.status === 'completed' && !appointment.hasReview" 
              @click="openReviewModal(appointment)" 
              class="review-btn"
            >
              評價服務
            </button>
            
            <router-link 
              :to="`/providers/${appointment.providerId}`" 
              class="provider-link"
            >
              查看服務商
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 評價彈窗 -->
    <div v-if="showReviewModal" class="review-modal">
      <div class="review-modal-content">
        <h3>為服務評分</h3>
        <p>{{ selectedAppointment.providerName }} - {{ selectedAppointment.serviceName }}</p>
        
        <div class="rating-select">
          <label>評分:</label>
          <div class="star-rating">
            <span 
              v-for="star in 5" 
              :key="star" 
              @click="reviewRating = star" 
              :class="{ 'selected': star <= reviewRating }"
            >★</span>
          </div>
        </div>
        
        <div class="form-group">
          <label>評價內容:</label>
          <textarea v-model="reviewComment" rows="4" placeholder="請分享您的體驗..."></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="submitReview" :disabled="!reviewRating" class="submit-btn">提交評價</button>
          <button @click="closeReviewModal" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyAppointments',
  data() {
    return {
      isLoggedIn: false,
      loading: true,
      appointments: [],
      filteredAppointments: [],
      statusFilter: 'all',
      
      // 評價模態框
      showReviewModal: false,
      selectedAppointment: null,
      reviewRating: 0,
      reviewComment: ''
    };
  },
  created() {
    // 檢查用戶是否已登入
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    
    if (this.isLoggedIn) {
      this.fetchAppointments();
    } else {
      this.loading = false;
    }
  },
  methods: {
    async fetchAppointments() {
      this.loading = true;
      
      try {
        // 在實際應用中，應該從API獲取預約數據
        // 這裡使用模擬數據
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.appointments = [
          {
            id: 1,
            providerId: 1,
            providerName: '頂級汽車美容中心',
            serviceName: '精緻洗車',
            date: '2023-04-20',
            timeSlot: '14:00',
            status: 'confirmed',
            price: 650,
            notes: '黑色賓士轎車',
            hasReview: false
          },
          {
            id: 2,
            providerId: 3,
            providerName: '閃亮汽車美容工作室',
            serviceName: '內裝深度清潔',
            date: '2023-04-15',
            timeSlot: '10:00',
            status: 'completed',
            price: 1500,
            notes: '',
            hasReview: true
          },
          {
            id: 3,
            providerId: 2,
            providerName: '豪華車專業洗車',
            serviceName: '車身打蠟',
            date: '2023-04-10',
            timeSlot: '15:00',
            status: 'completed',
            price: 1200,
            notes: '請特別注意引擎蓋區域',
            hasReview: false
          },
          {
            id: 4,
            providerId: 1,
            providerName: '頂級汽車美容中心',
            serviceName: '基礎洗車',
            date: '2023-03-25',
            timeSlot: '09:00',
            status: 'cancelled',
            price: 350,
            notes: '',
            hasReview: false
          }
        ];
        
        this.filterAppointments();
      } catch (error) {
        console.error('獲取預約失敗:', error);
      } finally {
        this.loading = false;
      }
    },
    filterAppointments() {
      if (this.statusFilter === 'all') {
        this.filteredAppointments = [...this.appointments];
      } else {
        this.filteredAppointments = this.appointments.filter(
          appointment => appointment.status === this.statusFilter
        );
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', options);
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待確認',
        confirmed: '已確認',
        completed: '已完成',
        cancelled: '已取消'
      };
      
      return statusMap[status] || status;
    },
    async cancelAppointment(appointmentId) {
      if (!confirm('確定要取消此預約嗎？')) return;
      
      try {
        // 在實際應用中，應該向API發送取消請求
        // const response = await fetch(`/api/appointments/${appointmentId}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   },
        //   body: JSON.stringify({ status: 'cancelled' })
        // });
        
        // 模擬API響應
        console.log(`取消預約 ID: ${appointmentId}`);
        
        // 更新本地狀態
        this.appointments = this.appointments.map(appointment => {
          if (appointment.id === appointmentId) {
            return { ...appointment, status: 'cancelled' };
          }
          return appointment;
        });
        
        this.filterAppointments();
        
        alert('預約已取消');
      } catch (error) {
        alert('取消預約失敗，請稍後重試');
        console.error('取消預約錯誤:', error);
      }
    },
    openReviewModal(appointment) {
      this.selectedAppointment = appointment;
      this.reviewRating = 0;
      this.reviewComment = '';
      this.showReviewModal = true;
    },
    closeReviewModal() {
      this.showReviewModal = false;
      this.selectedAppointment = null;
    },
    async submitReview() {
      if (!this.reviewRating) return;
      
      try {
        // 在實際應用中，應該向API發送評價數據
        // const response = await fetch(`/api/providers/${this.selectedAppointment.providerId}/reviews`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   },
        //   body: JSON.stringify({
        //     appointmentId: this.selectedAppointment.id,
        //     rating: this.reviewRating,
        //     comment: this.reviewComment
        //   })
        // });
        
        // 模擬API響應
        console.log('提交評價:', {
          appointmentId: this.selectedAppointment.id,
          rating: this.reviewRating,
          comment: this.reviewComment
        });
        
        // 更新本地狀態
        this.appointments = this.appointments.map(appointment => {
          if (appointment.id === this.selectedAppointment.id) {
            return { ...appointment, hasReview: true };
          }
          return appointment;
        });
        
        this.closeReviewModal();
        alert('評價提交成功！');
      } catch (error) {
        alert('評價提交失敗，請稍後重試');
        console.error('評價提交錯誤:', error);
      }
    }
  }
};
</script>

<style scoped>
.my-appointments {
  max-width: 1000px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #1976d2;
}

.login-required, .no-appointments, .loading {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-btn, .browse-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: #1976d2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.login-btn:hover, .browse-btn:hover {
  background-color: #1565c0;
}

.filters {
  margin-bottom: 1.5rem;
}

.filters select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.appointment-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-left: 5px solid #1976d2;
}

.appointment-card.status-cancelled {
  border-left-color: #f44336;
}

.appointment-card.status-confirmed {
  border-left-color: #4caf50;
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.appointment-header h3 {
  margin: 0;
  color: #1976d2;
}

.appointment-status {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.status-pending {
  background-color: #fff3e0;
  color: #e65100;
}

.status-confirmed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-completed {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.status-cancelled {
  background-color: #ffebee;
  color: #c62828;
}

.appointment-details {
  margin-bottom: 1rem;
}

.appointment-details p {
  margin: 0.5rem 0;
}

.appointment-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn, .review-btn, .provider-link {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.review-btn {
  background-color: #ff9800;
  color: white;
}

.provider-link {
  background-color: #1976d2;
  color: white;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

.review-btn:hover {
  background-color: #f57c00;
}

.provider-link:hover {
  background-color: #1565c0;
}

/* 評價彈窗 */
.review-modal {
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

.review-modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.review-modal-content h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
}

.rating-select {
  margin: 1.5rem 0;
}

.star-rating {
  font-size: 2rem;
  display: flex;
  gap: 0.5rem;
}

.star-rating span {
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.star-rating span.selected {
  color: #ffc107;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.submit-btn:hover {
  background-color: #388e3c;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .appointment-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .appointment-actions {
    flex-direction: column;
  }
  
  .cancel-btn, .review-btn, .provider-link {
    width: 100%;
  }
}
</style> 