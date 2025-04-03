import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated, isAdmin } from './services/auth';

// 使用動態導入實現代碼分割
const Home = () => import('./pages/Home.vue');
const Providers = () => import('./pages/Providers.vue');
const ProviderDetail = () => import('./pages/ProviderDetail.vue');
const Login = () => import('./pages/Login.vue');
const Register = () => import('./pages/Register.vue');
const MyAppointments = () => import('./pages/MyAppointments.vue');
const UserProfile = () => import('./pages/UserProfile.vue');
const Community = () => import('./pages/Community.vue');
const NearbyShops = () => import('./pages/NearbyShops.vue');
const ProviderShowcase = () => import('./pages/ProviderShowcase.vue');
const PostDetail = () => import('./pages/PostDetail.vue');
const AboutUs = () => import('./pages/AboutUs.vue');
const Privacy = () => import('./pages/Privacy.vue');
const Terms = () => import('./pages/Terms.vue');

// 管理員頁面
const AdminLayout = () => import('./pages/admin/AdminLayout.vue');
const AdminDashboard = () => import('./pages/admin/Dashboard.vue');
const AdminUsers = () => import('./pages/admin/Users.vue');
const AdminAppointments = () => import('./pages/admin/Appointments.vue');
const AdminSEO = () => import('./pages/admin/SEO.vue');

// 定義路由
const routes = [
  { 
    path: '/', 
    component: Home, 
    meta: { title: '首頁 - 汽車美容預約平台' } 
  },
  { 
    path: '/providers', 
    component: Providers, 
    meta: { title: '商家列表 - 汽車美容預約平台' } 
  },
  { 
    path: '/providers/:id', 
    component: ProviderDetail, 
    meta: { title: '商家詳情 - 汽車美容預約平台' },
    props: true  // 將路由參數作為組件的props傳入
  },
  {
    path: '/providers/:id/showcase',
    component: ProviderShowcase,
    meta: { title: '商家專業展示 - 汽車美容預約平台' },
    props: true
  },
  { 
    path: '/login', 
    component: Login, 
    meta: { title: '用戶登入 - 汽車美容預約平台', guest: true } 
  },
  { 
    path: '/register', 
    component: Register, 
    meta: { title: '用戶註冊 - 汽車美容預約平台', guest: true } 
  },
  { 
    path: '/appointments', 
    component: MyAppointments, 
    meta: { 
      title: '我的預約 - 汽車美容預約平台',
      requiresAuth: true 
    } 
  },
  { 
    path: '/profile', 
    component: UserProfile, 
    meta: { 
      title: '會員專區 - 汽車美容預約平台',
      requiresAuth: true 
    } 
  },
  {
    path: '/community',
    component: Community,
    meta: { title: '愛車社區 - 汽車美容預約平台' }
  },
  {
    path: '/community/posts/:id',
    component: PostDetail,
    meta: { title: '帖子詳情 - 汽車美容預約平台' },
    props: true
  },
  {
    path: '/nearby',
    component: NearbyShops,
    meta: { title: '附近商家 - 汽車美容預約平台' }
  },
  {
    path: '/about',
    component: AboutUs,
    meta: { title: '關於我們 - 汽車美容預約平台' }
  },
  {
    path: '/privacy',
    component: Privacy,
    meta: { title: '隱私政策 - 汽車美容預約平台' }
  },
  {
    path: '/terms',
    component: Terms,
    meta: { title: '服務條款 - 汽車美容預約平台' }
  },
  // 管理員路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        component: AdminDashboard,
        meta: { 
          title: '管理員儀表板 - 汽車美容預約平台',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'users',
        component: AdminUsers,
        meta: { 
          title: '用戶管理 - 汽車美容預約平台',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'appointments',
        component: AdminAppointments,
        meta: { 
          title: '預約管理 - 汽車美容預約平台',
          requiresAuth: true,
          requiresAdmin: true
        }
      },
      {
        path: 'seo',
        component: AdminSEO,
        meta: { 
          title: 'SEO 管理 - 汽車美容預約平台',
          requiresAuth: true,
          requiresAdmin: true
        }
      }
    ]
  },
  // 404路由
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
];

// 創建路由
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置，則恢復到該位置
    if (savedPosition) {
      return savedPosition;
    }
    // 否則滾動到頂部
    return { top: 0 };
  }
});

// 全局前置守衛
router.beforeEach((to, from, next) => {
  // 更新頁面標題
  document.title = to.meta.title || '汽車美容預約平台';
  
  // 處理需要管理員權限的路由
  if (to.meta.requiresAdmin && !isAdmin()) {
    next({ 
      path: '/',
      query: { message: 'unauthorized' }
    });
  }
  // 處理需要登入的路由
  else if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    });
  } 
  // 處理只有訪客才能訪問的路由
  else if (to.meta.guest && isAuthenticated()) {
    next('/');
  }
  else {
    next();
  }
});

export default router; 