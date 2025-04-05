<template>
  <div class="spinner-container">
    <div class="spinner"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100px;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #1976d2;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 