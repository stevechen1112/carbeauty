<template>
  <div class="community-page">
    <h1>愛車社區</h1>
    
    <div class="community-tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'posts' }"
        @click="activeTab = 'posts'"
      >
        曬車區
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'knowledge' }"
        @click="activeTab = 'knowledge'"
      >
        保養知識庫
      </div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'qa' }"
        @click="activeTab = 'qa'"
      >
        問答社區
      </div>
    </div>
    
    <div class="community-content">
      <!-- 曬車區 -->
      <div v-if="activeTab === 'posts'" class="posts-section">
        <div class="section-header">
          <h2>曬車區</h2>
          <button class="create-btn" @click="showCreatePostModal = true">分享我的愛車</button>
        </div>
        
        <div class="post-list">
          <div v-for="post in posts" :key="post.id" class="post-card">
            <div class="post-user">
              <img :src="post.user.avatar" :alt="post.user.name" class="user-avatar">
              <span class="user-name">{{ post.user.name }}</span>
              <span class="post-time">{{ formatTime(post.createdAt) }}</span>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-content">{{ post.content }}</p>
            <div class="post-images">
              <img 
                v-for="(image, index) in post.images" 
                :key="index" 
                :src="image" 
                alt="用戶分享圖片"
                @click="viewImage(image)"
              >
            </div>
            <div class="post-actions">
              <button class="like-btn" @click="toggleLike(post.id)">
                <span>👍</span> {{ post.likes }}
              </button>
              <button class="comment-btn" @click="viewPost(post.id)">
                <span>💬</span> {{ post.comments }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 其他標籤內容將在後續開發中添加 -->
      <div v-else>
        <p class="coming-soon">更多內容即將推出，敬請期待！</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Community',
  data() {
    return {
      activeTab: 'posts',
      showCreatePostModal: false,
      posts: [
        {
          id: 1,
          title: '新車到手，分享我的保養心得',
          content: '前兩週剛入手新車，已經去做了基礎美容和鍍膜，效果非常好！推薦大家嘗試...',
          images: [
            'https://via.placeholder.com/300x200?text=新車照片1',
            'https://via.placeholder.com/300x200?text=美容後效果1'
          ],
          likes: 24,
          comments: 8,
          createdAt: new Date('2023-03-15T10:30:00'),
          user: {
            name: '車主小王',
            avatar: 'https://via.placeholder.com/50?text=小王'
          }
        },
        {
          id: 2,
          title: '分享我的愛車日常打理方法',
          content: '每週固定會自己動手清潔愛車，分享一些小技巧給大家...',
          images: [
            'https://via.placeholder.com/300x200?text=清潔過程1',
            'https://via.placeholder.com/300x200?text=清潔過程2',
            'https://via.placeholder.com/300x200?text=清潔效果'
          ],
          likes: 36,
          comments: 15,
          createdAt: new Date('2023-03-10T14:20:00'),
          user: {
            name: '愛車達人',
            avatar: 'https://via.placeholder.com/50?text=達人'
          }
        }
      ]
    };
  },
  methods: {
    formatTime(date) {
      // 簡單的時間格式化
      return new Date(date).toLocaleDateString('zh-TW');
    },
    toggleLike(postId) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.likes += 1;
      }
    },
    viewPost(postId) {
      // 查看帖子詳情
      alert(`查看帖子 ID: ${postId} 的詳情頁面`);
    },
    viewImage(image) {
      // 查看大圖
      window.open(image, '_blank');
    }
  }
};
</script>

<style scoped>
.community-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}

.community-page h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #1976d2;
}

.community-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1.1rem;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab:hover {
  color: #1976d2;
}

.tab.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: bold;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.create-btn {
  background: #1976d2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.create-btn:hover {
  background: #1565c0;
}

.post-list {
  display: grid;
  grid-gap: 2rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-user {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.user-name {
  font-weight: bold;
  margin-right: 0.5rem;
}

.post-time {
  color: #777;
  font-size: 0.9rem;
  margin-left: auto;
}

.post-title {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.post-content {
  margin-bottom: 1rem;
  color: #333;
}

.post-images {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-images img {
  max-width: 32%;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s;
}

.post-images img:hover {
  transform: scale(1.03);
}

.post-actions {
  display: flex;
  gap: 1rem;
}

.like-btn, .comment-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.like-btn:hover, .comment-btn:hover {
  background: #f5f5f5;
}

.coming-soon {
  text-align: center;
  padding: 3rem;
  color: #777;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .community-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .tab {
    width: 100%;
    text-align: center;
  }
  
  .post-images img {
    max-width: 100%;
    margin-bottom: 0.5rem;
  }
}
</style> 