<template>
  <div class="home">
    <div class="hero-section">
      <h1>便捷的汽車美容預約平台</h1>
      <p>尋找最適合您的汽車美容服務商，輕鬆預約，省時省力</p>
      
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="輸入地區、服務或店名..."
          @keyup.enter="searchProviders"
        />
        <button @click="searchProviders" class="search-btn">搜尋</button>
      </div>
    </div>
    
    <div class="features-section">
      <h2>平台特色</h2>
      <div class="features">
        <div class="feature">
          <div class="icon">🔍</div>
          <h3>快速搜尋</h3>
          <p>根據地區和服務類型，快速找到附近的汽車美容服務</p>
        </div>
        <div class="feature">
          <div class="icon">📅</div>
          <h3>線上預約</h3>
          <p>一鍵預約，避免排隊等待，提高效率</p>
        </div>
        <div class="feature">
          <div class="icon">⭐</div>
          <h3>用戶評價</h3>
          <p>查看真實用戶評價，選擇優質服務</p>
        </div>
      </div>
    </div>
    
    <div class="popular-section">
      <h2>熱門服務商</h2>
      <div class="providers-list" v-if="popularProviders.length">
        <div 
          v-for="provider in popularProviders" 
          :key="provider.id" 
          class="provider-card"
          @click="viewProviderDetails(provider.id)"
        >
          <h3>{{ provider.name }}</h3>
          <p>{{ provider.address }}</p>
          <p class="provider-rating">⭐ {{ provider.rating || '暫無評分' }}</p>
        </div>
      </div>
      <p v-else class="no-data">載入中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      searchQuery: '',
      popularProviders: [
        { id: 1, name: '頂級汽車美容中心', address: '台北市信義區松高路123號', rating: 4.8 },
        { id: 2, name: '豪華車專業洗車', address: '台北市大安區敦化南路456號', rating: 4.6 },
        { id: 3, name: '閃亮汽車美容工作室', address: '台北市中山區南京東路789號', rating: 4.7 }
      ]
    };
  },
  methods: {
    searchProviders() {
      if (!this.searchQuery.trim()) return;
      
      // 導航到搜尋結果頁面
      this.$router.push({
        path: '/providers',
        query: { search: this.searchQuery }
      });
    },
    viewProviderDetails(providerId) {
      this.$router.push(`/providers/${providerId}`);
    },
    async fetchPopularProviders() {
      try {
        // 實際應用中應從API獲取熱門服務商
        // const response = await fetch('/api/providers/popular');
        // this.popularProviders = await response.json();
      } catch (error) {
        console.error('獲取熱門服務商失敗:', error);
      }
    }
  },
  created() {
    // 初始化時獲取熱門服務商
    // this.fetchPopularProviders();
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #f0f7ff;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1976d2;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
}

.search-box input {
  flex-grow: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-box input:focus {
  outline: none;
  border-color: #1976d2;
}

.search-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0 24px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #1565c0;
}

.features-section, .popular-section {
  margin-bottom: 3rem;
  padding: 0 1rem;
}

.features-section h2, .popular-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.features {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}

.feature {
  flex: 1;
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.providers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.provider-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s;
}

.provider-card:hover {
  transform: translateY(-5px);
}

.provider-rating {
  color: #f9a825;
  font-weight: bold;
  margin-top: 0.5rem;
}

.no-data {
  text-align: center;
  color: #777;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
}
</style>