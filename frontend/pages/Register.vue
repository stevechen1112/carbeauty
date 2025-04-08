<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          註冊新帳號
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          或
          <router-link to="/login" class="font-medium text-primary hover:text-primary-dark">
            登入現有帳號
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="form-label">姓名</label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="input-field"
              placeholder="請輸入您的姓名"
            />
          </div>
          <div class="mt-4">
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
            <label for="phone" class="form-label">手機號碼</label>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              required
              pattern="[0-9]{10}"
              class="input-field"
              placeholder="請輸入手機號碼"
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
          <div class="mt-4">
            <label for="confirmPassword" class="form-label">確認密碼</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              class="input-field"
              placeholder="請再次輸入密碼"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="acceptTerms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            我同意
            <a href="#" class="font-medium text-primary hover:text-primary-dark">
              服務條款
            </a>
            和
            <a href="#" class="font-medium text-primary hover:text-primary-dark">
              隱私政策
            </a>
          </label>
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
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ loading ? '註冊中...' : '註冊' }}
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
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const name = ref('')
    const email = ref('')
    const phone = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const acceptTerms = ref(false)
    const loading = ref(false)
    const error = ref('')

    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = '兩次輸入的密碼不一致'
        return
      }

      try {
        loading.value = true
        error.value = ''
        await authStore.register({
          name: name.value,
          email: email.value,
          phone: phone.value,
          password: password.value
        })
        router.push({ path: '/login', query: { registered: 'success' } })
      } catch (err) {
        error.value = err.message || '註冊失敗，請稍後再試'
      } finally {
        loading.value = false
      }
    }

    return {
      name,
      email,
      phone,
      password,
      confirmPassword,
      acceptTerms,
      loading,
      error,
      handleRegister
    }
  }
}
</script> 