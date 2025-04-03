<template>
  <div class="about-container">
    <div class="about-header">
      <h1>關於汽車美容預約平台</h1>
      <p class="subtitle">連接優質汽車美容服務商與車主的最佳平台</p>
    </div>

    <div class="about-section">
      <h2>我們的使命</h2>
      <p>汽車美容預約平台致力於為車主提供便捷、高效的汽車美容服務預約體驗，同時幫助優質的汽車美容服務商拓展業務。我們的目標是通過科技創新，重新定義汽車美容服務的預約流程，讓車主輕鬆找到合適的服務，讓服務商高效管理預約。</p>
    </div>

    <div class="about-section">
      <h2>平台優勢</h2>
      <div class="advantages">
        <div class="advantage-item">
          <div class="advantage-icon">🔍</div>
          <h3>便捷搜尋</h3>
          <p>根據地區、服務類型快速找到附近的汽車美容服務商，節省時間和精力。</p>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">📅</div>
          <h3>線上預約</h3>
          <p>隨時隨地通過手機完成預約，避免電話排隊等待，提高效率。</p>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">⭐</div>
          <h3>真實評價</h3>
          <p>查看其他車主的真實評價和體驗，幫助您做出更明智的選擇。</p>
        </div>
        <div class="advantage-item">
          <div class="advantage-icon">🛡️</div>
          <h3>品質保障</h3>
          <p>平台對入駐服務商進行嚴格審核，確保服務品質和專業水準。</p>
        </div>
      </div>
    </div>

    <div class="about-section">
      <h2>我們的服務</h2>
      <p>汽車美容預約平台提供多種汽車護理服務預約，包括但不限於：</p>
      <ul class="services-list">
        <li>外觀清洗 - 專業洗車、打蠟、拋光服務</li>
        <li>內飾清潔 - 座椅、地毯、儀表板清潔與護理</li>
        <li>特殊護理 - 封體鍍膜、漆面修復、玻璃鍍膜等</li>
        <li>定期保養 - 客製化的汽車美容保養計劃</li>
      </ul>
      <p>我們不斷擴展服務網絡，為您提供全方位的汽車美容解決方案。</p>
    </div>

    <div class="about-section">
      <h2>聯絡我們</h2>
      <p>如果您有任何問題、建議或合作意向，歡迎聯絡我們：</p>
      <div class="contact-info">
        <p><strong>電子郵件：</strong> contact@carbeauty.example.com</p>
        <p><strong>客服電話：</strong> (02) 2345-6789</p>
        <p><strong>服務時間：</strong> 週一至週五 09:00-18:00</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  metaInfo: {
    title: '關於我們 - 汽車美容預約平台'
  }
}
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-header {
  text-align: center;
  margin-bottom: 3rem;
}

.about-header h1 {
  color: #1976d2;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.2rem;
}

.about-section {
  margin-bottom: 3rem;
}

.about-section h2 {
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #1976d2;
  padding-bottom: 0.5rem;
}

.advantages {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.advantage-item {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.advantage-item:hover {
  transform: translateY(-5px);
}

.advantage-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.advantage-item h3 {
  color: #1976d2;
  margin-bottom: 1rem;
  text-align: center;
}

.services-list {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.services-list li {
  margin-bottom: 0.75rem;
}

.contact-info {
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.contact-info p {
  margin-bottom: 0.75rem;
}

@media (max-width: 768px) {
  .advantages {
    grid-template-columns: 1fr;
  }
}
</style> 