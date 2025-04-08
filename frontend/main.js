import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import './assets/styles/main.css';

// 創建Vue應用
const app = createApp(App);

// 使用路由
app.use(router);

// 掛載應用
app.mount('#app');