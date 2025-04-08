<template>
  <div class="user-profile">
    <h1>會員專區</h1>
    
    <div class="profile-container">
      <div class="profile-sidebar">
        <div class="profile-avatar">
          <img src="https://via.placeholder.com/150" alt="用戶頭像" />
          <h3>{{ user.name || '尊敬的用戶' }}</h3>
          <p>{{ user.phone || '未設置手機號碼' }}</p>
        </div>
        
        <div class="sidebar-menu">
          <div 
            class="menu-item" 
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            個人資料
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeTab === 'appointments' }"
            @click="activeTab = 'appointments'"
          >
            我的預約
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            歷史訂單
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
          >
            收藏商家
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeTab === 'posts' }"
            @click="activeTab = 'posts'"
          >
            我的發文
          </div>
          <div 
            class="menu-item" 
            :class="{ active: activeTab === 'cars' }"
            @click="activeTab = 'cars'"
          >
            愛車資訊
          </div>
        </div>
      </div>
      
      <div class="profile-content">
        <!-- 個人資料 -->
        <div v-if="activeTab === 'info'" class="profile-tab">
          <h2>個人資料</h2>
          <div class="profile-form">
            <div class="form-group">
              <label>姓名</label>
              <input type="text" v-model="user.name" placeholder="請輸入姓名" />
            </div>
            <div class="form-group">
              <label>手機號碼</label>
              <input type="text" v-model="user.phone" placeholder="請輸入手機號碼" disabled />
            </div>
            <div class="form-group">
              <label>電子郵件</label>
              <input type="email" v-model="user.email" placeholder="請輸入電子郵件" />
            </div>
            <div class="form-group">
              <label>地址</label>
              <input type="text" v-model="user.address" placeholder="請輸入地址" />
            </div>
            <button class="save-btn" @click="updateUserInfo">保存資料</button>
          </div>
        </div>
        
        <!-- 我的預約 -->
        <div v-if="activeTab === 'appointments'" class="profile-tab">
          <h2>我的預約</h2>
          <div v-if="appointments.length === 0" class="empty-state">
            <p>您目前沒有進行中的預約</p>
            <button class="action-btn" @click="$router.push('/providers')">立即預約</button>
          </div>
          <div v-else class="appointments-list">
            <div v-for="appointment in appointments" :key="appointment.id" class="appointment-card">
              <div class="appointment-header">
                <h3>{{ appointment.provider_name }}</h3>
                <span :class="getStatusClass(appointment.status)">{{ getStatusText(appointment.status) }}</span>
              </div>
              <div class="appointment-details">
                <p><strong>服務項目:</strong> {{ appointment.service_name }}</p>
                <p><strong>預約時間:</strong> {{ formatDateTime(appointment.date, appointment.time_slot) }}</p>
                <p><strong>價格:</strong> NT$ {{ appointment.price }}</p>
              </div>
              <div class="appointment-actions">
                <button 
                  v-if="appointment.status === 'pending'" 
                  class="cancel-btn" 
                  @click="cancelAppointment(appointment.id)"
                >
                  取消預約
                </button>
                <button 
                  v-if="appointment.status === 'confirmed'" 
                  class="reschedule-btn" 
                  @click="rescheduleAppointment(appointment.id)"
                >
                  更改時間
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 歷史訂單 -->
        <div v-if="activeTab === 'history'" class="profile-tab">
          <h2>歷史訂單</h2>
          <div v-if="historicalAppointments.length === 0" class="empty-state">
            <p>您沒有歷史訂單記錄</p>
          </div>
          <div v-else class="appointments-list">
            <div v-for="appointment in historicalAppointments" :key="appointment.id" class="appointment-card">
              <div class="appointment-header">
                <h3>{{ appointment.provider_name }}</h3>
                <span :class="getStatusClass(appointment.status)">{{ getStatusText(appointment.status) }}</span>
              </div>
              <div class="appointment-details">
                <p><strong>服務項目:</strong> {{ appointment.service_name }}</p>
                <p><strong>完成時間:</strong> {{ formatDateTime(appointment.date, appointment.time_slot) }}</p>
                <p><strong>價格:</strong> NT$ {{ appointment.price }}</p>
              </div>
              <div class="appointment-actions">
                <button 
                  v-if="appointment.status === 'completed' && !appointment.hasReview" 
                  class="review-btn" 
                  @click="leaveReview(appointment)"
                >
                  評價服務
                </button>
                <button 
                  class="rebooking-btn" 
                  @click="rebookService(appointment.provider_id, appointment.service_id)"
                >
                  再次預約
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 收藏商家 -->
        <div v-if="activeTab === 'favorites'" class="profile-tab">
          <h2>收藏商家</h2>
          <div v-if="favorites.length === 0" class="empty-state">
            <p>您尚未收藏任何商家</p>
            <button class="action-btn" @click="$router.push('/providers')">瀏覽商家</button>
          </div>
          <div v-else class="favorites-list">
            <div v-for="provider in favorites" :key="provider.id" class="favorite-card">
              <h3>{{ provider.name }}</h3>
              <p class="provider-address">{{ provider.address }}</p>
              <div class="provider-rating">
                <span>⭐ {{ provider.rating }}</span>
                <span class="review-count">({{ provider.review_count }}條評價)</span>
              </div>
              <div class="favorite-actions">
                <button class="view-btn" @click="$router.push(`/providers/${provider.id}`)">查看商家</button>
                <button class="remove-btn" @click="removeFavorite(provider.id)">取消收藏</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的發文 -->
        <div v-if="activeTab === 'posts'" class="profile-tab">
          <h2>我的發文</h2>
          <div v-if="userPosts.length === 0" class="empty-state">
            <p>您尚未發表任何文章</p>
            <button class="action-btn" @click="$router.push('/community')">前往社區發文</button>
          </div>
          <div v-else class="user-posts-list">
            <div v-for="post in userPosts" :key="post.id" class="post-card">
              <div class="post-header">
                <h3>{{ post.title }}</h3>
                <span class="post-date">{{ formatTime(post.createdAt) }}</span>
              </div>
              <p class="post-content">{{ post.content }}</p>
              <div class="post-stats">
                <span class="like-count">👍 {{ post.likes }} 讚</span>
                <span class="comment-count">💬 {{ post.comments }} 留言</span>
              </div>
              <div class="post-actions">
                <button class="view-btn" @click="viewPost(post.id)">查看詳情</button>
                <button class="edit-btn" @click="editPost(post.id)">編輯</button>
                <button class="delete-btn" @click="deletePost(post.id)">刪除</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 愛車資訊 -->
        <div v-if="activeTab === 'cars'" class="profile-tab">
          <div class="tab-header">
            <h2>愛車資訊</h2>
            <button class="add-btn" @click="showAddCarModal = true">新增愛車</button>
          </div>
          
          <div v-if="userCars.length === 0" class="empty-state">
            <p>您尚未添加愛車信息</p>
            <p class="sub-message">添加您的愛車資訊，以便獲得更個性化的服務推薦</p>
          </div>
          
          <div v-else class="cars-list">
            <div v-for="car in userCars" :key="car.id" class="car-card">
              <div class="car-image">
                <img :src="car.image || 'https://via.placeholder.com/300x200?text=愛車照片'" alt="愛車照片">
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.brand }} {{ car.model }}</h3>
                <p class="car-license">車牌號碼: {{ car.licensePlate }}</p>
                <p class="car-year">年份: {{ car.year }}</p>
                <p class="car-color">顏色: {{ car.color }}</p>
                <p class="car-notes" v-if="car.notes">備註: {{ car.notes }}</p>
              </div>
              <div class="car-actions">
                <button class="edit-btn" @click="editCar(car.id)">編輯</button>
                <button class="delete-btn" @click="deleteCar(car.id)">刪除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 添加愛車彈窗 -->
  <div v-if="showAddCarModal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ isEditingCar ? '編輯愛車' : '新增愛車' }}</h3>
        <button class="close-btn" @click="closeCarModal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>車輛品牌</label>
          <input type="text" v-model="carForm.brand" placeholder="例如：Toyota、BMW..." />
        </div>
        <div class="form-group">
          <label>車輛型號</label>
          <input type="text" v-model="carForm.model" placeholder="例如：Camry、5系列..." />
        </div>
        <div class="form-group">
          <label>車牌號碼</label>
          <input type="text" v-model="carForm.licensePlate" placeholder="輸入車牌號碼" />
        </div>
        <div class="form-group">
          <label>出廠年份</label>
          <input type="number" v-model="carForm.year" placeholder="例如：2020" />
        </div>
        <div class="form-group">
          <label>車身顏色</label>
          <input type="text" v-model="carForm.color" placeholder="例如：白色、黑色..." />
        </div>
        <div class="form-group">
          <label>備註（選填）</label>
          <textarea v-model="carForm.notes" placeholder="其他車輛相關資訊..."></textarea>
        </div>
        <div class="form-group">
          <label>車輛照片（選填）</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
          <p class="help-text">建議上傳車輛正面或側面照片</p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeCarModal">取消</button>
        <button class="save-btn" @click="saveCar" :disabled="!isCarFormValid">保存</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser } from '../services/auth';
import apiClient from '../services/apiClient';

export default {
  name: 'UserProfile',
  setup() {
    const router = useRouter();
    const activeTab = ref('info');
    const user = ref({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
    const appointments = ref([]);
    const historicalAppointments = ref([]);
    const favorites = ref([]);
    const userPosts = ref([]);
    const userCars = ref([]);
    const isLoading = ref(true);
    const error = ref('');
    const showAddCarModal = ref(false);
    const isEditingCar = ref(false);
    const currentCarId = ref(null);
    const carForm = ref({
      brand: '',
      model: '',
      licensePlate: '',
      year: new Date().getFullYear(),
      color: '',
      notes: '',
      image: ''
    });

    // 獲取用戶收藏的服務商
    const loadFavoriteProviders = async () => {
      try {
        const response = await apiClient.get('/users/favorites');
        favorites.value = response;
      } catch (err) {
        console.error('獲取收藏商家錯誤:', err);
        error.value = '無法載入收藏的商家';
      }
    };

    // 獲取用戶的預約
    const loadAppointments = async () => {
      try {
        const response = await apiClient.get('/appointments/user');
        
        // 將預約分為進行中和歷史預約
        appointments.value = response.filter(a => 
          a.status === 'pending' || a.status === 'confirmed'
        );
        
        historicalAppointments.value = response.filter(a => 
          a.status === 'completed' || a.status === 'cancelled'
        );
      } catch (err) {
        console.error('獲取預約錯誤:', err);
        error.value = '無法載入預約記錄';
      }
    };

    // 獲取用戶的發文
    const loadUserPosts = async () => {
      try {
        const response = await apiClient.get('/posts/user');
        userPosts.value = response;
      } catch (err) {
        console.error('獲取用戶發文錯誤:', err);
        error.value = '無法載入發文記錄';
      }
    };

    // 獲取用戶的愛車資訊
    const loadUserCars = async () => {
      try {
        const response = await apiClient.get('/users/cars');
        userCars.value = response;
      } catch (err) {
        console.error('獲取愛車資訊錯誤:', err);
        error.value = '無法載入愛車資訊';
      }
    };

    // 載入用戶全部數據
    const loadUserData = async () => {
      try {
        isLoading.value = true;
        error.value = '';
        
        // 獲取當前用戶信息
        const currentUser = getCurrentUser();
        if (currentUser) {
          user.value = {
            ...user.value,
            ...currentUser
          };
          
          // 載入所有用戶數據
          await Promise.all([
            loadFavoriteProviders(),
            loadAppointments(),
            loadUserPosts(),
            loadUserCars()
          ]);
        } else {
          // 未登入的情況
          router.push('/login');
        }
      } catch (err) {
        console.error('載入用戶數據錯誤:', err);
        error.value = '載入數據時發生錯誤';
      } finally {
        isLoading.value = false;
      }
    };

    // 更新用戶信息
    const updateUserInfo = async () => {
      try {
        isLoading.value = true;
        await apiClient.put('/users/profile', user.value);
        // 更新本地存儲的用戶信息
        const currentUser = getCurrentUser();
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            ...user.value
          }));
        }
        alert('資料已更新');
        isLoading.value = false;
      } catch (err) {
        console.error('更新用戶信息錯誤:', err);
        error.value = '更新資料失敗';
        isLoading.value = false;
      }
    };

    // 取消收藏商家
    const removeFavorite = async (providerId) => {
      try {
        await apiClient.delete(`/users/favorites/${providerId}`);
        favorites.value = favorites.value.filter(f => f.id !== providerId);
      } catch (err) {
        console.error('取消收藏錯誤:', err);
        error.value = '取消收藏失敗';
      }
    };

    // 取消預約
    const cancelAppointment = async (appointmentId) => {
      if (confirm('確定要取消此預約嗎？')) {
        try {
          await apiClient.delete(`/appointments/${appointmentId}`);
          await loadAppointments(); // 重新載入預約數據
        } catch (err) {
          console.error('取消預約錯誤:', err);
          error.value = '取消預約失敗';
        }
      }
    };

    // 獲取狀態文字
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待確認',
        'confirmed': '已確認',
        'completed': '已完成',
        'cancelled': '已取消'
      };
      return statusMap[status] || status;
    };

    // 獲取狀態CSS類
    const getStatusClass = (status) => {
      return `status-${status}`;
    };

    // 格式化日期時間
    const formatDateTime = (date, timeSlot) => {
      if (!date) return '';
      const formattedDate = new Date(date).toLocaleDateString('zh-TW');
      return `${formattedDate} ${timeSlot || ''}`;
    };

    // 格式化時間
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleDateString('zh-TW');
    };

    // 在組件掛載時加載數據
    onMounted(() => {
      loadUserData();
    });

    return {
      activeTab,
      user,
      appointments,
      historicalAppointments,
      favorites,
      userPosts,
      userCars,
      isLoading,
      error,
      showAddCarModal,
      isEditingCar,
      carForm,
      updateUserInfo,
      removeFavorite,
      cancelAppointment,
      getStatusText,
      getStatusClass,
      formatDateTime,
      formatTime
    };
  }
};
</script>

<style scoped>
.user-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.user-profile h1 {
  margin-bottom: 2rem;
  color: #1976d2;
  text-align: center;
}

.profile-container {
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-sidebar {
  width: 280px;
  background: #f5f7fa;
  padding: 2rem 0;
  border-right: 1px solid #eaeaea;
}

.profile-avatar {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
  object-fit: cover;
  border: 3px solid #1976d2;
}

.profile-avatar h3 {
  margin: 0;
  color: #333;
}

.profile-avatar p {
  color: #666;
  margin: 0.5rem 0 0;
}

.sidebar-menu {
  margin-top: 1rem;
}

.menu-item {
  padding: 1rem 2rem;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: #e3f2fd;
  color: #1976d2;
}

.menu-item.active {
  background: #e3f2fd;
  color: #1976d2;
  border-left-color: #1976d2;
  font-weight: bold;
}

.profile-content {
  flex: 1;
  padding: 2rem;
}

.profile-tab h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.profile-form .form-group {
  margin-bottom: 1.5rem;
}

.profile-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.profile-form input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.profile-form input:focus {
  outline: none;
  border-color: #1976d2;
}

.profile-form input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.save-btn, .action-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.save-btn:hover, .action-btn:hover {
  background: #1565c0;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.appointments-list, .favorites-list, .user-posts-list, .cars-list {
  display: grid;
  gap: 1.5rem;
}

.appointment-card, .favorite-card, .post-card, .car-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.appointment-card:hover, .favorite-card:hover, .post-card:hover, .car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.appointment-header, .favorite-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.appointment-header h3, .favorite-card h3 {
  margin: 0;
  color: #333;
}

.appointment-details p, .favorite-card p {
  margin: 0.5rem 0;
  color: #555;
}

.favorite-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn, .reschedule-btn, .review-btn, .rebooking-btn, .view-btn, .remove-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  border: none;
  transition: background 0.3s;
}

.cancel-btn {
  background: #f44336;
  color: white;
}

.cancel-btn:hover {
  background: #d32f2f;
}

.reschedule-btn, .rebooking-btn, .view-btn, .remove-btn {
  background: #1976d2;
  color: white;
}

.reschedule-btn:hover, .rebooking-btn:hover, .view-btn:hover, .remove-btn:hover {
  background: #1565c0;
}

.review-btn {
  background: #4caf50;
  color: white;
}

.review-btn:hover {
  background: #388e3c;
}

.status-pending {
  color: #ff9800;
}

.status-confirmed {
  color: #4caf50;
}

.status-completed {
  color: #1976d2;
}

.status-cancelled {
  color: #f44336;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.post-date {
  color: #777;
  font-size: 0.9rem;
}

.post-content {
  color: #555;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.post-stats {
  display: flex;
  gap: 1rem;
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn, .edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
}

.view-btn {
  background: #1976d2;
  color: white;
}

.edit-btn {
  background: #ff9800;
  color: white;
}

.delete-btn {
  background: #f44336;
  color: white;
}

.view-btn:hover, .edit-btn:hover, .delete-btn:hover {
  opacity: 0.9;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.add-btn:hover {
  background: #388e3c;
}

.car-image {
  height: 150px;
  overflow: hidden;
}

.car-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.car-info {
  padding: 1rem;
  flex-grow: 1;
}

.car-name {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1.2rem;
}

.car-license, .car-year, .car-color, .car-notes {
  margin: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
}

.car-actions {
  display: flex;
  border-top: 1px solid #eee;
}

.car-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  background: transparent;
  transition: background 0.3s;
}

.car-actions .edit-btn {
  color: #1976d2;
  border-right: 1px solid #eee;
}

.car-actions .delete-btn {
  color: #f44336;
}

.car-actions .edit-btn:hover {
  background: #e3f2fd;
}

.car-actions .delete-btn:hover {
  background: #ffebee;
}

.sub-message {
  color: #777;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f5f7fa;
  border-bottom: 1px solid #eaeaea;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #eaeaea;
}

.cancel-btn {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
}

.help-text {
  color: #777;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

@media (min-width: 768px) {
  .cars-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 1rem;
  }
  
  .sidebar-menu {
    display: flex;
    flex-wrap: wrap;
  }
  
  .menu-item {
    flex: 1;
    text-align: center;
    padding: 0.75rem;
    border-left: none;
    border-bottom: 3px solid transparent;
  }
  
  .menu-item.active {
    border-left-color: transparent;
    border-bottom-color: #1976d2;
  }
}
</style> 