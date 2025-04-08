/**
 * SEO 服務 - 處理所有SEO相關的API請求
 */
import apiClient from './apiClient.js';

/**
 * 獲取所有頁面的元數據
 */
export async function getAllMetadata() {
  try {
    const response = await apiClient.get('/admin/seo/metadata');
    return response.data;
  } catch (error) {
    console.error('獲取元數據失敗:', error);
    throw error;
  }
}

/**
 * 更新指定頁面的元數據
 * @param {string} path - 頁面路徑
 * @param {object} metadata - 頁面元數據
 */
export async function updateMetadata(path, metadata) {
  try {
    const encodedPath = encodeURIComponent(path.replace(/^\//, ''));
    const response = await apiClient.put(`/admin/seo/metadata/${encodedPath || 'home'}`, metadata);
    return response.data;
  } catch (error) {
    console.error('更新元數據失敗:', error);
    throw error;
  }
}

/**
 * 獲取結構化數據
 */
export async function getSchemas() {
  try {
    const response = await apiClient.get('/admin/seo/schemas');
    return response.data;
  } catch (error) {
    console.error('獲取結構化數據失敗:', error);
    throw error;
  }
}

/**
 * 保存結構化數據
 * @param {string} type - 結構化數據類型
 * @param {object} data - 結構化數據內容
 */
export async function saveSchema(type, data) {
  try {
    const response = await apiClient.post('/admin/seo/schemas', { type, data });
    return response.data;
  } catch (error) {
    console.error('保存結構化數據失敗:', error);
    throw error;
  }
}

/**
 * 獲取網站地圖數據
 */
export async function getSitemap() {
  try {
    const response = await apiClient.get('/admin/seo/sitemap');
    return response.data;
  } catch (error) {
    console.error('獲取網站地圖失敗:', error);
    throw error;
  }
}

/**
 * 生成網站地圖
 */
export async function generateSitemap() {
  try {
    const response = await apiClient.post('/admin/seo/generate-sitemap');
    return response.data;
  } catch (error) {
    console.error('生成網站地圖失敗:', error);
    throw error;
  }
}

/**
 * 提交網站地圖到指定搜索引擎
 * @param {Array} engines - 搜索引擎列表，例如 ['google', 'bing']
 */
export async function submitSitemap(engines = ['google', 'bing', 'yahoo']) {
  try {
    const response = await apiClient.post('/admin/seo/submit-sitemap', { engines });
    return response.data;
  } catch (error) {
    console.error('提交網站地圖失敗:', error);
    throw error;
  }
}

/**
 * 獲取SEO分析報告
 * 注意：這個API端點可能尚未實現，僅作為示例
 */
export async function getSeoAnalytics() {
  try {
    const response = await apiClient.get('/admin/seo/analytics');
    return response.data;
  } catch (error) {
    console.error('獲取SEO分析報告失敗:', error);
    throw error;
  }
}