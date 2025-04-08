<template>
  <div class="admin-seo">
    <h1>SEO 管理</h1>
    
    <!-- 載入指示器 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div>正在載入...</div>
    </div>
    
    <!-- 錯誤消息 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <div class="seo-tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'meta' }" 
        @click="activeTab = 'meta'"
      >
        頁面元數據
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'schema' }" 
        @click="activeTab = 'schema'"
      >
        結構化數據
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'sitemap' }" 
        @click="activeTab = 'sitemap'"
      >
        網站地圖
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'analytics' }" 
        @click="activeTab = 'analytics'"
      >
        分析報告
      </div>
    </div>
    
    <div class="tab-content">
      <!-- 頁面元數據管理 -->
      <div v-if="activeTab === 'meta'" class="tab-panel">
        <div class="page-selector">
          <h3>選擇頁面</h3>
          <select v-model="selectedPage" class="page-select">
            <option value="">-- 請選擇頁面 --</option>
            <option v-for="page in pages" :key="page.path" :value="page.path">
              {{ page.title }}
            </option>
          </select>
        </div>
        
        <div v-if="selectedPage" class="meta-editor">
          <h3>編輯元數據</h3>
          <div class="form-group">
            <label for="meta-title">頁面標題</label>
            <input 
              type="text" 
              id="meta-title" 
              v-model="pageMetadata.title" 
              class="form-input"
              maxlength="70"
            >
            <div class="char-count">{{ pageMetadata.title.length }}/70</div>
            <div class="preview-title">{{ pageMetadata.title }}</div>
          </div>
          
          <div class="form-group">
            <label for="meta-description">頁面描述</label>
            <textarea 
              id="meta-description" 
              v-model="pageMetadata.description" 
              class="form-textarea"
              maxlength="160"
              rows="3"
            ></textarea>
            <div class="char-count">{{ pageMetadata.description.length }}/160</div>
            <div class="preview-description">{{ pageMetadata.description }}</div>
          </div>
          
          <div class="form-group">
            <label for="meta-keywords">關鍵詞 (用逗號分隔)</label>
            <input 
              type="text" 
              id="meta-keywords" 
              v-model="pageMetadata.keywords" 
              class="form-input"
            >
          </div>
          
          <div class="form-group">
            <label for="meta-og-image">Open Graph 圖片 URL</label>
            <input 
              type="text" 
              id="meta-og-image" 
              v-model="pageMetadata.ogImage" 
              class="form-input"
            >
          </div>
          
          <div class="seo-preview">
            <h3>搜尋引擎預覽</h3>
            <div class="serp-preview">
              <div class="serp-title">{{ pageMetadata.title }}</div>
              <div class="serp-url">https://www.example.com{{ selectedPage }}</div>
              <div class="serp-description">{{ pageMetadata.description }}</div>
            </div>
          </div>
          
          <button class="save-btn" @click="saveMetadata">儲存變更</button>
        </div>
      </div>
      
      <!-- 結構化數據管理 -->
      <div v-if="activeTab === 'schema'" class="tab-panel">
        <div class="schema-selector">
          <h3>選擇結構化數據類型</h3>
          <select v-model="selectedSchemaType" class="schema-select">
            <option value="">-- 請選擇類型 --</option>
            <option value="LocalBusiness">本地商家</option>
            <option value="Service">服務</option>
            <option value="Review">評價</option>
            <option value="WebPage">網頁</option>
            <option value="BreadcrumbList">麵包屑導航</option>
          </select>
        </div>
        
        <div v-if="selectedSchemaType" class="schema-editor">
          <h3>編輯 {{ selectedSchemaType }} 結構化數據</h3>
          <div v-if="selectedSchemaType === 'LocalBusiness'" class="schema-form">
            <div class="form-group">
              <label>商家名稱</label>
              <input 
                type="text" 
                v-model="schemaData.name" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>商家類型</label>
              <input 
                type="text" 
                v-model="schemaData.type" 
                class="form-input"
                placeholder="例如: 汽車美容, 洗車服務"
              >
            </div>
            <div class="form-group">
              <label>商家地址</label>
              <input 
                type="text" 
                v-model="schemaData.address" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>電話號碼</label>
              <input 
                type="text" 
                v-model="schemaData.telephone" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>營業時間</label>
              <input 
                type="text" 
                v-model="schemaData.openingHours" 
                class="form-input"
                placeholder="例如: Mo-Fr 09:00-18:00"
              >
            </div>
          </div>
          
          <div class="schema-preview">
            <h3>JSON-LD 預覽</h3>
            <pre class="json-preview">{{ formatSchemaJson() }}</pre>
          </div>
          
          <button class="save-btn" @click="saveSchema">儲存結構化數據</button>
        </div>
      </div>
      
      <!-- 網站地圖管理 -->
      <div v-if="activeTab === 'sitemap'" class="tab-panel">
        <h3>網站地圖管理</h3>
        
        <div class="sitemap-controls">
          <button class="action-btn" @click="generateSitemap" :disabled="loading">生成網站地圖</button>
          <button class="action-btn" @click="submitSitemap" :disabled="loading">提交到搜尋引擎</button>
        </div>
        
        <div class="sitemap-list">
          <h3>網站地圖列表</h3>
          <table class="sitemap-table">
            <thead>
              <tr>
                <th>URL</th>
                <th>最後修改日期</th>
                <th>頻率</th>
                <th>優先級</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(page, index) in sitemapPages" :key="index">
                <td>{{ page.url }}</td>
                <td>{{ page.lastmod }}</td>
                <td>{{ page.changefreq }}</td>
                <td>{{ page.priority }}</td>
                <td>
                  <button class="small-btn edit-btn">編輯</button>
                </td>
              </tr>
              <tr v-if="sitemapPages.length === 0">
                <td colspan="5" class="no-data">暫無數據</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 分析報告 -->
      <div v-if="activeTab === 'analytics'" class="tab-panel">
        <h3>SEO 分析報告</h3>
        
        <div class="analytics-summary">
          <div class="analytics-card">
            <h4>關鍵詞排名</h4>
            <div class="analytics-value">15/20</div>
            <div class="analytics-change positive">+3</div>
          </div>
          <div class="analytics-card">
            <h4>有機流量</h4>
            <div class="analytics-value">1,245</div>
            <div class="analytics-change positive">+12%</div>
          </div>
          <div class="analytics-card">
            <h4>平均排名</h4>
            <div class="analytics-value">14.3</div>
            <div class="analytics-change negative">-2.1</div>
          </div>
          <div class="analytics-card">
            <h4>索引頁面</h4>
            <div class="analytics-value">87</div>
            <div class="analytics-change positive">+5</div>
          </div>
        </div>
        
        <div class="improvement-tips">
          <h3>SEO 改進建議</h3>
          <ul class="tips-list">
            <li class="tip-item">
              <div class="tip-label critical">緊急</div>
              <div class="tip-content">
                <h4>移動端適配問題</h4>
                <p>在小尺寸螢幕上，部分頁面出現內容溢出問題，建議修正以提高移動端友好性。</p>
              </div>
            </li>
            <li class="tip-item">
              <div class="tip-label warning">警告</div>
              <div class="tip-content">
                <h4>慢速載入</h4>
                <p>部分頁面載入時間超過3秒，可以通過壓縮圖片和最小化CSS/JS來改進。</p>
              </div>
            </li>
            <li class="tip-item">
              <div class="tip-label info">建議</div>
              <div class="tip-content">
                <h4>增加內部連結</h4>
                <p>增加相關服務頁面之間的內部連結，幫助搜尋引擎更好地理解網站結構。</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue';
import apiClient from '../../services/apiClient.js';
// 引入新的SEO服務
import { 
  getAllMetadata, 
  updateMetadata, 
  getSchemas, 
  saveSchema as saveSchemaApi, 
  getSitemap, 
  generateSitemap as generateSitemapApi, 
  submitSitemap as submitSitemapApi
} from '../../services/seo.js';

export default {
  name: 'AdminSEO',
  setup() {
    // 當前活動標籤
    const activeTab = ref('meta');
    
    // 頁面元數據管理
    const selectedPage = ref('');
    const pageMetadata = reactive({
      title: '',
      description: '',
      keywords: '',
      ogImage: ''
    });
    
    // 所有頁面列表
    const pages = [
      { path: '/', title: '首頁' },
      { path: '/providers', title: '商家列表' },
      { path: '/about', title: '關於我們' },
      { path: '/services', title: '服務介紹' },
      { path: '/community', title: '社區' },
      { path: '/contact', title: '聯絡我們' }
    ];
    
    // 載入所有頁面元數據
    const metadataCache = ref({});
    const loading = ref(false);
    const error = ref(null);
    
    const fetchAllMetadata = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 使用新的SEO服務
        metadataCache.value = await getAllMetadata();
        
        loading.value = false;
      } catch (err) {
        console.error('獲取元數據錯誤:', err);
        error.value = err.response?.data?.message || '獲取元數據失敗';
        loading.value = false;
      }
    };
    
    // 獲取特定頁面的元數據
    const fetchPageMetadata = async (path) => {
      if (!path) return;
      
      try {
        loading.value = true;
        error.value = null;
        
        if (metadataCache.value[path]) {
          // 從緩存中獲取數據
          const data = metadataCache.value[path];
          pageMetadata.title = data.title || '';
          pageMetadata.description = data.description || '';
          pageMetadata.keywords = data.keywords || '';
          pageMetadata.ogImage = data.ogImage || '';
        } else {
          // 如果緩存中沒有，則重新獲取所有數據
          await fetchAllMetadata();
          if (metadataCache.value[path]) {
            const data = metadataCache.value[path];
            pageMetadata.title = data.title || '';
            pageMetadata.description = data.description || '';
            pageMetadata.keywords = data.keywords || '';
            pageMetadata.ogImage = data.ogImage || '';
          }
        }
        
        loading.value = false;
      } catch (err) {
        console.error('獲取頁面元數據錯誤:', err);
        error.value = err.response?.data?.message || '獲取頁面元數據失敗';
        loading.value = false;
      }
    };
    
    // 監聽選中頁面變化
    watch(selectedPage, (newPath) => {
      if (newPath) {
        fetchPageMetadata(newPath);
      } else {
        pageMetadata.title = '';
        pageMetadata.description = '';
        pageMetadata.keywords = '';
        pageMetadata.ogImage = '';
      }
    });
    
    // 保存元數據
    const saveMetadata = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 使用新的SEO服務
        const response = await updateMetadata(selectedPage.value, {
          title: pageMetadata.title,
          description: pageMetadata.description,
          keywords: pageMetadata.keywords,
          ogImage: pageMetadata.ogImage
        });
        
        // 更新緩存
        if (response.success) {
          metadataCache.value[selectedPage.value] = { ...pageMetadata };
          alert('元數據已成功儲存！');
        }
        
        loading.value = false;
      } catch (err) {
        console.error('保存元數據錯誤:', err);
        error.value = err.response?.data?.message || '保存元數據失敗';
        loading.value = false;
        alert('保存失敗: ' + error.value);
      }
    };
    
    // 結構化數據管理
    const selectedSchemaType = ref('');
    const schemaData = reactive({
      name: '',
      type: '',
      address: '',
      telephone: '',
      openingHours: ''
    });
    
    const schemas = ref([]);
    
    // 獲取結構化數據
    const fetchSchemas = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 使用新的SEO服務
        schemas.value = await getSchemas();
        
        loading.value = false;
      } catch (err) {
        console.error('獲取結構化數據錯誤:', err);
        error.value = err.response?.data?.message || '獲取結構化數據失敗';
        loading.value = false;
      }
    };
    
    // 格式化結構化數據JSON
    const formatSchemaJson = () => {
      if (selectedSchemaType.value === 'LocalBusiness') {
        const schema = {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          'name': schemaData.name,
          'description': '專業汽車美容服務',
          'address': {
            '@type': 'PostalAddress',
            'streetAddress': schemaData.address
          },
          'telephone': schemaData.telephone,
          'openingHours': schemaData.openingHours
        };
        return JSON.stringify(schema, null, 2);
      }
      return '{}';
    };
    
    // 保存結構化數據
    const saveSchema = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 使用新的SEO服務
        const response = await saveSchemaApi(selectedSchemaType.value, schemaData);
        
        if (response.success) {
          // 刷新結構化數據列表
          await fetchSchemas();
          alert('結構化數據已成功儲存！');
        }
        
        loading.value = false;
      } catch (err) {
        console.error('保存結構化數據錯誤:', err);
        error.value = err.response?.data?.message || '保存結構化數據失敗';
        loading.value = false;
        alert('保存失敗: ' + error.value);
      }
    };
    
    // 網站地圖管理
    const sitemapPages = ref([]);
    
    // 獲取網站地圖數據
    const fetchSitemap = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 使用新的SEO服務
        sitemapPages.value = await getSitemap();
        
        loading.value = false;
      } catch (err) {
        console.error('獲取網站地圖錯誤:', err);
        error.value = err.response?.data?.message || '獲取網站地圖失敗';
        loading.value = false;
      }
    };
    
    // 生成網站地圖
    const generateSitemap = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 使用新的SEO服務
        const response = await generateSitemapApi();
        
        if (response.success) {
          alert('網站地圖已成功生成！');
          await fetchSitemap();
        }
        
        loading.value = false;
      } catch (err) {
        console.error('生成網站地圖錯誤:', err);
        error.value = err.response?.data?.message || '生成網站地圖失敗';
        loading.value = false;
        alert('生成失敗: ' + error.value);
      }
    };
    
    // 提交網站地圖到搜尋引擎
    const submitSitemap = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 使用新的SEO服務
        const response = await submitSitemapApi(['google', 'bing', 'yahoo']);
        
        if (response.success) {
          alert(`網站地圖已成功提交到搜尋引擎: ${response.engines.join(', ')}`);
        }
        
        loading.value = false;
      } catch (err) {
        console.error('提交網站地圖錯誤:', err);
        error.value = err.response?.data?.message || '提交網站地圖失敗';
        loading.value = false;
        alert('提交失敗: ' + error.value);
      }
    };
    
    // 初始化加載數據
    onMounted(async () => {
      await fetchAllMetadata();
      await fetchSchemas();
      await fetchSitemap();
    });
    
    // 確保所有必要的屬性都被返回
    return {
      activeTab,
      selectedPage,
      pageMetadata,
      pages,
      selectedSchemaType,
      schemaData,
      schemas,
      formatSchemaJson,
      saveMetadata,
      saveSchema,
      sitemapPages,
      generateSitemap,
      submitSitemap,
      loading,
      error,
      metadataCache,
      fetchAllMetadata,
      fetchSchemas,
      fetchSitemap
    };
  },
  watch: {
    selectedPage: {
      handler(newVal) {
        if (newVal) {
          this.fetchPageMetadata();
        }
      },
      immediate: true
    }
  },
  methods: {
    fetchPageMetadata
  },
  metaInfo: {
    title: 'SEO 管理 - 汽車美容預約平台'
  }
}
</script>

<style scoped>
.admin-seo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.seo-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 2rem;
}

.tab {
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab:hover {
  background-color: #f5f5f5;
}

.tab.active {
  border-bottom-color: #1976d2;
  color: #1976d2;
  font-weight: 500;
}

.tab-panel {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-selector,
.schema-selector {
  margin-bottom: 2rem;
}

.page-select,
.schema-select {
  width: 100%;
  max-width: 500px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-textarea {
  resize: vertical;
}

.char-count {
  text-align: right;
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.preview-title {
  margin-top: 0.5rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: #1a0dab;
}

.preview-description {
  margin-top: 0.5rem;
  color: #545454;
  line-height: 1.5;
}

.seo-preview,
.schema-preview {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.serp-preview {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.serp-title {
  color: #1a0dab;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.serp-url {
  color: #006621;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.serp-description {
  color: #545454;
  line-height: 1.5;
}

.json-preview {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  font-family: monospace;
}

.save-btn {
  padding: 0.8rem 1.5rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #1565c0;
}

.sitemap-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: #e0e0e0;
}

.sitemap-table {
  width: 100%;
  border-collapse: collapse;
}

.sitemap-table th,
.sitemap-table td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.sitemap-table th {
  background-color: #f5f5f5;
  font-weight: 500;
}

.small-btn {
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.edit-btn {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.analytics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.analytics-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.analytics-card h4 {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 1rem;
}

.analytics-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.analytics-change {
  font-size: 0.9rem;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #f44336;
}

.tips-list {
  list-style: none;
  padding: 0;
}

.tip-item {
  display: flex;
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tip-label {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  padding: 1rem 0.5rem;
  font-weight: bold;
  text-align: center;
  min-width: 30px;
}

.tip-label.critical {
  background-color: #ffebee;
  color: #c62828;
}

.tip-label.warning {
  background-color: #fff8e1;
  color: #f57f17;
}

.tip-label.info {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.tip-content {
  padding: 1.5rem;
  flex: 1;
}

.tip-content h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.tip-content p {
  margin: 0;
  color: #666;
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #ffd7d7;
  color: #c62828;
  padding: 1rem;
  z-index: 1000;
}

@media (max-width: 768px) {
  .seo-tabs {
    flex-wrap: wrap;
  }
  
  .tab {
    padding: 0.8rem 1rem;
  }
  
  .tab-panel {
    padding: 1.5rem 1rem;
  }
  
  .analytics-summary {
    grid-template-columns: 1fr;
  }
}
</style> 