// 使用 Vue 3 的響應式 API 實現簡單的狀態管理
import { reactive, computed } from 'vue';

// 狀態對象
const state = reactive({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false
});

// 身份驗證存儲
export function useAuthStore() {
  // 計算屬性
  const isAdmin = computed(() => {
    return state.user && state.user.role === 'admin';
  });

  // 登入方法
  const login = async (credentials) => {
    try {
      // 在實際應用中，這裡應該調用 API
      // 這裡僅用於模擬
      console.log('登入...', credentials);
      
      // 示例用戶數據
      const user = {
        id: 'user123',
        name: '測試用戶',
        email: credentials.email,
        role: credentials.email.includes('admin') ? 'admin' : 'user'
      };
      
      // 示例 token
      const token = 'mock_token_' + Math.random().toString(36).substring(2);
      
      // 更新狀態
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      // 保存 token 到本地存儲
      localStorage.setItem('token', token);
      
      return { success: true, user };
    } catch (error) {
      console.error('登入失敗:', error);
      return { success: false, error: error.message || '登入失敗' };
    }
  };

  // 登出方法
  const logout = () => {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    localStorage.removeItem('token');
  };

  // 檢查身份驗證狀態
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // 在實際應用中，這裡應該驗證 token 的有效性
      // 這裡僅用於模擬
      state.token = token;
      state.isAuthenticated = true;
      
      // 示例用戶數據
      state.user = {
        id: 'user123',
        name: '測試用戶',
        email: 'test@example.com',
        role: 'user'
      };
      
      return true;
    }
    return false;
  };

  return {
    // 暴露狀態
    user: computed(() => state.user),
    token: computed(() => state.token),
    isAuthenticated: computed(() => state.isAuthenticated),
    isAdmin,
    
    // 暴露方法
    login,
    logout,
    checkAuth
  };
} 