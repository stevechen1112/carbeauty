/**
 * 管理員服務 - 處理與管理員後台相關的API請求
 */
import apiClient from './apiClient';

/**
 * 獲取儀表板數據
 * @returns {Promise} 儀表板數據
 */
export async function getDashboardData() {
  try {
    // 開發環境使用模擬數據
    if (import.meta.env.DEV) {
      console.log('開發環境: 使用模擬儀表板數據');
      
      // 模擬延遲
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 返回模擬數據
      return {
        userCount: 245,
        providerCount: 28,
        appointmentCount: 1258,
        totalRevenue: 396750,
        recentAppointmentsCount: 37,
        // 其他儀表板數據...
      };
    }
    
    // 生產環境調用真實API
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('獲取儀表板數據錯誤:', error);
    throw new Error('無法載入儀表板數據');
  }
}

/**
 * 獲取用戶列表
 * @param {object} params 查詢參數
 * @returns {Promise} 用戶列表
 */
export async function getUsers(params) {
  try {
    // 開發環境使用模擬數據
    if (import.meta.env.DEV) {
      console.log('開發環境: 使用模擬用戶數據');
      
      // 模擬延遲
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 生成模擬用戶數據
      const mockUsers = Array.from({ length: 25 }, (_, index) => ({
        id: index + 1,
        name: `用戶${index + 1}`,
        phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `user${index + 1}@example.com`,
        role: index < 2 ? 'admin' : 'user',
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        lastLoginAt: index < 20 ? new Date(Date.now() - Math.random() * 1000000000).toISOString() : null
      }));
      
      return {
        users: mockUsers,
        total: 25,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
    }
    
    // 生產環境調用真實API
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    console.error('獲取用戶列表錯誤:', error);
    throw new Error('無法載入用戶列表');
  }
}

/**
 * 更新用戶信息
 * @param {number} userId 用戶ID
 * @param {object} userData 用戶數據
 * @returns {Promise} 更新結果
 */
export async function updateUser(userId, userData) {
  try {
    return await apiClient.put(`/admin/users/${userId}`, userData);
  } catch (error) {
    console.error('更新用戶信息失敗:', error);
    throw error;
  }
}

/**
 * 刪除用戶
 * @param {number} userId 用戶ID
 * @returns {Promise} 刪除結果
 */
export async function deleteUser(userId) {
  try {
    return await apiClient.delete(`/admin/users/${userId}`);
  } catch (error) {
    console.error('刪除用戶失敗:', error);
    throw error;
  }
}

/**
 * 獲取所有預約列表
 * @param {object} params 查詢參數
 * @returns {Promise} 預約列表
 */
export async function getAppointments(params) {
  try {
    // 開發環境使用模擬數據
    if (import.meta.env.DEV) {
      console.log('開發環境: 使用模擬預約數據');
      
      // 模擬延遲
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 預約狀態
      const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      
      // 生成模擬預約數據
      const mockAppointments = Array.from({ length: 25 }, (_, index) => ({
        id: index + 1,
        userId: Math.floor(Math.random() * 20) + 1,
        userName: `用戶${Math.floor(Math.random() * 20) + 1}`,
        providerName: `美容店${Math.floor(Math.random() * 10) + 1}`,
        serviceId: Math.floor(Math.random() * 30) + 1,
        serviceName: `服務${Math.floor(Math.random() * 5) + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        price: Math.floor(Math.random() * 5000) + 500,
        date: new Date(Date.now() + (Math.random() * 30 - 15) * 86400000).toISOString().split('T')[0],
        timeSlot: `${Math.floor(Math.random() * 8) + 9}:00 - ${Math.floor(Math.random() * 8) + 10}:00`,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      }));
      
      return {
        appointments: mockAppointments,
        total: 158,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
    }
    
    // 生產環境調用真實API
    const response = await apiClient.get('/admin/appointments', { params });
    return response.data;
  } catch (error) {
    console.error('獲取預約列表錯誤:', error);
    throw new Error('無法載入預約列表');
  }
}

/**
 * 更新預約狀態
 * @param {number} appointmentId 預約ID
 * @param {string} status 預約狀態
 * @returns {Promise} 更新結果
 */
export async function updateAppointmentStatus(appointmentId, status) {
  try {
    return await apiClient.put(`/admin/appointments/${appointmentId}/status`, { status });
  } catch (error) {
    console.error('更新預約狀態失敗:', error);
    throw error;
  }
}

/**
 * 獲取商家列表
 * @param {object} params 查詢參數
 * @returns {Promise} 商家列表
 */
export async function getProviders(params) {
  try {
    // 開發環境使用模擬數據
    if (import.meta.env.DEV) {
      console.log('開發環境: 使用模擬商家數據');
      
      // 模擬延遲
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 生成模擬商家數據
      const mockProviders = Array.from({ length: 15 }, (_, index) => ({
        id: index + 1,
        name: `美容店${index + 1}`,
        phone: `02-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        email: `shop${index + 1}@example.com`,
        address: `台北市${['大安區', '信義區', '松山區', '中山區', '內湖區'][Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 100) + 1}號`,
        rating: (3 + Math.random() * 2).toFixed(1),
        reviewCount: Math.floor(Math.random() * 200) + 10,
        verified: Math.random() > 0.2,
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      }));
      
      return {
        providers: mockProviders,
        total: 28,
        page: params?.page || 1,
        limit: params?.limit || 10
      };
    }
    
    // 生產環境調用真實API
    const response = await apiClient.get('/admin/providers', { params });
    return response.data;
  } catch (error) {
    console.error('獲取商家列表錯誤:', error);
    throw new Error('無法載入商家列表');
  }
}

/**
 * 更新商家狀態
 * @param {number} providerId 商家ID
 * @param {string} status 商家狀態
 * @returns {Promise} 更新結果
 */
export async function updateProviderStatus(providerId, status) {
  try {
    return await apiClient.put(`/admin/providers/${providerId}/status`, { status });
  } catch (error) {
    console.error('更新商家狀態失敗:', error);
    throw error;
  }
}

/**
 * 更新SEO設置
 * @param {object} settings SEO設置
 * @returns {Promise} 更新結果
 */
export async function updateSEOSettings(settings) {
  try {
    // 開發環境
    if (import.meta.env.DEV) {
      console.log('開發環境: 模擬更新SEO設置', settings);
      
      // 模擬延遲
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: 'SEO設置已更新' };
    }
    
    // 生產環境調用真實API
    const response = await apiClient.put('/admin/seo', settings);
    return response.data;
  } catch (error) {
    console.error('更新SEO設置錯誤:', error);
    throw new Error('無法更新SEO設置');
  }
} 