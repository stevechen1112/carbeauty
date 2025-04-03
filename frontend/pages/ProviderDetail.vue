<template>
  <div class="provider-detail" v-if="provider">
    <div class="provider-header">
      <div class="provider-info">
        <h1>{{ provider.name }}</h1>
        <p class="address">📍 {{ provider.address }}</p>
        <div class="rating">
          <span>⭐ {{ provider.rating || '暫無評分' }}</span>
          <span class="reviews">({{ provider.reviewCount || 0 }}條評價)</span>
        </div>
        <div class="contact">
          <p>📞 {{ provider.phone }}</p>
          <p>🕒 營業時間: {{ provider.businessHours }}</p>
        </div>
      </div>
      <div class="provider-actions">
        <button @click="viewShowcase" class="showcase-btn">
          <span>👨‍🔧</span> 查看專業展示
        </button>
      </div>
    </div>
    
    <div class="content-container">
      <div class="main-content">
        <div class="about-section">
          <h2>關於我們</h2>
          <p>{{ provider.description }}</p>
        </div>
        
        <div class="services-section">
          <h2>提供服務</h2>
          <div class="services-list">
            <div 
              v-for="service in provider.servicesList" 
              :key="service.id" 
              class="service-card"
            >
              <div class="service-header">
                <h3>{{ service.name }}</h3>
                <span class="price">NT$ {{ service.price }}</span>
              </div>
              <p class="duration">⏱️ 服務時間: 約{{ service.duration }}分鐘</p>
              <p class="description">{{ service.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="reviews-section">
          <h2>用戶評價</h2>
          <div v-if="provider.reviews && provider.reviews.length > 0" class="reviews-list">
            <div v-for="(review, index) in provider.reviews" :key="index" class="review-card">
              <div class="review-header">
                <span class="reviewer-name">{{ review.userName }}</span>
                <div class="review-rating">
                  <span>⭐ {{ review.rating }}</span>
                  <span class="review-date">{{ review.date }}</span>
                </div>
              </div>
              <p class="review-text">{{ review.comment }}</p>
            </div>
          </div>
          <p v-else class="no-reviews">還沒有評價，成為第一個評價的用戶吧！</p>
        </div>
      </div>
      
      <div class="booking-sidebar">
        <div class="booking-card">
          <h2>預約服務</h2>
          <div class="booking-form">
            <div class="form-group">
              <label for="service">選擇服務</label>
              <select id="service" v-model="selectedService">
                <option value="">請選擇服務</option>
                <option 
                  v-for="service in provider.servicesList" 
                  :key="service.id" 
                  :value="service.id"
                >
                  {{ service.name }} - NT$ {{ service.price }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="date">選擇日期</label>
              <input type="date" id="date" v-model="bookingDate" :min="minDate">
            </div>
            
            <div class="form-group">
              <label for="time">選擇時間</label>
              <select id="time" v-model="bookingTime" :disabled="!bookingDate">
                <option value="">請選擇時間</option>
                <option 
                  v-for="time in availableTimes" 
                  :key="time" 
                  :value="time"
                >{{ time }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="notes">備註</label>
              <textarea 
                id="notes" 
                v-model="bookingNotes" 
                placeholder="如車型、特殊需求等"
                rows="3"
              ></textarea>
            </div>
            
            <button 
              @click="submitBooking" 
              class="booking-btn" 
              :disabled="!isFormValid || !isLoggedIn"
            >
              {{ isLoggedIn ? '確認預約' : '請先登入' }}
            </button>
            
            <p v-if="!isLoggedIn" class="login-tip">
              <router-link to="/login">登入</router-link> 後即可預約服務
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading">
    載入中...
  </div>
</template>

<script>
export default {
  name: 'ProviderDetail',
  data() {
    return {
      provider: null,
      selectedService: '',
      bookingDate: '',
      bookingTime: '',
      bookingNotes: '',
      availableTimes: [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
      ],
      isLoggedIn: false
    };
  },
  computed: {
    minDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    isFormValid() {
      return this.selectedService && this.bookingDate && this.bookingTime;
    }
  },
  created() {
    this.fetchProviderDetails();
    
    // 檢查用戶是否已登入
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  },
  methods: {
    async fetchProviderDetails() {
      const providerId = this.$route.params.id;
      
      // 在實際應用中，應該從API獲取數據
      // 這裡使用模擬數據
      setTimeout(() => {
        this.provider = {
          id: providerId,
          name: '頂級汽車美容中心',
          address: '台北市信義區松高路123號',
          phone: '02-12345678',
          businessHours: '週一至週六 09:00-18:00',
          rating: 4.8,
          reviewCount: 56,
          description: '我們是台北市頂尖的汽車美容服務提供商，擁有多年經驗的專業團隊，提供包括洗車、打蠟、內裝清潔等多種服務。我們使用高品質的清潔用品，確保您的愛車得到最佳的照顧。無論是日常維護還是深度清潔，我們都能為您提供專業、高效的服務。',
          servicesList: [
            {
              id: 1,
              name: '基礎洗車',
              price: 350,
              duration: 30,
              description: '包括車身外部清洗、輪胎清潔與上光'
            },
            {
              id: 2,
              name: '精緻洗車',
              price: 650,
              duration: 60,
              description: '包括基礎洗車的所有服務，加上車內吸塵、座椅清潔與儀表板保養'
            },
            {
              id: 3,
              name: '車身打蠟',
              price: 1200,
              duration: 90,
              description: '使用高級車蠟，增強車漆光澤，提供保護層'
            },
            {
              id: 4,
              name: '內裝深度清潔',
              price: 1500,
              duration: 120,
              description: '全車內裝深度清潔，包括座椅縫隙、空調出風口、後車廂等區域'
            }
          ],
          reviews: [
            {
              userName: '王先生',
              rating: 5,
              date: '2023-03-15',
              comment: '服務非常專業，車子洗完亮如新車，會再次光顧！'
            },
            {
              userName: '林女士',
              rating: 4,
              date: '2023-03-10',
              comment: '工作細心，態度友善，服務品質值得推薦。'
            },
            {
              userName: '張先生',
              rating: 5,
              date: '2023-03-05',
              comment: '打蠟效果很好，車子保持亮麗很久，價格也合理。'
            }
          ]
        };
      }, 500);
    },
    async submitBooking() {
      if (!this.isFormValid || !this.isLoggedIn) return;
      
      try {
        // 在實際應用中，應該發送預約請求到API
        const bookingData = {
          providerId: this.provider.id,
          serviceId: this.selectedService,
          date: this.bookingDate,
          timeSlot: this.bookingTime,
          notes: this.bookingNotes
        };
        
        // 模擬API請求
        console.log('預約數據:', bookingData);
        
        // 模擬成功響應
        alert('預約成功！');
        
        // 重置表單
        this.selectedService = '';
        this.bookingDate = '';
        this.bookingTime = '';
        this.bookingNotes = '';
        
        // 導航到預約列表頁面
        // this.$router.push('/appointments');
      } catch (error) {
        alert('預約失敗，請稍後重試');
        console.error('預約錯誤:', error);
      }
    },
    viewShowcase() {
      // 導航到商家專業展示頁面
      this.$router.push(`/providers/${this.$route.params.id}/showcase`);
    }
  }
};
</script>

<style scoped>
.provider-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.provider-info h1 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #1976d2;
}

.address {
  color: #555;
  margin-bottom: 0.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f9a825;
  font-weight: bold;
  margin-bottom: 1rem;
}

.reviews {
  color: #777;
  font-weight: normal;
}

.contact {
  color: #555;
}

.provider-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.showcase-btn {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.showcase-btn:hover {
  background-color: #f57c00;
}

.content-container {
  display: flex;
  gap: 2rem;
}

.main-content {
  flex: 1;
}

.about-section, .services-section, .reviews-section {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.about-section h2, .services-section h2, .reviews-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.service-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.service-header h3 {
  margin: 0;
  color: #1976d2;
}

.price {
  font-weight: bold;
  color: #4caf50;
}

.duration {
  color: #777;
  margin-bottom: 0.5rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.reviewer-name {
  font-weight: bold;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.review-date {
  color: #777;
  font-size: 0.9rem;
}

.no-reviews {
  color: #777;
  text-align: center;
  padding: 1rem;
}

.booking-sidebar {
  flex: 0 0 350px;
}

.booking-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.booking-card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #1976d2;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

select, input, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
}

.booking-btn {
  width: 100%;
  padding: 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.booking-btn:hover:not(:disabled) {
  background-color: #1565c0;
}

.booking-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.login-tip {
  text-align: center;
  margin-top: 1rem;
  color: #777;
}

.login-tip a {
  color: #1976d2;
  text-decoration: none;
}

.login-tip a:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #555;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }
  
  .booking-sidebar {
    flex: auto;
    width: 100%;
  }
  
  .booking-card {
    position: static;
    margin-bottom: 2rem;
  }
  
  .services-list {
    grid-template-columns: 1fr;
  }
}
</style> 