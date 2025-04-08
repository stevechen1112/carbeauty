<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">預約服務</h1>
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
          @click="loadBookingData"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          重試
        </button>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左側：服務商信息 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-start">
                <img
                  :src="provider.logo"
                  :alt="provider.name"
                  class="h-16 w-16 rounded-lg object-cover"
                />
                <div class="ml-4">
                  <h2 class="text-xl font-bold text-gray-900">{{ provider.name }}</h2>
                  <div class="mt-1 flex items-center">
                    <span class="text-yellow-400">⭐</span>
                    <span class="ml-2 text-sm text-gray-500">{{ provider.rating }} ({{ provider.reviewCount }} 評價)</span>
                  </div>
                  <p class="mt-2 text-sm text-gray-500">{{ provider.address }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 服務選擇 -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">選擇服務</h3>
              <div class="space-y-4">
                <div
                  v-for="service in provider.services"
                  :key="service.id"
                  @click="selectService(service)"
                  :class="[
                    'border rounded-lg p-4 cursor-pointer transition-all duration-200',
                    selectedService?.id === service.id
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-200 hover:border-primary'
                  ]"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="text-lg font-medium text-gray-900">{{ service.name }}</h4>
                      <p class="mt-1 text-sm text-gray-500">⏱️ 約 {{ service.duration }} 分鐘</p>
                    </div>
                    <span class="text-xl font-bold text-primary">NT$ {{ service.price }}</span>
                  </div>
                  <p class="mt-2 text-sm text-gray-600">{{ service.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 日期和時間選擇 -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">選擇時間</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">日期</label>
                  <div class="relative">
                    <input
                      type="date"
                      v-model="selectedDate"
                      :min="minDate"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">時間</label>
                  <select
                    v-model="selectedTime"
                    :disabled="!selectedDate"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="">請選擇時間</option>
                    <option
                      v-for="time in availableTimes"
                      :key="time"
                      :value="time"
                      :disabled="!isTimeAvailable(time)"
                    >
                      {{ time }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 車輛信息 -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">車輛信息</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">車牌號碼</label>
                  <input
                    type="text"
                    v-model="vehicleInfo.plateNumber"
                    placeholder="請輸入車牌號碼"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">車型</label>
                  <input
                    type="text"
                    v-model="vehicleInfo.model"
                    placeholder="請輸入車型"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">顏色</label>
                  <input
                    type="text"
                    v-model="vehicleInfo.color"
                    placeholder="請輸入顏色"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 備註 -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">備註</h3>
              <textarea
                v-model="notes"
                rows="4"
                placeholder="請輸入特殊需求或注意事項"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 右側：預約摘要 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">預約摘要</h3>
              
              <div class="space-y-4">
                <div v-if="selectedService" class="border-b border-gray-200 pb-4">
                  <h4 class="text-sm font-medium text-gray-500">服務項目</h4>
                  <p class="mt-1 text-lg font-medium text-gray-900">{{ selectedService.name }}</p>
                  <p class="mt-1 text-sm text-gray-500">⏱️ 約 {{ selectedService.duration }} 分鐘</p>
                </div>

                <div v-if="selectedDate" class="border-b border-gray-200 pb-4">
                  <h4 class="text-sm font-medium text-gray-500">預約時間</h4>
                  <p class="mt-1 text-lg font-medium text-gray-900">
                    {{ formatDate(selectedDate) }} {{ selectedTime }}
                  </p>
                </div>

                <div v-if="vehicleInfo.plateNumber" class="border-b border-gray-200 pb-4">
                  <h4 class="text-sm font-medium text-gray-500">車輛信息</h4>
                  <p class="mt-1 text-sm text-gray-900">
                    {{ vehicleInfo.plateNumber }} - {{ vehicleInfo.model }} ({{ vehicleInfo.color }})
                  </p>
                </div>

                <div class="pt-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-500">服務費用</span>
                    <span class="text-lg font-bold text-primary">NT$ {{ selectedService?.price || 0 }}</span>
                  </div>
                </div>

                <button
                  @click="submitBooking"
                  :disabled="!isFormValid"
                  class="w-full mt-6 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  確認預約
                </button>
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
  name: 'Booking',
  data() {
    return {
      loading: true,
      error: null,
      provider: null,
      selectedService: null,
      selectedDate: '',
      selectedTime: '',
      vehicleInfo: {
        plateNumber: '',
        model: '',
        color: ''
      },
      notes: '',
      availableTimes: [
        '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
      ],
      bookedTimes: [] // 模擬已預約的時間
    };
  },
  computed: {
    minDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    },
    isFormValid() {
      return (
        this.selectedService &&
        this.selectedDate &&
        this.selectedTime &&
        this.vehicleInfo.plateNumber &&
        this.vehicleInfo.model &&
        this.vehicleInfo.color
      );
    }
  },
  methods: {
    async loadBookingData() {
      this.loading = true;
      this.error = null;
      
      try {
        // 模擬API調用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.provider = {
          id: this.$route.params.providerId,
          name: '頂級汽車美容中心',
          logo: 'https://via.placeholder.com/64x64?text=Logo',
          rating: 4.8,
          reviewCount: 142,
          address: '台北市信義區松高路123號',
          services: [
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
          ]
        };
        
        this.loading = false;
      } catch (err) {
        this.error = '載入服務商資料失敗，請稍後再試';
        this.loading = false;
      }
    },
    selectService(service) {
      this.selectedService = service;
    },
    isTimeAvailable(time) {
      // 檢查時間是否已被預約
      return !this.bookedTimes.includes(time);
    },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('zh-TW', options);
    },
    async submitBooking() {
      if (!this.isFormValid) return;
      
      try {
        // 這裡應該調用API提交預約
        const bookingData = {
          providerId: this.provider.id,
          serviceId: this.selectedService.id,
          date: this.selectedDate,
          time: this.selectedTime,
          vehicleInfo: this.vehicleInfo,
          notes: this.notes
        };
        
        console.log('提交預約:', bookingData);
        
        // 模擬預約成功
        this.$router.push('/booking/success');
      } catch (err) {
        console.error('預約失敗:', err);
        // 顯示錯誤訊息
      }
    }
  },
  created() {
    this.loadBookingData();
  }
};
</script> 