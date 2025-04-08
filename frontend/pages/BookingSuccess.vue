<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <svg class="mx-auto h-16 w-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="mt-6 text-2xl font-bold text-gray-900">預約成功！</h2>
      <p class="mt-2 text-sm text-gray-600">
        您的預約已成功提交，請留意我們的確認通知。
      </p>
      <div class="mt-8 space-y-4">
        <router-link
          to="/appointments"
          class="block w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          查看我的預約
        </router-link>
        <router-link
          to="/"
          class="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          返回首頁
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingSuccess'
};
</script> 