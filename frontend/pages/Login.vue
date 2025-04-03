<template>
  <div class="login-container">
    <h1>會員登入</h1>
    
    <div v-if="registrationSuccess" class="success-message">
      註冊成功！請使用您的手機號碼和密碼登入。
    </div>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="phone">手機號碼</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="form.phone" 
          class="form-control" 
          required
          pattern="[0-9]{10}"
          placeholder="請輸入您的手機號碼"
          :disabled="isLoading"
        >
      </div>
      
      <div class="form-group">
        <label for="password">密碼</label>
        <div class="password-input-container">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            v-model="form.password" 
            class="form-control" 
            required
            placeholder="請輸入您的密碼"
            :disabled="isLoading"
          >
          <button 
            type="button"
            class="toggle-password-btn"
            @click="showPassword = !showPassword"
            tabindex="-1"
          >
            {{ showPassword ? '隱藏' : '顯示' }}
          </button>
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn-login" 
          :disabled="isLoading || isLocked"
        >
          {{ loginButtonText }}
        </button>
        
        <div class="register-link">
          還沒有帳號？<router-link to="/register">立即註冊</router-link>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ error }}</div>
      </div>
      
      <div v-if="isLocked" class="locked-message">
        <div class="lock-icon">🔒</div>
        <div class="lock-text">
          由於多次登入失敗，帳號暫時被鎖定。
          <br>請在 <strong>{{ lockCountdown }} 秒</strong> 後再試。
        </div>
      </div>
      
      <div class="security-tips">
        <p class="tips-header">安全提示：</p>
        <ul>
          <li>確保您的密碼包含字母、數字和特殊符號以增強安全性</li>
          <li>請勿在公共設備上存儲登入資訊</li>
          <li>完成操作後請記得登出</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login } from '../services/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(false);
    const error = ref('');
    const showPassword = ref(false);
    const form = reactive({
      phone: '',
      password: ''
    });
    
    // 處理註冊成功的消息
    const registrationSuccess = computed(() => {
      return route.query.registered === 'success';
    });
    
    // 處理登入失敗次數和鎖定狀態
    const failedAttempts = ref(0);
    const isLocked = ref(false);
    const lockCountdown = ref(0);
    let countdownTimer = null;
    
    const loginButtonText = computed(() => {
      if (isLoading.value) return '登入中...';
      if (isLocked.value) return '暫時鎖定';
      return '登入';
    });
    
    // 啟動倒計時器
    const startLockCountdown = (seconds) => {
      isLocked.value = true;
      lockCountdown.value = seconds;
      
      if (countdownTimer) clearInterval(countdownTimer);
      
      countdownTimer = setInterval(() => {
        lockCountdown.value--;
        if (lockCountdown.value <= 0) {
          clearInterval(countdownTimer);
          isLocked.value = false;
          failedAttempts.value = 0;
        }
      }, 1000);
    };
    
    // 登入處理函數
    const handleLogin = async () => {
      if (isLocked.value) return;
      
      try {
        isLoading.value = true;
        error.value = '';
        
        // 添加隨機延遲以防止暴力破解
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        
        const response = await login(form.phone, form.password);
        
        // 成功時重定向到首頁或指定的重定向地址
        const redirectPath = route.query.redirect || '/';
        router.push(redirectPath);
      } catch (err) {
        error.value = err.message || '登入失敗，請檢查您的憑據';
        failedAttempts.value++;
        
        // 根據失敗次數增加鎖定時間
        if (failedAttempts.value >= 5) {
          const lockTime = Math.min(30 * Math.pow(2, failedAttempts.value - 5), 1800); // 最長鎖定30分鐘
          startLockCountdown(lockTime);
        }
      } finally {
        isLoading.value = false;
      }
    };
    
    // 從本地存儲恢復失敗嘗試和鎖定狀態
    onMounted(() => {
      const storedData = localStorage.getItem('login_security');
      if (storedData) {
        const data = JSON.parse(storedData);
        // 檢查是否在5分鐘內
        if (data.timestamp && Date.now() - data.timestamp < 5 * 60 * 1000) {
          failedAttempts.value = data.attempts || 0;
          if (data.lockedUntil && data.lockedUntil > Date.now()) {
            const remainingTime = Math.ceil((data.lockedUntil - Date.now()) / 1000);
            startLockCountdown(remainingTime);
          }
        }
      }
    });
    
    // 保存鎖定狀態到本地存儲
    const saveSecurityState = () => {
      const securityData = {
        attempts: failedAttempts.value,
        timestamp: Date.now(),
        lockedUntil: isLocked.value ? Date.now() + lockCountdown.value * 1000 : null
      };
      localStorage.setItem('login_security', JSON.stringify(securityData));
    };
    
    // 監聽失敗嘗試和鎖定狀態變化
    watch([failedAttempts, isLocked, lockCountdown], saveSecurityState);
    
    onUnmounted(() => {
      if (countdownTimer) clearInterval(countdownTimer);
    });
    
    return {
      form,
      isLoading,
      error,
      handleLogin,
      showPassword,
      registrationSuccess,
      isLocked,
      lockCountdown,
      loginButtonText
    };
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.btn-login:hover:not(:disabled) {
  background-color: #1565c0;
}

.btn-login:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

a {
  color: #1976d2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.input-error {
  color: #f44336;
  font-size: 14px;
  margin-top: 4px;
}

.error-alert {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
}

.password-input-container {
  position: relative;
  display: flex;
}

.password-input-container input {
  flex: 1;
}

.toggle-password-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 0.8rem;
}

.error-message {
  margin-top: 1rem;
  padding: 0.8rem;
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
}

.error-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.error-text {
  color: #d32f2f;
  font-size: 0.9rem;
}

.success-message {
  margin-bottom: 1rem;
  padding: 0.8rem;
  background-color: #e8f5e9;
  border-left: 4px solid #4caf50;
  border-radius: 4px;
  color: #2e7d32;
}

.locked-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
}

.lock-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.lock-text {
  color: #e65100;
  font-size: 0.9rem;
  line-height: 1.5;
}

.security-tips {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #666;
}

.tips-header {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
}

.security-tips ul {
  margin: 0;
  padding-left: 1.5rem;
}

.security-tips li {
  margin-bottom: 0.3rem;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 