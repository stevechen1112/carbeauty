<template>
  <div class="provider-showcase">
    <h1>商家專業展示</h1>
    
    <div v-if="loading">
      <p class="loading">正在加載商家資料...</p>
    </div>
    
    <div v-else-if="error">
      <p class="error">{{ error }}</p>
      <button class="retry-btn" @click="loadProviderData">重試</button>
    </div>
    
    <div v-else class="showcase-content">
      <!-- 商家基本信息 -->
      <div class="provider-header">
        <div class="provider-logo">
          <img :src="provider.logo" :alt="provider.name" />
        </div>
        <div class="provider-info">
          <h2>{{ provider.name }}</h2>
          <div class="provider-rating">
            <span class="stars">{{ getStars(provider.rating) }}</span>
            <span class="rating-value">{{ provider.rating }}</span>
            <span class="review-count">({{ provider.reviewCount }} 評價)</span>
          </div>
          <p class="provider-address">{{ provider.address }}</p>
          <p class="provider-hours">營業時間: {{ provider.businessHours }}</p>
          <div class="provider-badges">
            <span v-for="(badge, index) in provider.badges" :key="index" class="badge">
              {{ badge }}
            </span>
          </div>
        </div>
        <div class="provider-actions">
          <button class="book-btn" @click="bookService">立即預約</button>
          <button class="favorite-btn" @click="toggleFavorite">
            <span v-if="isFavorite">❤️ 已收藏</span>
            <span v-else>🤍 收藏</span>
          </button>
        </div>
      </div>
      
      <!-- 專業技術展示區 -->
      <div class="showcase-section">
        <h3>專業技術與設備</h3>
        
        <div class="tabs">
          <div 
            class="tab" 
            :class="{ active: currentTab === 'facilities' }"
            @click="currentTab = 'facilities'"
          >
            環境設備
          </div>
          <div 
            class="tab" 
            :class="{ active: currentTab === 'technicians' }"
            @click="currentTab = 'technicians'"
          >
            專業技師
          </div>
          <div 
            class="tab" 
            :class="{ active: currentTab === 'certificates' }"
            @click="currentTab = 'certificates'"
          >
            認證資質
          </div>
        </div>
        
        <!-- 環境設備 -->
        <div v-if="currentTab === 'facilities'" class="tab-content">
          <div class="facility-gallery">
            <div v-for="(image, index) in provider.facilities" :key="index" class="gallery-item">
              <img :src="image.url" :alt="image.description" @click="viewImage(image.url)">
              <p class="image-description">{{ image.description }}</p>
            </div>
          </div>
        </div>
        
        <!-- 專業技師 -->
        <div v-if="currentTab === 'technicians'" class="tab-content">
          <div class="technicians-list">
            <div v-for="tech in provider.technicians" :key="tech.id" class="technician-card">
              <img :src="tech.photo" :alt="tech.name" class="technician-photo">
              <div class="technician-info">
                <h4>{{ tech.name }}</h4>
                <p class="technician-title">{{ tech.title }}</p>
                <p class="technician-experience">{{ tech.experience }}年經驗</p>
                <ul class="technician-specialties">
                  <li v-for="(specialty, index) in tech.specialties" :key="index">
                    {{ specialty }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 認證資質 -->
        <div v-if="currentTab === 'certificates'" class="tab-content">
          <div class="certificates-grid">
            <div v-for="(cert, index) in provider.certificates" :key="index" class="certificate-card">
              <img :src="cert.image" :alt="cert.name" class="certificate-image">
              <div class="certificate-details">
                <h4>{{ cert.name }}</h4>
                <p class="cert-issuer">發證機構: {{ cert.issuer }}</p>
                <p class="cert-date">獲取日期: {{ cert.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 服務流程展示 -->
      <div class="showcase-section">
        <h3>我們的服務流程</h3>
        
        <div class="service-process">
          <div v-for="(step, index) in provider.serviceProcess" :key="index" class="process-step">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
              <div v-if="step.image" class="step-image">
                <img :src="step.image" :alt="step.title">
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 案例展示 -->
      <div class="showcase-section">
        <h3>服務案例展示</h3>
        
        <div class="case-filters">
          <button 
            v-for="filter in caseFilters" 
            :key="filter.value"
            :class="{ active: currentCaseFilter === filter.value }"
            @click="currentCaseFilter = filter.value"
            class="filter-btn"
          >
            {{ filter.label }}
          </button>
        </div>
        
        <div class="case-gallery">
          <div 
            v-for="caseItem in filteredCases" 
            :key="caseItem.id" 
            class="case-item"
            @click="viewCaseDetails(caseItem)"
          >
            <div class="case-images">
              <div class="case-before">
                <img :src="caseItem.beforeImage" alt="處理前">
                <span class="image-label">處理前</span>
              </div>
              <div class="arrow">→</div>
              <div class="case-after">
                <img :src="caseItem.afterImage" alt="處理後">
                <span class="image-label">處理後</span>
              </div>
            </div>
            <div class="case-info">
              <h4>{{ caseItem.title }}</h4>
              <p class="case-car">車型: {{ caseItem.carModel }}</p>
              <p class="case-service">服務: {{ caseItem.service }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProviderShowcase',
  data() {
    return {
      loading: true,
      error: null,
      providerId: null,
      provider: null,
      isFavorite: false,
      currentTab: 'facilities',
      currentCaseFilter: 'all',
      caseFilters: [
        { label: '全部案例', value: 'all' },
        { label: '外觀美容', value: 'exterior' },
        { label: '內飾清潔', value: 'interior' },
        { label: '鍍膜護理', value: 'coating' }
      ]
    };
  },
  computed: {
    filteredCases() {
      if (!this.provider) return [];
      if (this.currentCaseFilter === 'all') return this.provider.cases;
      return this.provider.cases.filter(item => item.type === this.currentCaseFilter);
    }
  },
  methods: {
    getStars(rating) {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      let stars = '★'.repeat(fullStars);
      if (halfStar) stars += '½';
      return stars;
    },
    async loadProviderData() {
      this.loading = true;
      this.error = null;
      
      try {
        // 模擬API調用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模擬數據
        this.provider = {
          id: this.providerId || 1,
          name: '頂級汽車美容中心',
          logo: 'https://via.placeholder.com/120x120?text=Logo',
          rating: 4.8,
          reviewCount: 142,
          address: '台北市信義區松高路123號',
          businessHours: '週一至週日 09:00-21:00',
          badges: ['專業認證', '五星評價', '資深團隊'],
          facilities: [
            {
              url: 'https://via.placeholder.com/600x400?text=設施1',
              description: '全新進口洗車設備，水壓精準控制'
            },
            {
              url: 'https://via.placeholder.com/600x400?text=設施2',
              description: '溫控烘乾室，確保完美效果'
            },
            {
              url: 'https://via.placeholder.com/600x400?text=設施3',
              description: '專業拋光機台，多段速度調節'
            },
            {
              url: 'https://via.placeholder.com/600x400?text=設施4',
              description: '舒適寬敞接待區，提供免費WiFi'
            }
          ],
          technicians: [
            {
              id: 1,
              name: '張大師',
              photo: 'https://via.placeholder.com/200x200?text=張大師',
              title: '首席技術總監',
              experience: 15,
              specialties: ['頂級鍍膜', '原廠認證', '進口車護理']
            },
            {
              id: 2,
              name: '李技師',
              photo: 'https://via.placeholder.com/200x200?text=李技師',
              title: '資深美容師',
              experience: 8,
              specialties: ['內飾深層清潔', '皮革護理', '除異味處理']
            },
            {
              id: 3,
              name: '王師傅',
              photo: 'https://via.placeholder.com/200x200?text=王師傅',
              title: '拋光專家',
              experience: 10,
              specialties: ['刮痕修復', '漆面拋光', '封體鍍膜']
            }
          ],
          certificates: [
            {
              name: '頂級美容技術認證',
              image: 'https://via.placeholder.com/300x200?text=認證1',
              issuer: '台灣汽車美容協會',
              date: '2020-05-15'
            },
            {
              name: '國際鍍膜大師認證',
              image: 'https://via.placeholder.com/300x200?text=認證2',
              issuer: '國際汽車護理協會',
              date: '2019-08-22'
            },
            {
              name: '環保清潔技術認證',
              image: 'https://via.placeholder.com/300x200?text=認證3',
              issuer: '環保署認可機構',
              date: '2021-03-10'
            }
          ],
          serviceProcess: [
            {
              title: '車況評估',
              description: '專業技師全面檢查愛車狀況，提供最適合的護理方案。',
              image: 'https://via.placeholder.com/400x200?text=評估'
            },
            {
              title: '前置清洗',
              description: '使用專業設備及溫和清潔劑進行初步清洗，去除表面污漬。',
              image: 'https://via.placeholder.com/400x200?text=清洗'
            },
            {
              title: '專業護理',
              description: '根據不同部位及材質，使用專門的護理產品進行深度護理。',
              image: 'https://via.placeholder.com/400x200?text=護理'
            },
            {
              title: '細節處理',
              description: '對難以清潔的細節部位進行特殊處理，確保完美效果。',
              image: 'https://via.placeholder.com/400x200?text=細節'
            },
            {
              title: '品質檢驗',
              description: '技師長進行最終檢查，確保每個環節達到最高標準。',
              image: 'https://via.placeholder.com/400x200?text=檢驗'
            }
          ],
          cases: [
            {
              id: 1,
              title: 'Audi A6舊車翻新',
              type: 'exterior',
              carModel: 'Audi A6 2018',
              service: '全車拋光+頂級鍍膜',
              beforeImage: 'https://via.placeholder.com/300x200?text=處理前',
              afterImage: 'https://via.placeholder.com/300x200?text=處理後'
            },
            {
              id: 2,
              title: 'BMW內飾深層清潔',
              type: 'interior',
              carModel: 'BMW 5系列 2020',
              service: '內飾深層清潔+皮革護理',
              beforeImage: 'https://via.placeholder.com/300x200?text=處理前',
              afterImage: 'https://via.placeholder.com/300x200?text=處理後'
            },
            {
              id: 3,
              title: 'Benz鍍膜保護',
              type: 'coating',
              carModel: 'Mercedes-Benz E-Class 2019',
              service: '奈米陶瓷鍍膜',
              beforeImage: 'https://via.placeholder.com/300x200?text=處理前',
              afterImage: 'https://via.placeholder.com/300x200?text=處理後'
            },
            {
              id: 4,
              title: 'Tesla車身美容',
              type: 'exterior',
              carModel: 'Tesla Model 3 2021',
              service: '漆面修復+拋光',
              beforeImage: 'https://via.placeholder.com/300x200?text=處理前',
              afterImage: 'https://via.placeholder.com/300x200?text=處理後'
            }
          ]
        };
        
        // 模擬檢查收藏狀態
        this.isFavorite = localStorage.getItem(`favorite_${this.providerId}`) === 'true';
      } catch (err) {
        console.error('加載商家資料錯誤:', err);
        this.error = '無法加載商家資料，請稍後再試';
      } finally {
        this.loading = false;
      }
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      // 保存收藏狀態到localStorage
      localStorage.setItem(`favorite_${this.providerId}`, this.isFavorite);
      // 實際應用中應發送API請求
    },
    bookService() {
      // 導航到預約頁面
      this.$router.push(`/providers/${this.providerId}`);
    },
    viewImage(url) {
      // 查看大圖
      window.open(url, '_blank');
    },
    viewCaseDetails(caseItem) {
      // 查看案例詳情
      alert(`查看案例: ${caseItem.title}`);
      // 實際應用中應打開案例詳情頁面或模態框
    }
  },
  created() {
    // 從路由參數中獲取商家ID
    this.providerId = parseInt(this.$route.params.id) || 1;
    this.loadProviderData();
  }
};
</script>

<style scoped>
.provider-showcase {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.provider-showcase h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1976d2;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #777;
  font-size: 1.2rem;
}

.error {
  color: #f44336;
}

.retry-btn {
  display: block;
  margin: 1rem auto;
  padding: 0.75rem 1.5rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.provider-header {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.provider-logo {
  flex-shrink: 0;
  margin-right: 2rem;
}

.provider-logo img {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
}

.provider-info {
  flex: 1;
}

.provider-info h2 {
  margin: 0 0 0.5rem;
  color: #333;
}

.provider-rating {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stars {
  color: #ff9800;
  margin-right: 0.5rem;
}

.rating-value {
  font-weight: bold;
  margin-right: 0.25rem;
}

.review-count {
  color: #777;
  font-size: 0.9rem;
}

.provider-address, .provider-hours {
  margin: 0.25rem 0;
  color: #555;
}

.provider-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.provider-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-left: 2rem;
}

.book-btn, .favorite-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  transition: all 0.3s;
}

.book-btn {
  background: #4caf50;
  color: white;
}

.book-btn:hover {
  background: #388e3c;
}

.favorite-btn {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.favorite-btn:hover {
  background: #e0e0e0;
}

.showcase-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.showcase-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab:hover {
  color: #1976d2;
}

.tab.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: bold;
}

.tab-content {
  min-height: 300px;
}

.facility-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gallery-item {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

.image-description {
  padding: 1rem;
  margin: 0;
  background: #f5f7fa;
  color: #555;
}

.technicians-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.technician-card {
  display: flex;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.technician-photo {
  width: 120px;
  height: 150px;
  object-fit: cover;
}

.technician-info {
  flex: 1;
  padding: 1rem;
}

.technician-info h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.technician-title {
  color: #1976d2;
  font-weight: bold;
  margin: 0 0 0.5rem;
}

.technician-experience {
  color: #555;
  margin: 0 0 0.5rem;
}

.technician-specialties {
  margin: 0.5rem 0 0;
  padding-left: 1.5rem;
  color: #666;
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.certificate-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.certificate-image {
  width: 100%;
  height: 150px;
  object-fit: contain;
  background: #f5f7fa;
  padding: 1rem;
}

.certificate-details {
  padding: 1rem;
}

.certificate-details h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.cert-issuer, .cert-date {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.service-process {
  position: relative;
}

.process-step {
  display: flex;
  margin-bottom: 2rem;
  position: relative;
}

.process-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 2rem;
  left: 1.5rem;
  height: calc(100% + 1rem);
  width: 2px;
  background: #e0e0e0;
  z-index: 0;
}

.step-number {
  width: 3rem;
  height: 3rem;
  background: #1976d2;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 1.5rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.step-content p {
  margin: 0 0 1rem;
  color: #555;
}

.step-image {
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
}

.step-image img {
  width: 100%;
  max-width: 400px;
  object-fit: cover;
}

.case-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #e0e0e0;
}

.filter-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.case-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.case-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.case-item:hover {
  transform: translateY(-5px);
}

.case-images {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f5f7fa;
}

.case-before, .case-after {
  flex: 1;
  position: relative;
}

.case-before img, .case-after img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.arrow {
  font-size: 1.5rem;
  color: #777;
}

.image-label {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.case-info {
  padding: 1rem;
}

.case-info h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.case-car, .case-service {
  margin: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .provider-header {
    flex-direction: column;
    text-align: center;
  }
  
  .provider-logo {
    margin: 0 0 1.5rem;
  }
  
  .provider-actions {
    margin: 1.5rem 0 0;
    width: 100%;
  }
  
  .technicians-list, .certificates-grid, .case-gallery {
    grid-template-columns: 1fr;
  }
  
  .case-images {
    flex-direction: column;
  }
  
  .arrow {
    transform: rotate(90deg);
  }
}
</style> 