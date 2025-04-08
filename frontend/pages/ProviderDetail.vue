<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 服務商頭部信息 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row md:items-start gap-8">
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{{ provider.name }}</h1>
                <div class="mt-2 flex items-center">
                  <div class="flex items-center">
                    <span class="text-yellow-400">⭐</span>
                    <span class="ml-2 text-lg font-medium text-gray-900">{{ provider.rating || '暫無評分' }}</span>
                    <span class="ml-2 text-sm text-gray-500">({{ provider.reviewCount || 0 }}條評價)</span>
                  </div>
                </div>
              </div>
              <button
                @click="viewShowcase"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                查看專業展示
              </button>
            </div>
            
            <div class="mt-6 space-y-4">
              <div class="flex items-center text-gray-500">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ provider.address }}
              </div>
              
              <div class="flex items-center text-gray-500">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {{ provider.phone }}
              </div>
              
              <div class="flex items-center text-gray-500">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                營業時間: {{ provider.businessHours }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要內容區域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左側內容 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 關於我們 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">關於我們</h2>
            <p class="text-gray-600 leading-relaxed">{{ provider.description }}</p>
          </div>
          
          <!-- 服務列表 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">提供服務</h2>
            <div class="grid grid-cols-1 gap-4">
              <div
                v-for="service in provider.servicesList"
                :key="service.id"
                class="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors duration-200"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ service.name }}</h3>
                    <p class="mt-1 text-sm text-gray-500">⏱️ 服務時間: 約{{ service.duration }}分鐘</p>
                  </div>
                  <span class="text-xl font-bold text-primary">NT$ {{ service.price }}</span>
                </div>
                <p class="mt-2 text-gray-600">{{ service.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- 用戶評價 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">用戶評價</h2>
            <div v-if="provider.reviews && provider.reviews.length > 0" class="space-y-4">
              <div
                v-for="(review, index) in provider.reviews"
                :key="index"
                class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
              >
                <div class="flex justify-between items-start">
                  <div class="flex items-center">
                    <span class="text-gray-900 font-medium">{{ review.userName }}</span>
                    <div class="ml-2 flex items-center">
                      <span class="text-yellow-400">⭐</span>
                      <span class="ml-1 text-sm text-gray-500">{{ review.rating }}</span>
                    </div>
                  </div>
                  <span class="text-sm text-gray-500">{{ review.date }}</span>
                </div>
                <p class="mt-2 text-gray-600">{{ review.comment }}</p>
              </div>
            </div>
            <p v-else class="text-center text-gray-500 py-4">還沒有評價，成為第一個評價的用戶吧！</p>
          </div>
        </div>
        
        <!-- 右側預約表單 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">預約服務</h2>
            <form @submit.prevent="submitBooking" class="space-y-4">
              <div>
                <label for="service" class="block text-sm font-medium text-gray-700">選擇服務</label>
                <select
                  id="service"
                  v-model="selectedService"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                >
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
              
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700">選擇日期</label>
                <input
                  type="date"
                  id="date"
                  v-model="bookingDate"
                  :min="minDate"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                />
              </div>
              
              <div>
                <label for="time" class="block text-sm font-medium text-gray-700">選擇時間</label>
                <select
                  id="time"
                  v-model="bookingTime"
                  :disabled="!bookingDate"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                >
                  <option value="">請選擇時間</option>
                  <option
                    v-for="time in availableTimes"
                    :key="time"
                    :value="time"
                  >{{ time }}</option>
                </select>
              </div>
              
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700">備註</label>
                <textarea
                  id="notes"
                  v-model="bookingNotes"
                  rows="3"
                  placeholder="如車型、特殊需求等"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                ></textarea>
              </div>
              
              <button
                type="submit"
                :disabled="!isFormValid || !isLoggedIn"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoggedIn ? '確認預約' : '請先登入' }}
              </button>
              
              <p v-if="!isLoggedIn" class="text-center text-sm text-gray-500">
                <router-link to="/login" class="text-primary hover:text-primary-dark">登入</router-link> 後即可預約服務
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
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
    
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  },
  methods: {
    async fetchProviderDetails() {
      const providerId = this.$route.params.id;
      
      // 模擬API調用
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
              date: '2023-05-15',
              comment: '服務非常專業，工作人員態度很好，車子洗得很乾淨，下次還會再來！'
            },
            {
              userName: '李小姐',
              rating: 4,
              date: '2023-05-10',
              comment: '整體服務不錯，但等待時間稍長，建議提前預約。'
            }
          ]
        };
      }, 500);
    },
    viewShowcase() {
      this.$router.push(`/providers/${this.provider.id}/showcase`);
    },
    submitBooking() {
      if (!this.isFormValid) return;
      
      // 這裡應該調用API提交預約
      console.log('提交預約:', {
        serviceId: this.selectedService,
        date: this.bookingDate,
        time: this.bookingTime,
        notes: this.bookingNotes
      });
    }
  }
};
</script> 