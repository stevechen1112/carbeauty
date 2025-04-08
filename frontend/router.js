import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser, isAdmin } from './services/auth';

// 主頁面
const Home = () => import('./pages/Home.vue');
const Login = () => import('./pages/Login.vue');
const Register = () => import('./pages/Register.vue');
const Providers = () => import('./pages/Providers.vue');
const ProviderDetail = () => import('./pages/ProviderDetail.vue');
const NearbyShops = () => import('./pages/NearbyShops.vue');
const Community = () => import('./pages/Community.vue');
const MyAppointments = () => import('./pages/MyAppointments.vue');
const UserProfile = () => import('./pages/UserProfile.vue');
const BookingSuccess = () => import('./pages/BookingSuccess.vue');

// 簡易404頁面組件
const NotFound = {
  template: `
    <div style="text-align: center; padding: 50px;">
      <h1 style="font-size: 72px; margin-bottom: 20px; color: #1976d2;">404</h1>
      <h2 style="margin-bottom: 15px; color: #333;">頁面不存在</h2>
      <p style="margin-bottom: 30px; color: #666;">您嘗試訪問的頁面不存在或已被移除</p>
      <a href="/" style="display: inline-block; background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">返回首頁</a>
    </div>
  `
};

// 管理員頁面
const AdminLayout = () => import('./pages/admin/AdminLayout.vue');
const AdminDashboard = () => import('./pages/admin/Dashboard.vue');
const AdminUsers = () => import('./pages/admin/Users.vue');
const AdminProviders = () => import('./pages/admin/Providers.vue');
const AdminAppointments = () => import('./pages/admin/Appointments.vue');
const AdminSEO = () => import('./pages/admin/SEO.vue');

// 路由守衛 - 確保用戶已登入
const requireAuth = (to, from, next) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
};

// 路由守衛 - 確保用戶是管理員
const requireAdmin = (to, from, next) => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }
  
  if (!isAdmin()) {
    console.error('用戶不是管理員，無權訪問管理員頁面');
    return next('/');
  }
  
  next();
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/providers',
    name: 'Providers',
    component: Providers
  },
  {
    path: '/providers/:id',
    name: 'ProviderDetail',
    component: ProviderDetail,
    props: true
  },
  {
    path: '/nearby',
    name: 'NearbyShops',
    component: NearbyShops
  },
  {
    path: '/community',
    name: 'Community',
    component: Community
  },
  {
    path: '/appointments',
    name: 'MyAppointments',
    component: MyAppointments,
    beforeEnter: requireAuth
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    beforeEnter: requireAuth
  },
  {
    path: '/booking/success',
    name: 'BookingSuccess',
    component: BookingSuccess,
    beforeEnter: requireAuth
  },
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: requireAdmin,
    children: [
      {
        path: '',
        redirect: { name: 'AdminDashboard' }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers
      },
      {
        path: 'providers',
        name: 'AdminProviders',
        component: AdminProviders
      },
      {
        path: 'appointments',
        name: 'AdminAppointments',
        component: AdminAppointments
      },
      {
        path: 'seo',
        name: 'AdminSEO',
        component: AdminSEO
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 