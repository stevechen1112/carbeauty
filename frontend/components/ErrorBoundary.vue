<template>
  <div>
    <div v-if="error" class="error-container">
      <h2>發生錯誤</h2>
      <p>{{ errorMessage }}</p>
      <button @click="resetError" class="reset-btn">重試</button>
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      error: null
    };
  },
  computed: {
    errorMessage() {
      return this.error ? this.error.message || '未知錯誤' : '';
    }
  },
  methods: {
    resetError() {
      this.error = null;
      if (this.$router) {
        this.$router.go(0); // 重新加載頁面
      }
    }
  },
  errorCaptured(err, vm, info) {
    console.error('捕獲到組件錯誤:', err, vm, info);
    this.error = err;
    
    // 防止錯誤向上傳播
    return false;
  }
};
</script>

<style scoped>
.error-container {
  margin: 2rem auto;
  max-width: 500px;
  padding: 2rem;
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-container h2 {
  color: #d32f2f;
  margin-top: 0;
  margin-bottom: 1rem;
}

.reset-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.reset-btn:hover {
  background-color: #d32f2f;
}
</style> 