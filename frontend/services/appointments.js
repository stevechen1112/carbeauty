/**
 * 預約服務 - 處理預約相關的API請求
 */
import apiClient from './apiClient';

/**
 * 獲取當前用戶的預約列表
 * @returns {Promise} 包含預約列表的Promise
 */
export async function getUserAppointments() {
  try {
    return await apiClient.get('/appointments/user');
  } catch (error) {
    console.error('獲取用戶預約失敗:', error);
    throw error;
  }
}

/**
 * 獲取商家的預約列表
 * @returns {Promise} 包含預約列表的Promise
 */
export async function getProviderAppointments() {
  try {
    return await apiClient.get('/appointments/provider');
  } catch (error) {
    console.error('獲取商家預約失敗:', error);
    throw error;
  }
}

/**
 * 獲取特定預約詳情
 * @param {number} appointmentId - 預約ID
 * @returns {Promise} 包含預約詳情的Promise
 */
export async function getAppointmentDetails(appointmentId) {
  try {
    return await apiClient.get(`/appointments/${appointmentId}`);
  } catch (error) {
    console.error('獲取預約詳情失敗:', error);
    throw error;
  }
}

/**
 * 創建新預約
 * @param {object} appointmentData - 預約數據
 * @returns {Promise} 包含創建結果的Promise
 */
export async function createAppointment(appointmentData) {
  try {
    return await apiClient.post('/appointments', appointmentData);
  } catch (error) {
    console.error('創建預約失敗:', error);
    throw error;
  }
}

/**
 * 更新預約狀態
 * @param {number} appointmentId - 預約ID
 * @param {string} status - 新狀態
 * @returns {Promise} 包含更新結果的Promise
 */
export async function updateAppointmentStatus(appointmentId, status) {
  try {
    return await apiClient.put(`/appointments/${appointmentId}/status`, { status });
  } catch (error) {
    console.error('更新預約狀態失敗:', error);
    throw error;
  }
}

/**
 * 更新預約數據
 * @param {number} appointmentId - 預約ID
 * @param {object} appointmentData - 更新的預約數據
 * @returns {Promise} 包含更新結果的Promise
 */
export async function updateAppointment(appointmentId, appointmentData) {
  try {
    return await apiClient.put(`/appointments/${appointmentId}`, appointmentData);
  } catch (error) {
    console.error('更新預約失敗:', error);
    throw error;
  }
}

/**
 * 取消預約
 * @param {number} appointmentId - 預約ID
 * @returns {Promise} 包含取消結果的Promise
 */
export async function cancelAppointment(appointmentId) {
  try {
    return await apiClient.delete(`/appointments/${appointmentId}`);
  } catch (error) {
    console.error('取消預約失敗:', error);
    throw error;
  }
}

/**
 * 獲取可用的預約時間段
 * @param {number} providerId - 服務提供商ID
 * @param {string} date - 日期字符串 (YYYY-MM-DD)
 * @returns {Promise} 包含可用時間段的Promise
 */
export async function getAvailableTimeSlots(providerId, date) {
  try {
    return await apiClient.get(`/appointments/available-slots`, {
      params: { providerId, date }
    });
  } catch (error) {
    console.error('獲取可用時間段失敗:', error);
    throw error;
  }
} 