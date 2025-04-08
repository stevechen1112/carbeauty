/**
 * 服務商服務 - 處理與服務提供商相關的API請求
 */
import apiClient from './apiClient';

/**
 * 獲取所有服務商列表
 * @param {object} params - 搜索參數
 * @returns {Promise} 服務商列表
 */
export async function getAllProviders(params = {}) {
  try {
    return await apiClient.get('/providers', { params });
  } catch (error) {
    console.error('獲取服務商列表失敗:', error);
    throw error;
  }
}

/**
 * 根據ID獲取服務商詳情
 * @param {number} providerId - 服務商ID
 * @returns {Promise} 服務商詳情
 */
export async function getProviderById(providerId) {
  try {
    return await apiClient.get(`/providers/${providerId}`);
  } catch (error) {
    console.error(`獲取服務商ID:${providerId}失敗:`, error);
    throw error;
  }
}

/**
 * 獲取服務商的服務列表
 * @param {number} providerId - 服務商ID
 * @returns {Promise} 服務列表
 */
export async function getProviderServices(providerId) {
  try {
    return await apiClient.get(`/providers/${providerId}/services`);
  } catch (error) {
    console.error(`獲取服務商ID:${providerId}的服務列表失敗:`, error);
    throw error;
  }
}

/**
 * 獲取服務商的評價列表
 * @param {number} providerId - 服務商ID
 * @returns {Promise} 評價列表
 */
export async function getProviderReviews(providerId) {
  try {
    return await apiClient.get(`/providers/${providerId}/reviews`);
  } catch (error) {
    console.error(`獲取服務商ID:${providerId}的評價失敗:`, error);
    throw error;
  }
}

/**
 * 獲取附近的服務商
 * @param {number} latitude - 緯度
 * @param {number} longitude - 經度
 * @param {number} radius - 搜索半徑（公里）
 * @returns {Promise} 附近服務商列表
 */
export async function getNearbyProviders(latitude, longitude, radius = 5) {
  try {
    return await apiClient.get(`/providers/nearby`, { 
      params: { latitude, longitude, radius } 
    });
  } catch (error) {
    console.error('獲取附近服務商失敗:', error);
    throw error;
  }
}

/**
 * 提交對服務商的評價
 * @param {number} providerId - 服務商ID
 * @param {object} reviewData - 評價數據
 * @returns {Promise} 評價結果
 */
export async function submitProviderReview(providerId, reviewData) {
  try {
    return await apiClient.post(`/providers/${providerId}/reviews`, reviewData);
  } catch (error) {
    console.error(`提交對服務商ID:${providerId}的評價失敗:`, error);
    throw error;
  }
}

/**
 * 更新服務商資料（僅適用於商家登入）
 * @param {number} providerId - 服務商ID
 * @param {object} providerData - 更新數據
 * @returns {Promise} 更新結果
 */
export async function updateProviderProfile(providerId, providerData) {
  try {
    return await apiClient.put(`/providers/${providerId}`, providerData);
  } catch (error) {
    console.error(`更新服務商ID:${providerId}資料失敗:`, error);
    throw error;
  }
}

/**
 * 添加服務（僅適用於商家登入）
 * @param {number} providerId - 服務商ID
 * @param {object} serviceData - 服務數據
 * @returns {Promise} 結果
 */
export async function addProviderService(providerId, serviceData) {
  try {
    return await apiClient.post(`/providers/${providerId}/services`, serviceData);
  } catch (error) {
    console.error(`服務商ID:${providerId}添加服務失敗:`, error);
    throw error;
  }
}

/**
 * 更新服務（僅適用於商家登入）
 * @param {number} providerId - 服務商ID
 * @param {number} serviceId - 服務ID
 * @param {object} serviceData - 服務數據
 * @returns {Promise} 結果
 */
export async function updateProviderService(providerId, serviceId, serviceData) {
  try {
    return await apiClient.put(`/providers/${providerId}/services/${serviceId}`, serviceData);
  } catch (error) {
    console.error(`服務商ID:${providerId}更新服務ID:${serviceId}失敗:`, error);
    throw error;
  }
}

/**
 * 刪除服務（僅適用於商家登入）
 * @param {number} providerId - 服務商ID
 * @param {number} serviceId - 服務ID
 * @returns {Promise} 結果
 */
export async function deleteProviderService(providerId, serviceId) {
  try {
    return await apiClient.delete(`/providers/${providerId}/services/${serviceId}`);
  } catch (error) {
    console.error(`服務商ID:${providerId}刪除服務ID:${serviceId}失敗:`, error);
    throw error;
  }
} 