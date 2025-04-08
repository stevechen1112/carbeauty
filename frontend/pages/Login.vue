<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          登入您的帳號
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或
          <router-link to="/register" class="font-medium text-primary hover:text-primary-dark">
            註冊新帳號
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="form-label">電子郵件</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="input-field"
              placeholder="請輸入電子郵件"
            />
          </div>
          <div class="mt-4">
            <label for="password" class="form-label">密碼</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="input-field"
              placeholder="請輸入密碼"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              記住我
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary hover:text-primary-dark">
              忘記密碼？
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            :disabled="loading"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-primary group-hover:text-primary-dark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ loading ? '登入中...' : '登入' }}
          </button>
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      try {
        loading.value = true
        error.value = ''
        await authStore.login({
          email: email.value,
          password: password.value,
          rememberMe: rememberMe.value
        })
        router.push('/')
      } catch (err) {
        error.value = err.message || '登入失敗，請檢查您的帳號密碼'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      rememberMe,
      loading,
      error,
      handleLogin
    }
  }
}
</script> 