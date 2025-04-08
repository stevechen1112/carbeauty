<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">商家專業展示</h1>
      </div>
    </div>

    <!-- 主要內容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">載入失敗</h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <button
          @click="loadProviderData"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          重試
        </button>
      </div>
      
      <div v-else class="space-y-8">
        <!-- 商家基本信息 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="flex flex-col md:flex-row md:items-start gap-6">
              <div class="flex-shrink-0">
                <img
                  :src="provider.logo"
                  :alt="provider.name"
                  class="h-32 w-32 rounded-lg object-cover"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ provider.name }}</h2>
                    <div class="mt-2 flex items-center">
                      <div class="flex items-center">
                        <span class="text-yellow-400">⭐</span>
                        <span class="ml-2 text-lg font-medium text-gray-900">{{ provider.rating }}</span>
                        <span class="ml-2 text-sm text-gray-500">({{ provider.reviewCount }} 評價)</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex space-x-3">
                    <button
                      @click="bookService"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      立即預約
                    </button>
                    <button
                      @click="toggleFavorite"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <span v-if="isFavorite" class="text-red-500">❤️ 已收藏</span>
                      <span v-else>🤍 收藏</span>
                    </button>
                  </div>
                </div>
                
                <div class="mt-4 space-y-2">
                  <p class="text-gray-600">{{ provider.address }}</p>
                  <p class="text-gray-600">營業時間: {{ provider.businessHours }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="badge in provider.badges"
                      :key="badge"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary"
                    >
                      {{ badge }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 專業技術展示區 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">專業技術與設備</h3>
            
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in ['facilities', 'technicians', 'certificates']"
                  :key="tab"
                  @click="currentTab = tab"
                  :class="[
                    currentTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  ]"
                >
                  {{ tab === 'facilities' ? '環境設備' : tab === 'technicians' ? '專業技師' : '認證資質' }}
                </button>
              </nav>
            </div>
            
            <!-- 環境設備 -->
            <div v-if="currentTab === 'facilities'" class="mt-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  v-for="(image, index) in provider.facilities"
                  :key="index"
                  class="group relative rounded-lg overflow-hidden cursor-pointer"
                  @click="viewImage(image.url)"
                >
                  <img
                    :src="image.url"
                    :alt="image.description"
                    class="w-full h-64 object-cover group-hover:opacity-75 transition-opacity duration-200"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                      <p class="text-white text-sm">{{ image.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 專業技師 -->
            <div v-else-if="currentTab === 'technicians'" class="mt-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(technician, index) in provider.technicians"
                  :key="index"
                  class="bg-gray-50 rounded-lg p-6"
                >
                  <div class="flex items-center">
                    <img
                      :src="technician.avatar"
                      :alt="technician.name"
                      class="h-16 w-16 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <h4 class="text-lg font-medium text-gray-900">{{ technician.name }}</h4>
                      <p class="text-sm text-gray-500">{{ technician.title }}</p>
                    </div>
                  </div>
                  <p class="mt-4 text-gray-600">{{ technician.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- 認證資質 -->
            <div v-else class="mt-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  v-for="(cert, index) in provider.certificates"
                  :key="index"
                  class="bg-gray-50 rounded-lg p-6"
                >
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-medium text-gray-900">{{ cert.name }}</h4>
                      <p class="text-sm text-gray-500">{{ cert.issuer }}</p>
                      <p class="mt-2 text-gray-600">{{ cert.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 服務流程 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">我們的服務流程</h3>
            <div class="space-y-6">
              <div
                v-for="(step, index) in provider.serviceProcess"
                :key="index"
                class="flex items-start"
              >
                <div class="flex-shrink-0">
                  <div class="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-bold">
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="text-lg font-medium text-gray-900">{{ step.title }}</h4>
                  <p class="mt-2 text-gray-600">{{ step.description }}</p>
                  <img
                    v-if="step.image"
                    :src="step.image"
                    :alt="step.title"
                    class="mt-4 rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 案例展示 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">服務案例展示</h3>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <button
                v-for="filter in caseFilters"
                :key="filter.value"
                @click="currentCaseFilter = filter.value"
                :class="[
                  currentCaseFilter === filter.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  'px-3 py-1 rounded-full text-sm font-medium'
                ]"
              >
                {{ filter.label }}
              </button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(caseItem, index) in filteredCases"
                :key="index"
                class="group relative rounded-lg overflow-hidden cursor-pointer"
                @click="viewCase(caseItem)"
              >
                <img
                  :src="caseItem.beforeImage"
                  :alt="caseItem.title"
                  class="w-full h-64 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <h4 class="text-white font-medium">{{ caseItem.title }}</h4>
                    <p class="text-white/80 text-sm mt-1">{{ caseItem.description }}</p>
                  </div>
                </div>
              </div>
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
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
              name: '張師傅',
              title: '資深技師',
              avatar: 'https://via.placeholder.com/64x64?text=張',
              description: '擁有15年汽車美容經驗，專精於車漆修復和鍍膜技術'
            },
            {
              name: '李師傅',
              title: '內裝專家',
              avatar: 'https://via.placeholder.com/64x64?text=李',
              description: '專注於內裝清潔和皮革保養，細心且專業'
            },
            {
              name: '王師傅',
              title: '技術總監',
              avatar: 'https://via.placeholder.com/64x64?text=王',
              description: '負責技術培訓和品質把控，確保服務標準'
            }
          ],
          certificates: [
            {
              name: '國際汽車美容協會認證',
              issuer: 'IADA',
              description: '通過國際汽車美容協會的專業認證，具備國際級服務水準'
            },
            {
              name: '環保認證',
              issuer: '環保署',
              description: '使用環保清潔劑，符合環保標準'
            }
          ],
          serviceProcess: [
            {
              title: '預約確認',
              description: '確認預約時間和服務項目，準備所需材料和設備'
            },
            {
              title: '車輛檢查',
              description: '詳細檢查車輛狀況，記錄需要特別注意的部位'
            },
            {
              title: '專業施工',
              description: '按照標準流程進行施工，確保每個步驟的品質'
            },
            {
              title: '品質檢查',
              description: '完成後進行全面檢查，確保服務品質'
            }
          ],
          cases: [
            {
              type: 'exterior',
              title: '車漆修復',
              description: '修復車身刮痕，恢復原有光澤',
              beforeImage: 'https://via.placeholder.com/600x400?text=修復前',
              afterImage: 'https://via.placeholder.com/600x400?text=修復後'
            },
            {
              type: 'interior',
              title: '內裝深度清潔',
              description: '徹底清潔內裝，去除異味',
              beforeImage: 'https://via.placeholder.com/600x400?text=清潔前',
              afterImage: 'https://via.placeholder.com/600x400?text=清潔後'
            },
            {
              type: 'coating',
              title: '鍍膜護理',
              description: '專業鍍膜，提供長期保護',
              beforeImage: 'https://via.placeholder.com/600x400?text=鍍膜前',
              afterImage: 'https://via.placeholder.com/600x400?text=鍍膜後'
            }
          ]
        };
        
        this.loading = false;
      } catch (err) {
        this.error = '載入商家資料失敗，請稍後再試';
        this.loading = false;
      }
    },
    viewImage(url) {
      // 這裡可以實現圖片預覽功能
      console.log('查看圖片:', url);
    },
    viewCase(caseItem) {
      // 這裡可以實現案例詳情查看功能
      console.log('查看案例:', caseItem);
    },
    bookService() {
      this.$router.push(`/providers/${this.provider.id}/book`);
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      // 這裡可以實現收藏功能
    }
  },
  created() {
    this.providerId = this.$route.params.id;
    this.loadProviderData();
  }
};
</script> 