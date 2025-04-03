/**
 * 預約相關API服務
 */
import { getAuthHeader } from './auth';

/**
 * 獲取用戶預約列表
 * @returns {Promise<Array>} 預約列表
 */
export async function getUserAppointments() {
  try {
    const response = await fetch('/api/appointments', {
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法獲取預約列表');
    }
    
    return await response.json();
  } catch (error) {
    console.error('獲取預約列表錯誤:', error);
    throw error;
  }
}

/**
 * 創建新預約
 * @param {Object} appointmentData - 預約數據
 * @param {number} appointmentData.provider_id - 服務商ID
 * @param {number} appointmentData.service_id - 服務ID
 * @param {string} appointmentData.date - 預約日期 (YYYY-MM-DD)
 * @param {string} appointmentData.time_slot - 預約時間段
 * @param {string} [appointmentData.notes] - 預約備註
 * @returns {Promise<Object>} 創建的預約
 */
export async function createAppointment(appointmentData) {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(appointmentData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法創建預約');
    }
    
    return await response.json();
  } catch (error) {
    console.error('創建預約錯誤:', error);
    throw error;
  }
}

/**
 * 更新預約狀態
 * @param {number|string} appointmentId - 預約ID
 * @param {string} status - 新狀態 ('cancelled', 'confirmed', 'completed')
 * @returns {Promise<Object>} 更新後的預約
 */
export async function updateAppointmentStatus(appointmentId, status) {
  try {
    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法更新預約狀態');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`更新預約 ID:${appointmentId} 狀態錯誤:`, error);
    throw error;
  }
}

/**
 * 取消預約
 * @param {number|string} appointmentId - 預約ID
 * @returns {Promise<Object>} 取消結果
 */
export async function cancelAppointment(appointmentId) {
  try {
    const response = await fetch(`/api/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '無法取消預約');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`取消預約 ID:${appointmentId} 錯誤:`, error);
    throw error;
  }
} 