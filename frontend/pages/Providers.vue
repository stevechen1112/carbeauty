<template>
  <div class="providers-container">
    <div class="search-filter">
      <h2>搜尋服務商</h2>
      <div class="search-input">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="輸入服務商名稱、地址或服務類型..."
          @input="filterProviders"
        />
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <h3>地區</h3>
          <select v-model="selectedArea" @change="filterProviders">
            <option value="">全部地區</option>
            <option value="台北市">台北市</option>
            <option value="新北市">新北市</option>
            <option value="桃園市">桃園市</option>
            <option value="台中市">台中市</option>
            <option value="高雄市">高雄市</option>
          </select>
        </div>
        
        <div class="filter-group">
          <h3>評分</h3>
          <select v-model="minRating" @change="filterProviders">
            <option value="0">全部評分</option>
            <option value="3">3星以上</option>
            <option value="4">4星以上</option>
            <option value="4.5">4.5星以上</option>
          </select>
        </div>
        
        <div class="filter-group">
          <h3>服務種類</h3>
          <div class="checkbox-group">
            <label>
              <input type="checkbox" value="洗車" v-model="selectedServices" @change="filterProviders"> 洗車
            </label>
            <label>
              <input type="checkbox" value="打蠟" v-model="selectedServices" @change="filterProviders"> 打蠟
            </label>
            <label>
              <input type="checkbox" value="內裝清潔" v-model="selectedServices" @change="filterProviders"> 內裝清潔
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <div class="providers-list">
      <div v-if="loading" class="loading">載入中...</div>
      
      <div v-else-if="filteredProviders.length === 0" class="no-results">
        <p>沒有找到符合條件的服務商。請嘗試更改搜尋條件。</p>
      </div>
      
      <div v-else class="providers-grid">
        <div 
          v-for="provider in filteredProviders" 
          :key="provider.id" 
          class="provider-card"
          @click="viewProviderDetails(provider.id)"
        >
          <div class="provider-header">
            <h3>{{ provider.name }}</h3>
            <div class="rating">
              <span>⭐ {{ provider.rating || '暫無評分' }}</span>
            </div>
          </div>
          
          <p class="address">📍 {{ provider.address }}</p>
          
          <div class="services">
            <span v-for="(service, index) in provider.services" :key="index" class="service-tag">
              {{ service }}
            </span>
          </div>
          
          <button class="book-btn">預約服務</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Providers',
  data() {
    return {
      providers: [
        { 
          id: 1, 
          name: '頂級汽車美容中心', 
          address: '台北市信義區松高路123號', 
          rating: 4.8,
          services: ['洗車', '打蠟', '內裝清潔']
        },
        { 
          id: 2, 
          name: '豪華車專業洗車', 
          address: '台北市大安區敦化南路456號', 
          rating: 4.6,
          services: ['洗車', '打蠟']
        },
        { 
          id: 3, 
          name: '閃亮汽車美容工作室', 
          address: '台北市中山區南京東路789號', 
          rating: 4.7,
          services: ['洗車', '內裝清潔']
        },
        { 
          id: 4, 
          name: '專業汽車美容', 
          address: '新北市板橋區縣民大道100號', 
          rating: 4.4,
          services: ['洗車', '打蠟', '內裝清潔']
        },
        { 
          id: 5, 
          name: '極速洗車中心', 
          address: '桃園市中壢區中華路200號', 
          rating: 4.2,
          services: ['洗車']
        }
      ],
      filteredProviders: [],
      searchQuery: '',
      selectedArea: '',
      minRating: '0',
      selectedServices: [],
      loading: false
    };
  },
  created() {
    // 初始化時設置過濾後的提供商列表
    this.filteredProviders = [...this.providers];
    
    // 從URL獲取搜尋參數
    if (this.$route.query.search) {
      this.searchQuery = this.$route.query.search;
      this.filterProviders();
    }
  },
  methods: {
    filterProviders() {
      const query = this.searchQuery.toLowerCase().trim();
      const minRating = parseFloat(this.minRating);
      
      this.filteredProviders = this.providers.filter(provider => {
        // 檢查名稱或地址是否匹配搜尋查詢
        const matchesQuery = !query || 
          provider.name.toLowerCase().includes(query) || 
          provider.address.toLowerCase().includes(query) ||
          provider.services.some(service => service.toLowerCase().includes(query));
        
        // 檢查地區篩選
        const matchesArea = !this.selectedArea || provider.address.includes(this.selectedArea);
        
        // 檢查評分篩選
        const matchesRating = provider.rating >= minRating;
        
        // 檢查服務類型篩選
        const matchesServices = this.selectedServices.length === 0 || 
          this.selectedServices.every(service => provider.services.includes(service));
        
        return matchesQuery && matchesArea && matchesRating && matchesServices;
      });
    },
    viewProviderDetails(providerId) {
      this.$router.push(`/providers/${providerId}`);
    },
    async fetchProviders() {
      this.loading = true;
      try {
        // 實際應用中應從API獲取服務商數據
        // const response = await fetch('/api/providers');
        // const data = await response.json();
        // this.providers = data;
        // this.filteredProviders = [...this.providers];
        
        // 模擬API延遲
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 已有靜態數據，所以這裡只是模擬加載
        this.filteredProviders = [...this.providers];
      } catch (error) {
        console.error('獲取服務商失敗:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchProviders();
  }
};
</script>

<style scoped>
.providers-container {
  display: flex;
  gap: 2rem;
}

.search-filter {
  flex: 0 0 250px;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  position: sticky;
  top: 20px;
}

.search-filter h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: #1976d2;
}

.search-input {
  margin-bottom: 1.5rem;
}

.search-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
}

.filters h3 {
  font-size: 1rem;
  margin: 1rem 0 0.5rem;
  color: #555;
}

.filter-group {
  margin-bottom: 1rem;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.providers-list {
  flex: 1;
}

.loading, .no-results {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.no-results p {
  color: #666;
}

.providers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.provider-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.provider-card:hover {
  transform: translateY(-5px);
}

.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.provider-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #1976d2;
}

.rating {
  font-weight: bold;
  color: #f9a825;
}

.address {
  color: #555;
  margin-bottom: 1rem;
}

.services {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.service-tag {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.book-btn {
  width: 100%;
  padding: 10px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.book-btn:hover {
  background-color: #1565c0;
}

@media (max-width: 768px) {
  .providers-container {
    flex-direction: column;
  }
  
  .search-filter {
    flex: auto;
    position: static;
    width: 100%;
  }
  
  .providers-grid {
    grid-template-columns: 1fr;
  }
}
</style>