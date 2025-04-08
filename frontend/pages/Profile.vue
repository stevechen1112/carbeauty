<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 頁面標題 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">個人資料</h1>
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
          @click="loadProfileData"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          重試
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左側：個人信息 & 密碼修改 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 基本資料 -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">基本資料</h3>
              <div class="flex items-center space-x-4 mb-6">
                <img
                  :src="user.avatar || 'https://via.placeholder.com/80?text=User'"
                  alt="User Avatar"
                  class="h-20 w-20 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h4 class="text-xl font-bold text-gray-900">{{ user.name }}</h4>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                  <button class="mt-2 text-sm text-primary hover:underline">更換頭像</button>
                </div>
              </div>

              <form @submit.prevent="updateProfile" class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    id="name"
                    v-model="profileForm.name"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700">電子郵件</label>
                  <input
                    type="email"
                    id="email"
                    v-model="profileForm.email"
                    disabled
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700">電話號碼</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="profileForm.phone"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div class="pt-2 text-right">
                  <button
                    type="submit"
                    :disabled="profileUpdating"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                    <span v-if="profileUpdating" class="mr-2">
                      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    {{ profileUpdating ? '更新中...' : '儲存變更' }}
                  </button>
                </div>
                <p v-if="profileUpdateSuccess" class="text-sm text-green-600">個人資料已成功更新！</p>
                <p v-if="profileUpdateError" class="text-sm text-red-600">{{ profileUpdateError }}</p>
              </form>
            </div>
          </div>

          <!-- 修改密碼 -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">修改密碼</h3>
              <form @submit.prevent="updatePassword" class="space-y-4">
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700">目前密碼</label>
                  <input
                    type="password"
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700">新密碼</label>
                  <input
                    type="password"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700">確認新密碼</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                   <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">新密碼與確認密碼不符。</p>
                </div>
                <div class="pt-2 text-right">
                  <button
                    type="submit"
                    :disabled="passwordUpdating || passwordMismatch"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  >
                     <span v-if="passwordUpdating" class="mr-2">
                      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    {{ passwordUpdating ? '更新中...' : '更新密碼' }}
                  </button>
                </div>
                 <p v-if="passwordUpdateSuccess" class="text-sm text-green-600">密碼已成功更新！</p>
                 <p v-if="passwordUpdateError" class="text-sm text-red-600">{{ passwordUpdateError }}</p>
              </form>
            </div>
          </div>
        </div>

        <!-- 右側：預約記錄 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">預約記錄</h3>
              <div v-if="bookings.length === 0" class="text-center text-gray-500 py-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-2">目前沒有預約記錄</p>
              </div>
              <ul v-else class="space-y-4 max-h-96 overflow-y-auto pr-2">
                <li v-for="booking in bookings" :key="booking.id" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <p class="font-semibold text-gray-800">{{ booking.providerName }}</p>
                      <p class="text-sm text-gray-600">{{ booking.serviceName }}</p>
                    </div>
                    <span
                      :class="[
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        bookingStatusClass(booking.status)
                      ]"
                    >
                      {{ formatBookingStatus(booking.status) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-500 flex justify-between items-center">
                    <span>{{ formatDate(booking.dateTime) }}</span>
                    <span>NT$ {{ booking.price }}</span>
                  </div>
                  <div class="mt-2 text-right">
                     <router-link :to="`/booking/${booking.id}`" class="text-sm text-primary hover:underline">查看詳情</router-link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      loading: true,
      error: null,
      user: null,
      profileForm: {
        name: '',
        email: '',
        phone: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      bookings: [],
      profileUpdating: false,
      profileUpdateSuccess: false,
      profileUpdateError: null,
      passwordUpdating: false,
      passwordUpdateSuccess: false,
      passwordUpdateError: null
    };
  },
  computed: {
    passwordMismatch() {
      return this.passwordForm.newPassword && this.passwordForm.confirmPassword && this.passwordForm.newPassword !== this.passwordForm.confirmPassword;
    }
  },
  methods: {
    async loadProfileData() {
      this.loading = true;
      this.error = null;
      this.profileUpdateSuccess = false;
      this.profileUpdateError = null;
      this.passwordUpdateSuccess = false;
      this.passwordUpdateError = null;

      try {
        // 模擬API調用
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 假設從API獲取的用戶資料
        this.user = {
          id: 'user123',
          name: '陳大明',
          email: 'daminchen@example.com',
          phone: '0912345678',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        this.profileForm.name = this.user.name;
        this.profileForm.email = this.user.email;
        this.profileForm.phone = this.user.phone;

        // 假設從API獲取的預約記錄
        this.bookings = [
          {
            id: 'booking1',
            providerName: '極速汽車美容',
            serviceName: '精緻洗車',
            dateTime: '2024-08-15T10:00:00',
            status: 'confirmed',
            price: 650
          },
          {
            id: 'booking2',
            providerName: '亮晶晶汽車護理',
            serviceName: '基礎洗車',
            dateTime: '2024-08-10T14:30:00',
            status: 'completed',
            price: 350
          },
           {
            id: 'booking3',
            providerName: '頂級汽車美容中心',
            serviceName: '車身打蠟',
            dateTime: '2024-07-25T09:00:00',
            status: 'cancelled',
            price: 1200
          }
        ];

        this.loading = false;
      } catch (err) {
        this.error = '載入個人資料失敗，請稍後再試';
        this.loading = false;
      }
    },
    async updateProfile() {
      this.profileUpdating = true;
      this.profileUpdateSuccess = false;
      this.profileUpdateError = null;
      try {
        // 模擬API調用
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('更新個人資料:', this.profileForm);
        // 更新成功後的操作
        this.user.name = this.profileForm.name; // 僅為演示，實際應重新加載數據或更新本地狀態
        this.user.phone = this.profileForm.phone;
        this.profileUpdateSuccess = true;
        setTimeout(() => this.profileUpdateSuccess = false, 3000);
      } catch (err) {
        console.error('更新個人資料失敗:', err);
        this.profileUpdateError = '更新失敗，請稍後再試';
      } finally {
        this.profileUpdating = false;
      }
    },
    async updatePassword() {
       if (this.passwordMismatch) return;
       this.passwordUpdating = true;
       this.passwordUpdateSuccess = false;
       this.passwordUpdateError = null;
      try {
        // 模擬API調用
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('更新密碼:', {
          currentPassword: '******', // 不建議在日誌中打印真實密碼
          newPassword: '******'
        });
        // 清空表單
        this.passwordForm.currentPassword = '';
        this.passwordForm.newPassword = '';
        this.passwordForm.confirmPassword = '';
        this.passwordUpdateSuccess = true;
        setTimeout(() => this.passwordUpdateSuccess = false, 3000);
      } catch (err) {
        console.error('更新密碼失敗:', err);
         this.passwordUpdateError = '更新密碼失敗，請檢查目前密碼是否正確';
      } finally {
         this.passwordUpdating = false;
      }
    },
    formatDate(dateTimeString) {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateTimeString).toLocaleString('zh-TW', options);
    },
    formatBookingStatus(status) {
      const statusMap = {
        confirmed: '已確認',
        completed: '已完成',
        cancelled: '已取消'
      };
      return statusMap[status] || '未知狀態';
    },
     bookingStatusClass(status) {
      switch (status) {
        case 'confirmed':
          return 'bg-blue-100 text-blue-800';
        case 'completed':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  },
  created() {
    this.loadProfileData();
  }
};
</script> 