<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 搜尋和篩選區 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div class="flex-1">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜尋服務商名稱、地址或服務類型..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                @input="filterProviders"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <select
                v-model="selectedArea"
                @change="filterProviders"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">全部地區</option>
                <option value="台北市">台北市</option>
                <option value="新北市">新北市</option>
                <option value="桃園市">桃園市</option>
                <option value="台中市">台中市</option>
                <option value="高雄市">高雄市</option>
              </select>
            </div>
            
            <div class="flex-1 min-w-[200px]">
              <select
                v-model="minRating"
                @change="filterProviders"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="0">全部評分</option>
                <option value="3">3星以上</option>
                <option value="4">4星以上</option>
                <option value="4.5">4.5星以上</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="flex flex-wrap gap-4">
            <label v-for="service in ['洗車', '打蠟', '內裝清潔']" :key="service" class="inline-flex items-center">
              <input
                type="checkbox"
                :value="service"
                v-model="selectedServices"
                @change="filterProviders"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span class="ml-2 text-gray-700">{{ service }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 服務商列表 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="filteredProviders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">沒有找到符合條件的服務商</h3>
        <p class="mt-1 text-sm text-gray-500">請嘗試更改搜尋條件</p>
      </div>
      
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="provider in filteredProviders"
          :key="provider.id"
          class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          @click="viewProviderDetails(provider.id)"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <h3 class="text-lg font-medium text-gray-900">{{ provider.name }}</h3>
              <div class="flex items-center">
                <span class="text-yellow-400">⭐</span>
                <span class="ml-1 text-sm font-medium text-gray-900">{{ provider.rating || '暫無評分' }}</span>
              </div>
            </div>
            
            <p class="mt-2 text-sm text-gray-500 flex items-center">
              <svg class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ provider.address }}
            </p>
            
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="service in provider.services"
                :key="service"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary"
              >
                {{ service }}
              </span>
            </div>
            
            <button
              class="mt-6 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              預約服務
            </button>
          </div>
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
    this.filteredProviders = [...this.providers];
    
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
        const matchesQuery = !query || 
          provider.name.toLowerCase().includes(query) || 
          provider.address.toLowerCase().includes(query) ||
          provider.services.some(service => service.toLowerCase().includes(query));
        
        const matchesArea = !this.selectedArea || provider.address.includes(this.selectedArea);
        const matchesRating = provider.rating >= minRating;
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
        await new Promise(resolve => setTimeout(resolve, 500));
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