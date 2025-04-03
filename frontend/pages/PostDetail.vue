<template>
  <div v-if="loading" class="loading">
    <p>加載中...</p>
  </div>
  <div v-else-if="error" class="error">
    <p>{{ error }}</p>
    <button @click="goBack" class="back-btn">返回</button>
  </div>
  <div v-else class="post-detail">
    <div class="post-header">
      <h1>{{ post.title }}</h1>
      <div class="post-meta">
        <div class="author">
          <img :src="post.authorAvatar || '/images/default-avatar.png'" alt="用戶頭像" class="author-avatar">
          <span>{{ post.authorName }}</span>
        </div>
        <div class="post-info">
          <span class="date">{{ formatDate(post.createdAt) }}</span>
          <span class="views">瀏覽: {{ post.views }}</span>
          <span class="comments">評論: {{ post.comments ? post.comments.length : 0 }}</span>
        </div>
      </div>
    </div>
    
    <div class="post-content">
      <div v-if="post.images && post.images.length" class="post-images">
        <div v-for="(image, index) in post.images" :key="index" class="image-container">
          <img :src="image" :alt="`圖片 ${index + 1}`" @click="showImagePreview(index)">
        </div>
      </div>
      <div class="text-content" v-html="formatContent(post.content)"></div>
      
      <div class="post-tags" v-if="post.tags && post.tags.length">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    
    <div class="post-actions">
      <button @click="likePost" :class="{'active': userLiked}" class="like-btn">
        <span class="icon">👍</span> {{ post.likes || 0 }}
      </button>
      <button @click="favoritePost" :class="{'active': userFavorited}" class="favorite-btn">
        <span class="icon">⭐</span> 收藏
      </button>
      <button @click="sharePost" class="share-btn">
        <span class="icon">📤</span> 分享
      </button>
    </div>
    
    <div class="comments-section">
      <h2>評論區 ({{ post.comments ? post.comments.length : 0 }})</h2>
      
      <div v-if="isLoggedIn" class="comment-form">
        <textarea v-model="newComment" placeholder="分享您的看法..."></textarea>
        <button @click="submitComment" :disabled="!newComment.trim()">發布評論</button>
      </div>
      <div v-else class="login-prompt">
        <p>請 <router-link to="/login">登入</router-link> 後發表評論</p>
      </div>
      
      <div class="comments-list" v-if="post.comments && post.comments.length">
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <div class="comment-header">
            <div class="commenter">
              <img :src="comment.authorAvatar || '/images/default-avatar.png'" alt="評論者頭像" class="commenter-avatar">
              <span>{{ comment.authorName }}</span>
            </div>
            <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-actions">
            <button @click="likeComment(comment.id)" class="comment-like-btn">
              👍 {{ comment.likes || 0 }}
            </button>
            <button v-if="isLoggedIn && canReply" @click="replyToComment(comment.id)" class="comment-reply-btn">
              回覆
            </button>
          </div>
          
          <!-- 回覆區域 -->
          <div v-if="comment.replies && comment.replies.length" class="replies">
            <div v-for="reply in comment.replies" :key="reply.id" class="reply">
              <div class="reply-header">
                <div class="commenter">
                  <img :src="reply.authorAvatar || '/images/default-avatar.png'" alt="回覆者頭像" class="commenter-avatar">
                  <span>{{ reply.authorName }}</span>
                </div>
                <span class="reply-date">{{ formatDate(reply.createdAt) }}</span>
              </div>
              <div class="reply-content">{{ reply.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-comments">
        <p>暫無評論，來搶沙發吧！</p>
      </div>
    </div>
    
    <div class="related-posts" v-if="relatedPosts && relatedPosts.length">
      <h2>相關帖子</h2>
      <div class="related-posts-list">
        <div v-for="relatedPost in relatedPosts" :key="relatedPost.id" 
          class="related-post" @click="goToPost(relatedPost.id)">
          <div class="related-post-title">{{ relatedPost.title }}</div>
          <div class="related-post-meta">
            <span>{{ formatDate(relatedPost.createdAt) }}</span>
            <span>評論: {{ relatedPost.comments ? relatedPost.comments.length : 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 圖片預覽 -->
  <div v-if="showPreview" class="image-preview" @click="closePreview">
    <div class="preview-container" @click.stop>
      <img :src="post.images[currentImageIndex]" :alt="`預覽 ${currentImageIndex + 1}`">
      <div class="preview-controls">
        <button @click="prevImage" :disabled="currentImageIndex === 0">上一張</button>
        <span>{{ currentImageIndex + 1 }} / {{ post.images.length }}</span>
        <button @click="nextImage" :disabled="currentImageIndex === post.images.length - 1">下一張</button>
      </div>
      <button class="close-preview" @click="closePreview">✕</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isAuthenticated } from '../services/auth';

export default {
  name: 'PostDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const post = ref({});
    const loading = ref(true);
    const error = ref(null);
    const newComment = ref('');
    const relatedPosts = ref([]);
    const userLiked = ref(false);
    const userFavorited = ref(false);
    const showPreview = ref(false);
    const currentImageIndex = ref(0);
    
    const isLoggedIn = computed(() => {
      return isAuthenticated();
    });
    
    const canReply = computed(() => {
      // 可以添加回覆權限邏輯
      return true;
    });
    
    // 模擬獲取帖子數據
    const fetchPostData = async () => {
      try {
        loading.value = true;
        error.value = null;
        
        // 模擬API請求延遲
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模擬帖子數據
        post.value = {
          id: props.id,
          title: "我的新車保養體驗分享",
          authorName: "車主小明",
          authorAvatar: "https://randomuser.me/api/portraits/men/34.jpg",
          createdAt: "2023-11-15T08:30:00",
          content: `今天去做了新車第一次保養，想分享一下經驗和大家一些建議。\n\n新車保養非常重要，可以及早發現潛在問題，也能延長車輛壽命。我選擇了原廠保養，雖然價格稍高，但服務很專業。\n\n保養過程中，技師細心檢查了引擎狀況、煞車系統、輪胎磨損等，並更換了機油和機油濾清器。\n\n建議大家：\n1. 按照廠商建議的時間或里程進行保養\n2. 保留所有保養記錄\n3. 定期檢查輪胎氣壓\n4. 注意汽車異音\n\n大家有什麼保養心得也歡迎分享！`,
          images: [
            "https://images.unsplash.com/photo-1597007066704-67bf2068d5b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          ],
          views: 138,
          likes: 24,
          tags: ["新車保養", "汽車保養", "經驗分享"],
          comments: [
            {
              id: "comment1",
              authorName: "車主大雄",
              authorAvatar: "https://randomuser.me/api/portraits/men/42.jpg",
              content: "謝謝分享！我下個月也要去做首保，這些建議很有幫助。請問你是在哪家店做的保養？",
              createdAt: "2023-11-15T10:15:00",
              likes: 5,
              replies: [
                {
                  id: "reply1",
                  authorName: "車主小明",
                  authorAvatar: "https://randomuser.me/api/portraits/men/34.jpg",
                  content: "我是在台北市信義區的原廠服務中心做的，服務很不錯，環境也很舒適。",
                  createdAt: "2023-11-15T11:30:00"
                }
              ]
            },
            {
              id: "comment2",
              authorName: "小花",
              authorAvatar: "https://randomuser.me/api/portraits/women/25.jpg",
              content: "對於新手來說，你覺得是選擇原廠保養好還是一般修車廠好呢？價格差很多嗎？",
              createdAt: "2023-11-16T09:45:00",
              likes: 3,
              replies: []
            }
          ]
        };
        
        // 模擬相關帖子
        relatedPosts.value = [
          {
            id: "post2",
            title: "冬季汽車保養指南",
            createdAt: "2023-11-10T14:20:00",
            comments: []
          },
          {
            id: "post3",
            title: "輪胎選購經驗分享",
            createdAt: "2023-11-05T16:45:00",
            comments: [1, 2, 3]
          },
          {
            id: "post4",
            title: "自助洗車VS專業洗車比較",
            createdAt: "2023-11-01T11:30:00",
            comments: [1]
          }
        ];
        
        loading.value = false;
      } catch (err) {
        loading.value = false;
        error.value = "加載帖子失敗，請重試";
        console.error("Error fetching post:", err);
      }
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const formatContent = (content) => {
      if (!content) return '';
      // 將換行符轉換為HTML換行
      return content.replace(/\n/g, '<br>');
    };
    
    const likePost = () => {
      if (!isLoggedIn.value) {
        router.push('/login');
        return;
      }
      
      userLiked.value = !userLiked.value;
      if (userLiked.value) {
        post.value.likes++;
      } else {
        post.value.likes--;
      }
      // 這裡應該有API請求來更新點贊狀態
    };
    
    const favoritePost = () => {
      if (!isLoggedIn.value) {
        router.push('/login');
        return;
      }
      
      userFavorited.value = !userFavorited.value;
      // 這裡應該有API請求來更新收藏狀態
    };
    
    const sharePost = () => {
      // 實現分享功能
      alert('分享功能正在開發中');
    };
    
    const submitComment = () => {
      if (!newComment.value.trim()) return;
      
      // 模擬添加評論
      const now = new Date().toISOString();
      if (!post.value.comments) {
        post.value.comments = [];
      }
      
      post.value.comments.unshift({
        id: `comment${Date.now()}`,
        authorName: "當前用戶",
        authorAvatar: "https://randomuser.me/api/portraits/lego/1.jpg", // 假設當前用戶頭像
        content: newComment.value,
        createdAt: now,
        likes: 0,
        replies: []
      });
      
      newComment.value = '';
      // 這裡應該有API請求來提交評論
    };
    
    const likeComment = (commentId) => {
      if (!isLoggedIn.value) {
        router.push('/login');
        return;
      }
      
      const comment = post.value.comments.find(c => c.id === commentId);
      if (comment) {
        comment.likes = (comment.likes || 0) + 1;
      }
      // 這裡應該有API請求來更新評論點贊
    };
    
    const replyToComment = (commentId) => {
      if (!isLoggedIn.value) {
        router.push('/login');
        return;
      }
      
      // 這裡可以實現回覆邏輯，例如打開回覆框等
      alert(`回覆功能正在開發中`);
    };
    
    const showImagePreview = (index) => {
      currentImageIndex.value = index;
      showPreview.value = true;
    };
    
    const closePreview = () => {
      showPreview.value = false;
    };
    
    const prevImage = () => {
      if (currentImageIndex.value > 0) {
        currentImageIndex.value--;
      }
    };
    
    const nextImage = () => {
      if (currentImageIndex.value < post.value.images.length - 1) {
        currentImageIndex.value++;
      }
    };
    
    const goToPost = (postId) => {
      router.push(`/community/posts/${postId}`);
    };
    
    const goBack = () => {
      router.push('/community');
    };
    
    onMounted(() => {
      fetchPostData();
    });
    
    return {
      post,
      loading,
      error,
      newComment,
      relatedPosts,
      userLiked,
      userFavorited,
      isLoggedIn,
      canReply,
      showPreview,
      currentImageIndex,
      formatDate,
      formatContent,
      likePost,
      favoritePost,
      sharePost,
      submitComment,
      likeComment,
      replyToComment,
      showImagePreview,
      closePreview,
      prevImage,
      nextImage,
      goToPost,
      goBack
    };
  }
};
</script>

<style scoped>
.post-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar, .commenter-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.post-info {
  display: flex;
  gap: 1rem;
  color: #777;
  font-size: 0.9rem;
}

.post-content {
  margin-bottom: 2rem;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.image-container {
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}

.image-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-container img:hover {
  transform: scale(1.05);
}

.text-content {
  line-height: 1.7;
  color: #444;
  margin-bottom: 1.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.post-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.post-actions button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.post-actions button:hover {
  background-color: #f5f5f5;
}

.post-actions button.active {
  background-color: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.comments-section {
  margin-bottom: 2rem;
}

.comments-section h2 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-form textarea {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 1rem;
  font-family: inherit;
}

.comment-form button {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  float: right;
}

.comment-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.login-prompt a {
  color: #1976d2;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.commenter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comment-date, .reply-date {
  color: #777;
  font-size: 0.9rem;
}

.comment-content {
  color: #444;
  margin-bottom: 1rem;
}

.comment-actions {
  display: flex;
  gap: 1rem;
}

.comment-like-btn, .comment-reply-btn {
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.comment-like-btn:hover, .comment-reply-btn:hover {
  color: #1976d2;
}

.replies {
  margin-top: 1rem;
  margin-left: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reply {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 1rem;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.reply-content {
  color: #444;
}

.no-comments {
  text-align: center;
  color: #777;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.related-posts {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 1.5rem;
}

.related-posts h2 {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.related-posts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.related-post {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.related-post:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.related-post-title {
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.related-post-meta {
  display: flex;
  justify-content: space-between;
  color: #777;
  font-size: 0.9rem;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  margin-top: 1rem;
}

.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-container {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.preview-container img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.preview-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  color: white;
}

.preview-controls button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.preview-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-preview {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .post-info {
    flex-wrap: wrap;
  }
  
  .post-actions {
    flex-wrap: wrap;
  }
  
  .related-posts-list {
    grid-template-columns: 1fr;
  }
}
</style> 