<template>
  <div class="not-found">
    <div class="container">
      <h1>404</h1>
      <h2>頁面不存在</h2>
      <p>您嘗試訪問的頁面不存在或已被移除</p>
      <router-link to="/" class="home-link">返回首頁</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container {
  max-width: 600px;
  padding: 2rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #1976d2;
}

h2 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: #333;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  background-color: #1976d2;
  color: white;
  padding: 0.8rem 1.5rem;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #1565c0;
}
</style> 