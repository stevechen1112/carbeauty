/**
 * 管理員服務 - 處理管理員後台功能
 */
import { getAuthHeader } from './auth';

/**
 * 獲取所有用戶列表
 * @returns {Promise<Array>} 用戶列表
 */
export async function getAllUsers() {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '獲取用戶列表失敗');
    }
    
    return data;
  } catch (error) {
    console.error('獲取用戶列表錯誤:', error);
    throw error;
  }
}

/**
 * 獲取所有預約列表
 * @returns {Promise<Array>} 預約列表
 */
export async function getAllAppointments() {
  try {
    const response = await fetch('/api/admin/appointments', {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '獲取預約列表失敗');
    }
    
    return data;
  } catch (error) {
    console.error('獲取預約列表錯誤:', error);
    throw error;
  }
}

/**
 * 獲取管理員儀表板數據
 * @returns {Promise<Object>} 儀表板數據
 */
export async function getDashboardData() {
  try {
    const response = await fetch('/api/admin/dashboard', {
      method: 'GET',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '獲取儀表板數據失敗');
    }
    
    return data;
  } catch (error) {
    console.error('獲取儀表板數據錯誤:', error);
    throw error;
  }
}

/**
 * 更新用戶信息
 * @param {number} userId - 用戶ID
 * @param {Object} userData - 用戶更新數據
 * @returns {Promise<Object>} 更新後的用戶數據
 */
export async function updateUser(userId, userData) {
  try {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '更新用戶失敗');
    }
    
    return data;
  } catch (error) {
    console.error('更新用戶錯誤:', error);
    throw error;
  }
} 