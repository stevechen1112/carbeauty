/**
 * 服務商相關API服務
 */
import { getAuthHeader } from './auth';

/**
 * 獲取服務商列表
 * @param {Object} params - 搜尋參數
 * @returns {Promise<Array>} 服務商列表
 */
export async function getProviders(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    // 添加搜尋參數
    if (params.search) queryParams.append('search', params.search);
    
    const url = `/api/providers${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法獲取服務商列表');
    }
    
    return await response.json();
  } catch (error) {
    console.error('獲取服務商列表錯誤:', error);
    throw error;
  }
}

/**
 * 獲取服務商詳情
 * @param {number|string} id - 服務商ID
 * @returns {Promise<Object>} 服務商詳情
 */
export async function getProviderById(id) {
  try {
    const response = await fetch(`/api/providers/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法獲取服務商詳情');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`獲取服務商 ID:${id} 詳情錯誤:`, error);
    throw error;
  }
}

/**
 * 獲取服務商的服務列表
 * @param {number|string} providerId - 服務商ID
 * @returns {Promise<Array>} 服務列表
 */
export async function getProviderServices(providerId) {
  try {
    const response = await fetch(`/api/providers/${providerId}/services`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法獲取服務列表');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`獲取服務商 ID:${providerId} 服務列表錯誤:`, error);
    throw error;
  }
}

/**
 * 提交服務評價
 * @param {number|string} providerId - 服務商ID
 * @param {Object} reviewData - 評價數據
 * @param {number} reviewData.rating - 評分 (1-5)
 * @param {string} reviewData.comment - 評價內容
 * @returns {Promise<Object>} 評價結果
 */
export async function submitReview(providerId, reviewData) {
  try {
    const response = await fetch(`/api/providers/${providerId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(reviewData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法提交評價');
    }
    
    return await response.json();
  } catch (error) {
    console.error('提交評價錯誤:', error);
    throw error;
  }
}

/**
 * 獲取用戶收藏的服務商
 * @returns {Promise<Array>} 收藏的服務商列表
 */
export async function getFavoriteProviders() {
  try {
    const response = await fetch('/api/users/favorites', {
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法獲取收藏商家');
    }
    
    return await response.json();
  } catch (error) {
    console.error('獲取收藏商家錯誤:', error);
    throw error;
  }
}

/**
 * 移除收藏的服務商
 * @param {number|string} providerId - 服務商ID
 * @returns {Promise<Object>} 操作結果
 */
export async function removeFavoriteProvider(providerId) {
  try {
    const response = await fetch(`/api/users/favorites/${providerId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法取消收藏');
    }
    
    return await response.json();
  } catch (error) {
    console.error('取消收藏錯誤:', error);
    throw error;
  }
} 