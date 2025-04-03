<template>
  <div v-if="loading" class="loading-container">
    <LoadingSpinner />
  </div>
  <div v-else-if="error" class="error-container">
    <p>{{ error }}</p>
  </div>
  <div v-else class="admin-users">
    <h1>用戶管理</h1>
    
    <div class="filter-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜尋用戶名稱或手機號碼..." 
        class="search-input"
        @input="filterUsers"
      />
      <div class="filter-options">
        <label class="filter-option">
          <input type="checkbox" v-model="filterOptions.showAdmins" @change="filterUsers">
          只顯示管理員
        </label>
        <label class="filter-option">
          <input type="checkbox" v-model="filterOptions.showUsers" @change="filterUsers">
          只顯示普通用戶
        </label>
      </div>
    </div>
    
    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用戶名稱</th>
            <th>手機號碼</th>
            <th>用戶角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" :class="{ 'admin-row': user.role === 'admin' }">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <span class="role-badge" :class="{ 'admin-badge': user.role === 'admin' }">
                {{ user.role === 'admin' ? '管理員' : '普通用戶' }}
              </span>
            </td>
            <td>
              <button 
                class="edit-btn" 
                @click="openEditModal(user)"
                :disabled="currentUser && currentUser.id === user.id"
              >
                編輯
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="no-users">沒有找到符合條件的用戶</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 編輯用戶對話框 -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>編輯用戶</h2>
          <button @click="closeEditModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="user-name">用戶名稱</label>
            <input type="text" id="user-name" v-model="editingUser.name">
          </div>
          <div class="form-group">
            <label for="user-role">用戶角色</label>
            <select id="user-role" v-model="editingUser.role">
              <option value="user">普通用戶</option>
              <option value="admin">管理員</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeEditModal" class="cancel-btn">取消</button>
          <button @click="saveUser" class="save-btn" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getAllUsers, updateUser } from '../../services/admin';
import { getCurrentUser } from '../../services/auth';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

export default {
  name: 'AdminUsers',
  components: {
    LoadingSpinner
  },
  setup() {
    const users = ref([]);
    const filteredUsers = ref([]);
    const loading = ref(true);
    const error = ref('');
    const currentUser = ref(null);
    const searchQuery = ref('');
    const filterOptions = ref({
      showAdmins: true,
      showUsers: true
    });
    
    // 編輯用戶相關
    const showEditModal = ref(false);
    const editingUser = ref({
      id: null,
      name: '',
      role: ''
    });
    const saving = ref(false);
    
    // 獲取當前用戶
    onMounted(() => {
      currentUser.value = getCurrentUser();
      loadUsers();
    });
    
    // 加載所有用戶
    const loadUsers = async () => {
      try {
        loading.value = true;
        const data = await getAllUsers();
        users.value = data;
        filterUsers();
        loading.value = false;
      } catch (err) {
        error.value = err.message || '無法載入用戶數據';
        loading.value = false;
      }
    };
    
    // 過濾用戶
    const filterUsers = () => {
      let filtered = [...users.value];
      
      // 根據搜尋關鍵字過濾
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.phone.includes(query)
        );
      }
      
      // 根據角色過濾
      if (!filterOptions.value.showAdmins) {
        filtered = filtered.filter(user => user.role !== 'admin');
      }
      
      if (!filterOptions.value.showUsers) {
        filtered = filtered.filter(user => user.role !== 'user');
      }
      
      // 更新過濾後的用戶列表
      filteredUsers.value = filtered;
    };
    
    // 打開編輯對話框
    const openEditModal = (user) => {
      editingUser.value = { ...user };
      showEditModal.value = true;
    };
    
    // 關閉編輯對話框
    const closeEditModal = () => {
      showEditModal.value = false;
    };
    
    // 保存用戶信息
    const saveUser = async () => {
      try {
        saving.value = true;
        
        // 只更新允許的字段
        const updateData = {
          name: editingUser.value.name,
          role: editingUser.value.role
        };
        
        await updateUser(editingUser.value.id, updateData);
        
        // 更新本地用戶列表
        const userIndex = users.value.findIndex(u => u.id === editingUser.value.id);
        if (userIndex !== -1) {
          users.value[userIndex] = { ...users.value[userIndex], ...updateData };
        }
        
        // 重新過濾用戶
        filterUsers();
        
        // 關閉對話框
        closeEditModal();
        saving.value = false;
      } catch (err) {
        error.value = err.message || '無法更新用戶';
        saving.value = false;
      }
    };
    
    return {
      users,
      filteredUsers,
      loading,
      error,
      currentUser,
      searchQuery,
      filterOptions,
      showEditModal,
      editingUser,
      saving,
      filterUsers,
      openEditModal,
      closeEditModal,
      saveUser
    };
  },
  metaInfo: {
    title: '用戶管理 - 汽車美容預約平台'
  }
}
</script>

<style scoped>
.admin-users {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.filter-container {
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.users-table th, .users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.admin-row {
  background-color: #f8f8ff;
}

.role-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  background-color: #e0e0e0;
  font-size: 0.8rem;
}

.admin-badge {
  background-color: #bbdefb;
  color: #1565c0;
}

.edit-btn {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn:hover {
  background-color: #1565c0;
}

.edit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.no-users {
  text-align: center;
  color: #666;
  padding: 2rem !important;
}

/* 模態對話框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.save-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #1976d2;
  color: white;
  cursor: pointer;
}

.save-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #ffebee;
  border-radius: 8px;
  color: #d32f2f;
  text-align: center;
}
</style> 