<template>
  <div class="nearby-page">
    <h1>附近的商家</h1>
    
    <div class="location-bar">
      <div class="current-location">
        <span class="location-icon">📍</span>
        <span v-if="currentLocation">{{ currentLocation }}</span>
        <span v-else>正在獲取您的位置...</span>
      </div>
      <button class="refresh-btn" @click="refreshLocation">
        更新位置
      </button>
    </div>
    
    <div class="search-filters">
      <div class="filter-group">
        <label>服務類型</label>
        <select v-model="filters.serviceType">
          <option value="">全部服務</option>
          <option value="basic">基礎洗車</option>
          <option value="wax">打蠟服務</option>
          <option value="polish">美容拋光</option>
          <option value="interior">內飾清潔</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>距離範圍</label>
        <select v-model="filters.distance">
          <option value="1">1公里內</option>
          <option value="3">3公里內</option>
          <option value="5">5公里內</option>
          <option value="10">10公里內</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>評分篩選</label>
        <select v-model="filters.rating">
          <option value="0">全部評分</option>
          <option value="3">3星以上</option>
          <option value="4">4星以上</option>
          <option value="4.5">4.5星以上</option>
        </select>
      </div>
    </div>
    
    <div class="map-container">
      <!-- 這裡將顯示地圖，實際專案中應整合Google Maps或其他地圖API -->
      <div class="map-placeholder">
        <p>地圖加載中...</p>
        <small>提示: 實際專案中，此處將顯示互動式地圖</small>
      </div>
    </div>
    
    <div class="nearby-shops-list">
      <div v-for="shop in nearbyShops" :key="shop.id" class="shop-card">
        <div class="shop-info">
          <h3>{{ shop.name }}</h3>
          <div class="shop-rating">
            <span class="stars">{{ getStars(shop.rating) }}</span>
            <span class="rating-value">{{ shop.rating }}</span>
            <span class="review-count">({{ shop.reviewCount }}評價)</span>
          </div>
          <p class="shop-address">{{ shop.address }}</p>
          <p class="shop-distance">距離您: {{ shop.distance }}公里</p>
          <div class="shop-status" :class="{ open: shop.isOpen }">
            {{ shop.isOpen ? '營業中' : '已打烊' }}
            <span v-if="shop.isOpen">・今日營業至 {{ shop.closeTime }}</span>
            <span v-else>・明日開始營業時間 {{ shop.openTime }}</span>
          </div>
        </div>
        
        <div class="shop-actions">
          <button class="navigation-btn" @click="navigateTo(shop)">
            <span>🚗</span> 導航前往
          </button>
          <button class="view-btn" @click="viewShopDetails(shop.id)">
            查看詳情
          </button>
        </div>
      </div>
      
      <div v-if="nearbyShops.length === 0" class="empty-state">
        <p>附近沒有找到符合條件的商家</p>
        <button class="action-btn" @click="expandSearch">擴大搜尋範圍</button>
      </div>
    </div>
    
    <div class="parking-info-section">
      <h2>停車資訊</h2>
      <div class="parking-list">
        <div v-for="parking in nearbyParking" :key="parking.id" class="parking-card">
          <div class="parking-info">
            <h4>{{ parking.name }}</h4>
            <p class="parking-address">{{ parking.address }}</p>
            <p class="parking-distance">距離您: {{ parking.distance }}公里</p>
            <div class="parking-status">
              <span class="availability" :class="{ full: parking.availableSpaces === 0 }">
                {{ getParkingStatus(parking) }}
              </span>
              <span class="fee">費率: {{ parking.fee }}</span>
            </div>
          </div>
          
          <button class="navigation-btn small" @click="navigateToParking(parking)">
            導航
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NearbyShops',
  data() {
    return {
      currentLocation: '台北市信義區松高路',
      filters: {
        serviceType: '',
        distance: '5',
        rating: '0'
      },
      nearbyShops: [
        {
          id: 1,
          name: '頂級汽車美容中心',
          rating: 4.8,
          reviewCount: 142,
          address: '台北市信義區松高路123號',
          distance: 0.6,
          isOpen: true,
          openTime: '09:00',
          closeTime: '21:00',
          services: ['basic', 'wax', 'polish', 'interior']
        },
        {
          id: 2,
          name: '豪華車專業洗車',
          rating: 4.6,
          reviewCount: 98,
          address: '台北市信義區忠孝東路五段68號',
          distance: 1.2,
          isOpen: true,
          openTime: '08:30',
          closeTime: '20:00',
          services: ['basic', 'wax', 'interior']
        },
        {
          id: 3,
          name: '閃亮汽車美容工作室',
          rating: 4.7,
          reviewCount: 89,
          address: '台北市大安區敦化南路一段233號',
          distance: 2.5,
          isOpen: false,
          openTime: '10:00',
          closeTime: '19:00',
          services: ['basic', 'polish']
        }
      ],
      nearbyParking: [
        {
          id: 1,
          name: '信義廣場停車場',
          address: '台北市信義區松高路12號B2',
          distance: 0.3,
          availableSpaces: 45,
          totalSpaces: 200,
          fee: '每小時60元'
        },
        {
          id: 2,
          name: '松智路停車場',
          address: '台北市信義區松智路8號',
          distance: 0.8,
          availableSpaces: 0,
          totalSpaces: 80,
          fee: '每小時50元'
        },
        {
          id: 3,
          name: '市府路露天停車場',
          address: '台北市信義區市府路45號',
          distance: 1.1,
          availableSpaces: 12,
          totalSpaces: 50,
          fee: '每小時40元'
        }
      ]
    };
  },
  methods: {
    refreshLocation() {
      // 實際應用中，應使用瀏覽器的地理位置API
      alert('正在更新位置信息...');
      
      // 模擬位置更新延遲
      setTimeout(() => {
        this.currentLocation = '台北市信義區松高路';
        alert('位置已更新！');
      }, 1000);
    },
    getStars(rating) {
      // 生成星星評分的顯示
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      let stars = '★'.repeat(fullStars);
      if (halfStar) stars += '½';
      return stars;
    },
    navigateTo(shop) {
      // 導航到商家
      alert(`將為您導航至: ${shop.name}, ${shop.address}`);
      // 實際應用中，應跳轉到地圖導航
    },
    viewShopDetails(shopId) {
      // 查看商家詳情
      this.$router.push(`/providers/${shopId}`);
    },
    navigateToParking(parking) {
      // 導航到停車場
      alert(`將為您導航至: ${parking.name}, ${parking.address}`);
      // 實際應用中，應跳轉到地圖導航
    },
    getParkingStatus(parking) {
      if (parking.availableSpaces === 0) {
        return '已滿';
      } else if (parking.availableSpaces < parking.totalSpaces * 0.2) {
        return `剩餘車位: ${parking.availableSpaces} (即將滿位)`;
      } else {
        return `剩餘車位: ${parking.availableSpaces}`;
      }
    },
    expandSearch() {
      // 擴大搜尋範圍
      this.filters.distance = '10';
      // 實際應用中，應重新加載數據
    }
  },
  mounted() {
    // 實際應用中，應初始化地圖並獲取用戶位置
    console.log('定位功能頁面已載入');
  }
};
</script>

<style scoped>
.nearby-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.nearby-page h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1976d2;
}

.location-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.current-location {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.location-icon {
  margin-right: 0.5rem;
  font-size: 1.3rem;
}

.refresh-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.refresh-btn:hover {
  background: #1565c0;
}

.search-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.filter-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.map-container {
  height: 300px;
  background: #eee;
  border-radius: 8px;
  margin-bottom: 2rem;
  overflow: hidden;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
}

.nearby-shops-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.shop-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shop-info h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

.shop-rating {
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

.shop-address, .shop-distance {
  margin: 0.25rem 0;
  color: #555;
}

.shop-status {
  margin-top: 0.5rem;
  color: #777;
  font-size: 0.9rem;
}

.shop-status.open {
  color: #4caf50;
}

.shop-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.navigation-btn, .view-btn, .action-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.navigation-btn {
  background: #4caf50;
  color: white;
}

.navigation-btn:hover {
  background: #388e3c;
}

.navigation-btn.small {
  padding: 0.5rem;
  font-size: 0.8rem;
}

.view-btn {
  background: #1976d2;
  color: white;
}

.view-btn:hover {
  background: #1565c0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  grid-column: 1 / -1;
}

.empty-state p {
  color: #777;
  margin-bottom: 1rem;
}

.action-btn {
  background: #f57c00;
  color: white;
  margin: 0 auto;
  max-width: 200px;
}

.action-btn:hover {
  background: #ef6c00;
}

.parking-info-section {
  margin-top: 2rem;
}

.parking-info-section h2 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.3rem;
}

.parking-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.parking-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.parking-info {
  flex: 1;
}

.parking-info h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.parking-address, .parking-distance {
  margin: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
}

.parking-status {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.availability {
  color: #4caf50;
}

.availability.full {
  color: #f44336;
}

.fee {
  color: #777;
}

@media (max-width: 768px) {
  .nearby-shops-list, .parking-list {
    grid-template-columns: 1fr;
  }
  
  .shop-actions {
    flex-direction: column;
  }
  
  .parking-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .parking-card .navigation-btn {
    margin-top: 1rem;
    width: 100%;
  }
}
</style> 