<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo">汽車美容預約平台</div>
      <ul class="nav-links">
        <li><router-link to="/">首頁</router-link></li>
        <li><router-link to="/providers">商家列表</router-link></li>
        <li><router-link to="/nearby">附近商家</router-link></li>
        <li><router-link to="/community">愛車社區</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/appointments">我的預約</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/profile">會員專區</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">登入</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">註冊</router-link></li>
        <li v-if="isLoggedIn" @click="logout" class="logout-btn">登出</li>
        <li v-if="isAdmin" class="admin-link"><router-link to="/admin">管理員系統</router-link></li>
      </ul>
    </nav>
    <div class="container">
      <error-boundary>
        <router-view></router-view>
      </error-boundary>
    </div>
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-links">
            <router-link to="/about">關於我們</router-link>
            <router-link to="/terms">服務條款</router-link>
            <router-link to="/privacy">隱私政策</router-link>
          </div>
          <p>&copy; {{ currentYear }} 汽車美容預約平台 - 版權所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, logout, isAdmin as checkIsAdmin } from './services/auth';
import ErrorBoundary from './components/ErrorBoundary.vue';

export default {
  name: 'App',
  components: {
    ErrorBoundary
  },
  setup() {
    const isLoggedIn = ref(false);
    const user = ref(null);
    const router = useRouter();
    const isAdmin = ref(false);
    
    // 處理登出操作
    const handleLogout = () => {
      logout();
      updateAuthState();
      router.push('/');
    };
    
    // 更新認證狀態
    const updateAuthState = () => {
      user.value = getCurrentUser();
      isLoggedIn.value = !!user.value;
      isAdmin.value = checkIsAdmin();
    };
    
    // 獲取當前年份
    const currentYear = computed(() => new Date().getFullYear());
    
    // 監聽存儲事件以處理認證狀態變化
    const handleStorageChange = () => {
      updateAuthState();
    };
    
    onMounted(() => {
      updateAuthState();
      window.addEventListener('storage', handleStorageChange);
    });
    
    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange);
    });
    
    return {
      isLoggedIn,
      user,
      handleLogout,
      currentYear,
      isAdmin
    };
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1976d2;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 1.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #bbdefb;
}

.logout-btn {
  cursor: pointer;
  transition: color 0.3s;
}

.logout-btn:hover {
  color: #bbdefb;
}

.container {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #1976d2;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  margin-top: 2rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #bbdefb;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
  }
  
  .nav-links {
    margin-top: 1rem;
  }
  
  .nav-links li {
    margin-left: 1rem;
    margin-right: 1rem;
  }
}

.admin-link {
  background-color: rgba(25, 118, 210, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  color: #1976d2;
  font-weight: 500;
}

.admin-link:hover, .admin-link.router-link-active {
  background-color: rgba(25, 118, 210, 0.2);
}
</style>