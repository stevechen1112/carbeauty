/**
 * API 客戶端 - 集中管理所有 API 請求配置
 */
import axios from 'axios';
import { getToken, logout } from './auth.js';

// 創建 Axios 實例
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 請求攔截器 - 添加身份驗證標頭
apiClient.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('請求錯誤:', error);
    return Promise.reject(error);
  }
);

// 響應攔截器 - 統一處理錯誤
apiClient.interceptors.response.use(
  response => {
    // 直接返回響應數據，簡化使用
    return response.data;
  },
  error => {
    // 更詳細的錯誤處理
    if (error.response) {
      // 服務器返回錯誤狀態碼
      const status = error.response.status;
      
      // 處理 401 授權錯誤
      if (status === 401) {
        console.error('授權已過期或無效，請重新登入');
        // 登出用戶，清除無效憑證
        logout();
        // 重定向到登入頁面
        window.location.href = '/login';
      }
      
      // 處理 403 禁止訪問錯誤
      if (status === 403) {
        console.error('您沒有權限訪問此資源');
      }
      
      // 處理 404 未找到錯誤
      if (status === 404) {
        console.error('請求的資源不存在');
      }
      
      // 處理 429 請求過多錯誤
      if (status === 429) {
        console.error('請求過於頻繁，請稍後再試');
      }
      
      // 處理 500 系列服務器錯誤
      if (status >= 500) {
        console.error('服務器錯誤，請稍後再試');
      }
      
      // 返回服務器錯誤信息，便於上層處理
      return Promise.reject({
        status,
        message: error.response.data.message || `請求失敗 (${status})`,
        data: error.response.data
      });
    } else if (error.request) {
      // 請求已發送但未收到響應
      console.error('無法連接到服務器，請檢查您的網絡連接');
      return Promise.reject({
        status: 0,
        message: '網絡連接失敗，請檢查您的網絡設置後重試'
      });
    } else {
      // 請求設置過程中發生錯誤
      console.error('請求配置錯誤:', error.message);
      return Promise.reject({
        status: 0,
        message: '發送請求時出錯: ' + error.message
      });
    }
  }
);

export default apiClient; 