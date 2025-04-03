<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="logo-container">
        <router-link to="/" class="logo">汽車美容預約平台</router-link>
        <span class="admin-badge">管理員系統</span>
      </div>
      <div class="user-info">
        <span v-if="currentUser">{{ currentUser.name }}</span>
        <button @click="logout" class="logout-btn">登出</button>
      </div>
    </header>
    
    <div class="admin-container">
      <aside class="admin-sidebar">
        <nav class="sidebar-nav">
          <router-link to="/admin/dashboard" class="nav-item">
            <span class="icon">📊</span>
            <span class="label">儀表板</span>
          </router-link>
          <router-link to="/admin/users" class="nav-item">
            <span class="icon">👥</span>
            <span class="label">用戶管理</span>
          </router-link>
          <router-link to="/admin/providers" class="nav-item">
            <span class="icon">🏢</span>
            <span class="label">商家管理</span>
          </router-link>
          <router-link to="/admin/appointments" class="nav-item">
            <span class="icon">📅</span>
            <span class="label">預約管理</span>
          </router-link>
          <router-link to="/admin/services" class="nav-item">
            <span class="icon">🛠️</span>
            <span class="label">服務管理</span>
          </router-link>
          <router-link to="/admin/seo" class="nav-item">
            <span class="icon">🔍</span>
            <span class="label">SEO 管理</span>
          </router-link>
          <router-link to="/admin/settings" class="nav-item">
            <span class="icon">⚙️</span>
            <span class="label">系統設置</span>
          </router-link>
          <div class="nav-divider"></div>
          <router-link to="/" class="nav-item">
            <span class="icon">🏠</span>
            <span class="label">返回前台</span>
          </router-link>
        </nav>
      </aside>
      
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, logout as authLogout } from '../../services/auth';

export default {
  name: 'AdminLayout',
  setup() {
    const router = useRouter();
    const currentUser = ref(null);
    
    onMounted(() => {
      currentUser.value = getCurrentUser();
      
      // 檢查用戶是否為管理員
      if (!currentUser.value || currentUser.value.role !== 'admin') {
        router.push('/login');
      }
    });
    
    const logout = () => {
      authLogout();
      router.push('/login');
    };
    
    return {
      currentUser,
      logout
    };
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background-color: #1976d2;
  color: white;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  margin-right: 1rem;
}

.admin-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.admin-container {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  background-color: #f5f5f5;
  width: 250px;
  flex-shrink: 0;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.sidebar-nav {
  padding: 1.5rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: #333;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #e8e8e8;
}

.nav-item.router-link-active {
  background-color: #e3f2fd;
  color: #1976d2;
  border-right: 3px solid #1976d2;
}

.icon {
  margin-right: 1rem;
  font-size: 1.2rem;
  display: inline-flex;
  justify-content: center;
  width: 24px;
}

.nav-divider {
  margin: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.admin-content {
  flex: 1;
  background-color: #f9f9f9;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .sidebar-nav {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem;
  }
  
  .nav-item {
    padding: 0.5rem 1rem;
  }
  
  .nav-divider {
    display: none;
  }
}
</style> 