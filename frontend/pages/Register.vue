<template>
  <div class="register-container">
    <h1>註冊新帳號</h1>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="name">用戶名稱</label>
        <input 
          type="text" 
          id="name" 
          v-model="form.name" 
          class="form-control" 
          required
          placeholder="請輸入您的姓名"
        >
      </div>
      
      <div class="form-group">
        <label for="phone">手機號碼</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="form.phone" 
          class="form-control" 
          required
          pattern="[0-9]{10}"
          placeholder="請輸入您的手機號碼，例如: 0912345678"
        >
        <small>請輸入10位數字的手機號碼</small>
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
            @input="checkPasswordStrength"
            placeholder="請設定您的密碼"
          >
          <button 
            type="button"
            class="toggle-password-btn"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? '隱藏' : '顯示' }}
          </button>
        </div>
        
        <!-- 密碼強度指示器 -->
        <div v-if="form.password" class="password-strength">
          <div class="strength-meter">
            <div 
              class="strength-meter-fill" 
              :style="{width: `${passwordStrength.score * 20}%`}"
              :class="passwordStrength.level"
            ></div>
          </div>
          <div class="strength-text" :class="passwordStrength.level">
            密碼強度: {{ strengthLevelText }}
          </div>
        </div>
        
        <!-- 密碼提示 -->
        <div v-if="passwordStrength.feedback.length" class="password-feedback">
          <small>提升密碼安全性:</small>
          <ul>
            <li v-for="(tip, index) in passwordStrength.feedback" :key="index">
              {{ tip }}
            </li>
          </ul>
        </div>
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">確認密碼</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="form.confirmPassword" 
          class="form-control" 
          required
          placeholder="請再次輸入密碼"
        >
        <small v-if="passwordMismatch" class="error-text">兩次輸入的密碼不一致</small>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-register" :disabled="isLoading || passwordMismatch || (form.password && passwordStrength.level === 'weak')">
          {{ isLoading ? '處理中...' : '註冊' }}
        </button>
        <div class="login-link">
          已有帳號？<router-link to="/login">前往登入</router-link>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { register, checkPasswordStrength } from '../services/auth';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const error = ref('');
    const showPassword = ref(false);
    const passwordStrength = ref({ score: 0, level: '', feedback: [] });
    
    const form = reactive({
      name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    
    const passwordMismatch = computed(() => {
      return form.password && 
             form.confirmPassword && 
             form.password !== form.confirmPassword;
    });
    
    const strengthLevelText = computed(() => {
      switch(passwordStrength.value.level) {
        case 'weak': return '弱';
        case 'medium': return '中';
        case 'strong': return '強';
        default: return '';
      }
    });
    
    const checkPasswordStrength = () => {
      if (form.password) {
        passwordStrength.value = checkPasswordStrength(form.password);
      } else {
        passwordStrength.value = { score: 0, level: '', feedback: [] };
      }
    };
    
    const handleSubmit = async () => {
      try {
        if (passwordMismatch.value) {
          error.value = '兩次輸入的密碼不一致';
          return;
        }
        
        isLoading.value = true;
        error.value = '';
        
        // 檢查密碼強度
        const strengthCheck = checkPasswordStrength(form.password);
        if (strengthCheck.level === 'weak') {
          error.value = '密碼強度不足，請參考提示進行修改';
          isLoading.value = false;
          return;
        }
        
        const response = await register({
          name: form.name,
          phone: form.phone,
          password: form.password
        });
        
        // 檢查是否因密碼強度問題而返回的錯誤
        if (response && !response.success && response.feedback) {
          error.value = response.message;
          passwordStrength.value.feedback = response.feedback;
          isLoading.value = false;
          return;
        }
        
        // 註冊成功，重定向到登入頁
        router.push({ 
          path: '/login', 
          query: { registered: 'success' } 
        });
      } catch (err) {
        error.value = err.message || '註冊失敗，請稍後再試';
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      form,
      isLoading,
      error,
      handleSubmit,
      passwordMismatch,
      showPassword,
      passwordStrength,
      strengthLevelText,
      checkPasswordStrength
    };
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

h2 {
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

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
}

.btn-register {
  width: 100%;
  padding: 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.btn-register:hover {
  background-color: #1565c0;
}

.btn-register:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.login-link {
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

.password-strength {
  margin-top: 10px;
}

.strength-meter {
  height: 5px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.strength-meter-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.strength-meter-fill.weak {
  background-color: #ff5252;
}

.strength-meter-fill.medium {
  background-color: #ffc107;
}

.strength-meter-fill.strong {
  background-color: #4caf50;
}

.strength-text {
  font-size: 0.8rem;
  text-align: right;
}

.strength-text.weak {
  color: #ff5252;
}

.strength-text.medium {
  color: #ffc107;
}

.strength-text.strong {
  color: #4caf50;
}

.password-feedback {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #666;
}

.password-feedback ul {
  margin: 5px 0 0 0;
  padding-left: 20px;
}

.password-feedback li {
  margin-bottom: 2px;
}

.error-text {
  color: #ff5252;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}
</style> 