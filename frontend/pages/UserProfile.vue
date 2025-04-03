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
import { getUserAppointments, cancelAppointment } from '../services/appointments';
import { getFavoriteProviders, removeFavoriteProvider } from '../services/providers';

export default {
  name: 'UserProfile',
  data() {
    return {
      activeTab: 'info',
      user: {
        name: '測試用戶',
        phone: '0912345678',
        email: '',
        address: ''
      },
      appointments: [],
      historicalAppointments: [],
      favorites: [],
      userPosts: [],
      userCars: [],
      showAddCarModal: false,
      isEditingCar: false,
      editingCarId: null,
      carForm: {
        brand: '',
        model: '',
        licensePlate: '',
        year: '',
        color: '',
        notes: '',
        image: null
      }
    };
  },
  computed: {
    isCarFormValid() {
      return this.carForm.brand && this.carForm.model && this.carForm.licensePlate && this.carForm.year && this.carForm.color;
    }
  },
  methods: {
    async fetchUserInfo() {
      try {
        // 實際應用中應從API獲取用戶資料
        // const response = await fetch('/api/user', { headers: getAuthHeader() });
        // this.user = await response.json();
      } catch (error) {
        console.error('獲取用戶資料錯誤:', error);
      }
    },
    async fetchAppointments() {
      try {
        // 在實際應用中，應該從API獲取預約
        // const appointments = await getUserAppointments();
        
        // 模擬數據
        this.appointments = [
          {
            id: 1,
            provider_id: 1,
            provider_name: '頂級汽車美容中心',
            service_id: 2,
            service_name: '外部打蠟',
            date: '2023-04-15',
            time_slot: '14:00-16:00',
            price: 2000,
            status: 'confirmed'
          },
          {
            id: 2,
            provider_id: 3,
            provider_name: '閃亮汽車美容工作室',
            service_id: 1,
            service_name: '基礎洗車',
            date: '2023-04-20',
            time_slot: '10:00-11:00',
            price: 600,
            status: 'pending'
          }
        ];
        
        this.historicalAppointments = [
          {
            id: 3,
            provider_id: 2,
            provider_name: '豪華車專業洗車',
            service_id: 3,
            service_name: '內部深層清潔',
            date: '2023-03-10',
            time_slot: '13:00-15:00',
            price: 1800,
            status: 'completed',
            hasReview: true
          },
          {
            id: 4,
            provider_id: 1,
            provider_name: '頂級汽車美容中心',
            service_id: 4,
            service_name: '全車護理套餐',
            date: '2023-02-25',
            time_slot: '09:00-12:00',
            price: 3500,
            status: 'completed',
            hasReview: false
          }
        ];
      } catch (error) {
        console.error('獲取預約錯誤:', error);
      }
    },
    async fetchFavorites() {
      try {
        // 實際應用中應從API獲取收藏商家
        // const favorites = await getFavoriteProviders();
        
        // 模擬數據
        this.favorites = [
          {
            id: 1,
            name: '頂級汽車美容中心',
            address: '台北市信義區松高路123號',
            rating: 4.8,
            review_count: 142
          },
          {
            id: 3,
            name: '閃亮汽車美容工作室',
            address: '台北市中山區南京東路789號',
            rating: 4.7,
            review_count: 89
          }
        ];
      } catch (error) {
        console.error('獲取收藏商家錯誤:', error);
      }
    },
    async fetchUserPosts() {
      try {
        // 實際應用中應從API獲取用戶發文
        // const posts = await getUserPosts();
        
        // 模擬數據
        this.userPosts = [
          {
            id: 1,
            title: '新車到手，分享我的保養心得',
            content: '前兩週剛入手新車，已經去做了基礎美容和鍍膜，效果非常好！推薦大家嘗試...',
            createdAt: new Date('2023-03-15T10:30:00'),
            likes: 24,
            comments: 8
          },
          {
            id: 2,
            title: '分享我的愛車日常打理方法',
            content: '每週固定會自己動手清潔愛車，分享一些小技巧給大家...',
            createdAt: new Date('2023-03-10T14:20:00'),
            likes: 36,
            comments: 15
          }
        ];
      } catch (error) {
        console.error('獲取用戶發文錯誤:', error);
      }
    },
    async fetchUserCars() {
      try {
        // 實際應用中應從API獲取用戶車輛信息
        // const cars = await getUserCars();
        
        // 模擬數據
        this.userCars = [
          {
            id: 1,
            brand: 'Toyota',
            model: 'Camry',
            licensePlate: 'ABC-1234',
            year: 2020,
            color: '白色',
            notes: '主要代步車',
            image: 'https://via.placeholder.com/300x200?text=Toyota+Camry'
          },
          {
            id: 2,
            brand: 'BMW',
            model: '5系列',
            licensePlate: 'XYZ-5678',
            year: 2022,
            color: '黑色',
            notes: '週末休閒',
            image: 'https://via.placeholder.com/300x200?text=BMW+5系列'
          }
        ];
      } catch (error) {
        console.error('獲取用戶車輛信息錯誤:', error);
      }
    },
    updateUserInfo() {
      // 更新用戶資料
      alert('資料已更新！');
    },
    async cancelAppointment(appointmentId) {
      try {
        // 在實際應用中，應該調用API取消預約
        // await cancelAppointment(appointmentId);
        
        // 更新本地數據
        this.appointments = this.appointments.filter(a => a.id !== appointmentId);
        alert('預約已取消');
      } catch (error) {
        console.error('取消預約錯誤:', error);
      }
    },
    rescheduleAppointment(appointmentId) {
      // 重新安排預約時間
      alert('此功能尚未實現');
    },
    leaveReview(appointment) {
      // 跳轉到評價頁面或顯示評價表單
      alert(`為 ${appointment.provider_name} 的 ${appointment.service_name} 服務進行評價`);
    },
    rebookService(providerId, serviceId) {
      // 跳轉到預約頁面
      this.$router.push(`/providers/${providerId}?service=${serviceId}`);
    },
    removeFavorite(providerId) {
      // 在實際應用中應發送請求取消收藏
      this.favorites = this.favorites.filter(f => f.id !== providerId);
      alert('已取消收藏');
    },
    formatTime(date) {
      // 簡單的時間格式化
      return new Date(date).toLocaleDateString('zh-TW');
    },
    viewPost(postId) {
      // 查看帖子詳情
      this.$router.push(`/community/posts/${postId}`);
    },
    editPost(postId) {
      // 編輯帖子
      alert(`編輯帖子 ID: ${postId}`);
    },
    deletePost(postId) {
      // 刪除帖子
      if (confirm('確定要刪除此帖子嗎？')) {
        this.userPosts = this.userPosts.filter(p => p.id !== postId);
        alert('帖子已刪除');
      }
    },
    editCar(carId) {
      // 編輯車輛信息
      const car = this.userCars.find(c => c.id === carId);
      if (car) {
        this.carForm = { ...car };
        this.isEditingCar = true;
        this.editingCarId = carId;
        this.showAddCarModal = true;
      }
    },
    deleteCar(carId) {
      // 刪除車輛信息
      if (confirm('確定要刪除此車輛資訊嗎？')) {
        this.userCars = this.userCars.filter(c => c.id !== carId);
        alert('車輛資訊已刪除');
      }
    },
    closeCarModal() {
      // 關閉車輛資訊彈窗
      this.showAddCarModal = false;
      this.isEditingCar = false;
      this.editingCarId = null;
      this.carForm = {
        brand: '',
        model: '',
        licensePlate: '',
        year: '',
        color: '',
        notes: '',
        image: null
      };
    },
    saveCar() {
      if (this.isEditingCar) {
        // 更新現有車輛資訊
        this.userCars = this.userCars.map(car => {
          if (car.id === this.editingCarId) {
            return { ...this.carForm, id: this.editingCarId };
          }
          return car;
        });
        alert('車輛資訊已更新');
      } else {
        // 添加新的車輛資訊
        const newCar = {
          ...this.carForm,
          id: Date.now() // 簡單生成唯一ID
        };
        this.userCars.push(newCar);
        alert('車輛資訊已添加');
      }
      this.closeCarModal();
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // 實際應用中，應上傳圖片到伺服器並獲取URL
        // 這裡簡單地使用本地URL預覽
        this.carForm.image = URL.createObjectURL(file);
      }
    },
    formatDateTime(date, timeSlot) {
      return `${date} ${timeSlot}`;
    },
    getStatusText(status) {
      const statusMap = {
        'pending': '待確認',
        'confirmed': '已確認',
        'completed': '已完成',
        'cancelled': '已取消'
      };
      return statusMap[status] || status;
    },
    getStatusClass(status) {
      return `status-${status}`;
    }
  },
  created() {
    this.fetchUserInfo();
    this.fetchAppointments();
    this.fetchFavorites();
    this.fetchUserPosts();
    this.fetchUserCars();
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