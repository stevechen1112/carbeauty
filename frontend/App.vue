<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-2xl font-bold text-primary">
                汽車美容預約
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/" 
                class="nav-link"
                :class="{ 'nav-link-active': $route.path === '/' }"
              >
                首頁
              </router-link>
              <router-link 
                to="/providers" 
                class="nav-link"
                :class="{ 'nav-link-active': $route.path === '/providers' }"
              >
                服務商
              </router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <template v-if="isAuthenticated">
              <router-link 
                to="/profile" 
                class="nav-link"
                :class="{ 'nav-link-active': $route.path === '/profile' }"
              >
                個人資料
              </router-link>
              <button 
                @click="logout" 
                class="ml-4 btn-secondary"
              >
                登出
              </button>
            </template>
            <template v-else>
              <router-link 
                to="/login" 
                class="btn-primary"
              >
                登入
              </router-link>
              <router-link 
                to="/register" 
                class="ml-4 btn-secondary"
              >
                註冊
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-white shadow-sm mt-8">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          © 2024 汽車美容預約平台. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const isAuthenticated = ref(false)

    onMounted(() => {
      isAuthenticated.value = authStore.isAuthenticated
    })

    const logout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('登出失敗:', error)
      }
    }

    return {
      isAuthenticated,
      logout
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>