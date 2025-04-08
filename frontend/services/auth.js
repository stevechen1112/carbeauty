/**
 * 認證服務 - 處理用戶認證相關功能
 */

import axios from 'axios';

const API_URL = '/api';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

let passwordCheckInProgress = false; // 避免無窮遞迴的標記

/**
 * 檢查密碼強度
 * @param {string} password - 用戶密碼
 * @returns {object} - 包含密碼強度評估和建議的對象
 */
export function checkPasswordStrength(password) {
  // 防止遞迴調用導致堆棧溢出
  if (passwordCheckInProgress) {
    return { score: 0, level: 'weak', feedback: ['出現錯誤，請稍後再試'] };
  }
  
  try {
    passwordCheckInProgress = true;
    
    let strength = 0;
    let feedback = [];

    // 檢查長度
    if (password.length < 8) {
      feedback.push('密碼應至少包含8個字符');
    } else {
      strength += 1;
    }

    // 檢查是否包含數字
    if (/\d/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個數字');
    }

    // 檢查是否包含小寫字母
    if (/[a-z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個小寫字母');
    }

    // 檢查是否包含大寫字母
    if (/[A-Z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個大寫字母');
    }

    // 檢查是否包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個特殊字符');
    }

    // 評估強度
    let strengthLevel = 'weak';
    if (strength >= 4) {
      strengthLevel = 'strong';
    } else if (strength >= 3) {
      strengthLevel = 'medium';
    }

    return {
      score: strength,
      level: strengthLevel,
      feedback
    };
  } finally {
    passwordCheckInProgress = false; // 確保無論如何都重置標記
  }
}

/**
 * 用戶登入
 * @param {string} phone - 用戶手機號
 * @param {string} password - 用戶密碼
 * @returns {Promise} - 登入結果
 */
export async function login(phone, password) {
  try {
    // 開發環境下使用模擬登入
    if (import.meta.env.DEV) {
      console.log('開發環境: 使用模擬登入', phone, password);
      
      // 管理員測試帳號
      if (phone === '0911111111' && password === 'admin123') {
        const mockUserData = {
          id: 1,
          name: '管理員',
          phone: phone,
          role: 'admin',
          email: 'admin@example.com'
        };
        
        const mockToken = 'dev-admin-token-' + Date.now();
        
        // 存儲token和用戶信息
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(USER_KEY, JSON.stringify(mockUserData));
        
        return {
          user: mockUserData,
          token: mockToken,
          success: true
        };
      }
      
      // 普通用戶測試帳號
      if (phone === '0912345678' && password === 'password123') {
        const mockUserData = {
          id: 2,
          name: '普通用戶',
          phone: phone,
          role: 'user',
          email: 'user@example.com'
        };
        
        const mockToken = 'dev-user-token-' + Date.now();
        
        // 存儲token和用戶信息
        localStorage.setItem(TOKEN_KEY, mockToken);
        localStorage.setItem(USER_KEY, JSON.stringify(mockUserData));
        
        return {
          user: mockUserData,
          token: mockToken,
          success: true
        };
      }
      
      // 登入失敗
      throw new Error('手機號碼或密碼錯誤');
    }
    
    // 生產環境下調用實際API
    const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
    
    if (response.data.token) {
      // 存儲token和用戶信息到本地存儲
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      
      // 分發存儲事件，以便其他窗口/標籤頁能夠更新認證狀態
      window.dispatchEvent(new StorageEvent('storage', {
        key: TOKEN_KEY,
        newValue: response.data.token
      }));
    }
    
    return response.data;
  } catch (error) {
    // 安全地處理錯誤
    if (error.response) {
      // 如果服務器返回了錯誤狀態碼
      throw new Error(error.response.data.message || '登入失敗，請檢查您的憑據');
    } else if (error.request) {
      // 如果請求已發送但未收到響應
      throw new Error('無法連接到服務器，請檢查您的網絡連接');
    } else {
      // 在設置請求時發生錯誤
      throw new Error('登入過程中發生錯誤: ' + error.message);
    }
  }
}

/**
 * 用戶註冊
 * @param {object} userData - 用戶數據
 * @returns {Promise} - 註冊結果
 */
export async function register(userData) {
  try {
    // 先檢查密碼強度，直接使用邏輯而不是呼叫函數以避免無窮遞迴
    let strength = 0;
    let feedback = [];
    const password = userData.password;

    // 檢查長度
    if (password.length < 8) {
      feedback.push('密碼應至少包含8個字符');
    } else {
      strength += 1;
    }

    // 檢查是否包含數字
    if (/\d/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個數字');
    }

    // 檢查是否包含小寫字母
    if (/[a-z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個小寫字母');
    }

    // 檢查是否包含大寫字母
    if (/[A-Z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個大寫字母');
    }

    // 檢查是否包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('密碼應包含至少一個特殊字符');
    }

    // 評估強度
    let strengthLevel = 'weak';
    if (strength >= 4) {
      strengthLevel = 'strong';
    } else if (strength >= 3) {
      strengthLevel = 'medium';
    }

    // 如果密碼強度不夠，返回建議
    if (strengthLevel === 'weak') {
      return {
        success: false,
        message: '密碼強度不足',
        feedback: feedback
      };
    }
    
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || '註冊失敗');
    } else if (error.request) {
      throw new Error('無法連接到服務器，請檢查您的網絡連接');
    } else {
      throw new Error('註冊過程中發生錯誤');
    }
  }
}

/**
 * 用戶登出
 */
export function logout() {
  // 清除本地存儲中的認證信息
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  
  // 分發存儲事件，以便其他窗口/標籤頁能夠更新認證狀態
  window.dispatchEvent(new StorageEvent('storage', {
    key: TOKEN_KEY,
    newValue: null
  }));
}

/**
 * 獲取當前用戶
 * @returns {object|null} - 當前登入的用戶或null
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    // 如果解析用戶數據時出錯，清除可能損壞的數據
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

/**
 * 檢查用戶是否已認證
 * @returns {boolean} - 用戶是否已認證
 */
export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY);
}

/**
 * 檢查用戶是否為管理員
 * @returns {boolean} - 用戶是否為管理員
 */
export function isAdmin() {
  const user = getCurrentUser();
  return !!user && user.role === 'admin';
}

/**
 * 獲取JWT令牌
 * @returns {string|null} - JWT令牌或null
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 獲取身份驗證標頭
 * @returns {object} - 包含Authorization標頭的對象
 */
export function getAuthHeader() {
  const token = getToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * 暫時函數：開發模式下直接登入為管理員
 * 僅供開發測試使用
 */
export function devLoginAsAdmin() {
  if (import.meta.env.DEV) {
    const mockUserData = {
      id: 1,
      name: '管理員',
      phone: '0911111111',
      role: 'admin',
      email: 'admin@example.com'
    };
    
    const mockToken = 'dev-admin-token-' + Date.now();
    
    // 存儲token和用戶信息
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUserData));
    
    // 通知其他頁面
    window.dispatchEvent(new StorageEvent('storage', {
      key: TOKEN_KEY,
      newValue: mockToken
    }));
    
    return {
      user: mockUserData,
      token: mockToken,
      success: true
    };
  }
  
  return null;
}

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  isAdmin,
  getToken,
  getAuthHeader,
  checkPasswordStrength,
  devLoginAsAdmin
}; 