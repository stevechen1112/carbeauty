// 加載環境變數
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const bcrypt = require('bcryptjs');

// JWT密鑰 - 從環境變量獲取，如果不存在則使用隨機生成的密鑰（僅用於開發環境）
const JWT_SECRET = process.env.JWT_SECRET || require('crypto').randomBytes(64).toString('hex');

// 安全提示
if (!process.env.JWT_SECRET) {
  console.warn('警告: 未設置JWT_SECRET環境變量。使用隨機生成的密鑰，這在生產環境中不安全。');
}

// 模擬數據庫
const users = [
  { id: 1, phone: '0912345678', name: '測試用戶', password: 'password123', role: 'user' },
  { id: 2, phone: '0911111111', name: '系統管理員', password: 'admin123', role: 'admin' }
];

const providers = [
  { 
    id: 1, 
    name: '頂級汽車美容中心', 
    address: '台北市信義區松高路123號',
    latitude: 25.036256,
    longitude: 121.564624,
    description: '我們是台北市頂尖的汽車美容服務提供商，擁有多年經驗的專業團隊，提供包括洗車、打蠟、內裝清潔等多種服務。',
    phone: '02-12345678',
    business_hours: '週一至週六 09:00-18:00',
    rating: 4.8,
    review_count: 56
  },
  { 
    id: 2, 
    name: '豪華車專業洗車', 
    address: '台北市大安區敦化南路456號',
    latitude: 25.026924,
    longitude: 121.548531,
    description: '專注於高級車輛護理，提供客製化的服務方案，讓您的愛車煥然一新。',
    phone: '02-23456789',
    business_hours: '週一至週日 10:00-20:00',
    rating: 4.6,
    review_count: 42
  },
  { 
    id: 3, 
    name: '閃亮汽車美容工作室', 
    address: '台北市中山區南京東路789號',
    latitude: 25.052362,
    longitude: 121.536505,
    description: '提供專業細緻的汽車美容服務，特別擅長內裝深度清潔與外觀拋光。',
    phone: '02-34567890',
    business_hours: '週二至週日 09:00-19:00',
    rating: 4.7,
    review_count: 38
  }
];

const services = [
  { id: 1, provider_id: 1, name: '基礎洗車', description: '包括車身外部清洗、輪胎清潔與上光', duration: 30, price: 350 },
  { id: 2, provider_id: 1, name: '精緻洗車', description: '包括基礎洗車的所有服務，加上車內吸塵、座椅清潔與儀表板保養', duration: 60, price: 650 },
  { id: 3, provider_id: 1, name: '車身打蠟', description: '使用高級車蠟，增強車漆光澤，提供保護層', duration: 90, price: 1200 },
  { id: 4, provider_id: 1, name: '內裝深度清潔', description: '全車內裝深度清潔，包括座椅縫隙、空調出風口、後車廂等區域', duration: 120, price: 1500 },
  { id: 5, provider_id: 2, name: '豪華洗車套餐', description: '專為高級車輛設計的全套清潔服務', duration: 90, price: 1200 },
  { id: 6, provider_id: 3, name: '內裝特殊清潔', description: '針對頑固污漬的特殊處理', duration: 120, price: 1800 }
];

let appointments = [
  { 
    id: 1, 
    user_id: 1, 
    provider_id: 1, 
    service_id: 2, 
    date: '2023-04-20', 
    time_slot: '14:00', 
    status: 'confirmed', 
    notes: '黑色賓士轎車',
    created_at: '2023-04-10T10:30:00Z'
  }
];

let reviews = [
  {
    id: 1,
    user_id: 1,
    provider_id: 1,
    rating: 5,
    comment: '服務非常專業，車子洗完亮如新車，會再次光顧！',
    created_at: '2023-03-15T14:30:00Z'
  }
];

// Middleware
app.use(bodyParser.json());
app.use(cors());

// 安全中間件配置
// 添加基本安全頭信息
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:*", "https://api.example.com"]
    }
  },
  // 在開發環境中禁用某些嚴格的安全政策，避免影響開發體驗
  ...(process.env.NODE_ENV === 'development' ? {
    contentSecurityPolicy: false,
  } : {})
}));

// 防止 XSS 攻擊
app.use(xss());

// 速率限制 - 針對所有請求
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分鐘
  max: 100, // 每個IP在windowMs期間內的最大請求數
  message: { 
    status: 429, 
    message: '請求過多，請稍後再試。' 
  }
});
app.use(limiter);

// 登入請求的特殊速率限制，防止暴力破解
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小時
  max: 5, // 每個IP在windowMs期間內的最大請求數
  message: { 
    status: 429, 
    message: '登入嘗試次數過多，請1小時後再試。' 
  },
  skipSuccessfulRequests: true, // 成功的請求不計入限制
});

// 身份驗證中間件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ message: '需要登入' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: '令牌無效或已過期' });
    
    req.user = user;
    next();
  });
};

// 管理員權限驗證中間件
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: '需要管理員權限' });
  }
  next();
};

// 用戶註冊API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    // 基本驗證
    if (!name || !phone || !password) {
      return res.status(400).json({
        message: '請提供姓名、手機號碼和密碼'
      });
    }
    
    // 檢查電話格式
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: '請提供有效的台灣手機號碼格式'
      });
    }
    
    // 檢查密碼強度
    if (password.length < 8) {
      return res.status(400).json({
        message: '密碼至少需要8個字符'
      });
    }
    
    // 檢查用戶是否已存在
    if (users.some(user => user.phone === phone)) {
      return res.status(409).json({
        message: '此手機號碼已被註冊'
      });
    }
    
    // 使用bcrypt加密密碼
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 創建新用戶
    const newUser = {
      id: users.length + 1,
      name,
      phone,
      password: hashedPassword,  // 存儲加密後的密碼
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // 添加到模擬數據庫
    users.push(newUser);
    
    // 返回成功響應，但不返回密碼
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: '註冊成功',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({
      message: '服務器錯誤，請稍後再試'
    });
  }
});

// 用戶登入API - 使用bcrypt驗證密碼
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // 查找用戶
    const user = users.find(u => u.phone === phone);
    
    // 用戶不存在
    if (!user) {
      return res.status(401).json({
        message: '手機號碼或密碼錯誤'
      });
    }
    
    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: '手機號碼或密碼錯誤'
      });
    }
    
    // 生成JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // 返回用戶信息和令牌，但不返回密碼
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: '登入成功',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({
      message: '服務器錯誤，請稍後再試'
    });
  }
});

// 用戶信息API
app.get('/api/user', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: '用戶不存在' });
  }
  
  res.json({
    id: user.id,
    phone: user.phone,
    name: user.name
  });
});

app.put('/api/user', authenticateToken, (req, res) => {
  const { name } = req.body;
  
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: '用戶不存在' });
  }
  
  users[userIndex].name = name;
  
  res.json({
    id: users[userIndex].id,
    phone: users[userIndex].phone,
    name: users[userIndex].name
  });
});

// 商家相關API
app.get('/api/providers', (req, res) => {
  const { search } = req.query;
  
  if (search) {
    const filteredProviders = providers.filter(
      p => p.name.includes(search) || p.address.includes(search)
    );
    return res.json(filteredProviders);
  }
  
  res.json(providers);
});

app.get('/api/providers/:id', (req, res) => {
  const providerId = parseInt(req.params.id);
  const provider = providers.find(p => p.id === providerId);
  
  if (!provider) {
    return res.status(404).json({ message: '找不到該商家' });
  }
  
  // 獲取此商家的服務列表
  const providerServices = services.filter(s => s.provider_id === providerId);
  
  // 獲取此商家的評價
  const providerReviews = reviews.filter(r => r.provider_id === providerId);
  
  res.json({
    ...provider,
    services: providerServices,
    reviews: providerReviews
  });
});

app.post('/api/providers', (req, res) => {
  const { name, address, latitude, longitude, description, phone, business_hours } = req.body;
  
  const newProvider = {
    id: providers.length + 1,
    name,
    address,
    latitude,
    longitude,
    description,
    phone,
    business_hours,
    rating: 0,
    review_count: 0
  };
  
  providers.push(newProvider);
  
  res.status(201).json(newProvider);
});

app.put('/api/providers/:id', (req, res) => {
  const providerId = parseInt(req.params.id);
  const { name, address, latitude, longitude, description, phone, business_hours } = req.body;
  
  const providerIndex = providers.findIndex(p => p.id === providerId);
  
  if (providerIndex === -1) {
    return res.status(404).json({ message: '找不到該商家' });
  }
  
  providers[providerIndex] = {
    ...providers[providerIndex],
    name,
    address,
    latitude,
    longitude,
    description,
    phone,
    business_hours
  };
  
  res.json(providers[providerIndex]);
});

// 服務相關API
app.get('/api/providers/:id/services', (req, res) => {
  const providerId = parseInt(req.params.id);
  
  const providerServices = services.filter(s => s.provider_id === providerId);
  
  res.json(providerServices);
});

app.post('/api/providers/:id/services', (req, res) => {
  const providerId = parseInt(req.params.id);
  const { name, description, duration, price } = req.body;
  
  const newService = {
    id: services.length + 1,
    provider_id: providerId,
    name,
    description,
    duration,
    price
  };
  
  services.push(newService);
  
  res.status(201).json(newService);
});

// 預約相關API
app.get('/api/appointments', authenticateToken, (req, res) => {
  const userAppointments = appointments.filter(a => a.user_id === req.user.id);
  
  // 豐富預約數據
  const enrichedAppointments = userAppointments.map(appointment => {
    const provider = providers.find(p => p.id === appointment.provider_id);
    const service = services.find(s => s.id === appointment.service_id);
    
    return {
      ...appointment,
      provider_name: provider ? provider.name : 'Unknown',
      service_name: service ? service.name : 'Unknown',
      price: service ? service.price : 0
    };
  });
  
  res.json(enrichedAppointments);
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const { provider_id, service_id, date, time_slot, notes } = req.body;
  
  // 檢查服務商和服務是否存在
  const provider = providers.find(p => p.id === provider_id);
  const service = services.find(s => s.id === service_id && s.provider_id === provider_id);
  
  if (!provider || !service) {
    return res.status(400).json({ message: '無效的服務商或服務' });
  }
  
  // 創建新預約
  const newAppointment = {
    id: appointments.length + 1,
    user_id: req.user.id,
    provider_id,
    service_id,
    date,
    time_slot,
    status: 'pending',
    notes,
    created_at: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  
  res.status(201).json({
    ...newAppointment,
    provider_name: provider.name,
    service_name: service.name,
    price: service.price
  });
});

app.put('/api/appointments/:id', authenticateToken, (req, res) => {
  const appointmentId = parseInt(req.params.id);
  const { status } = req.body;
  
  const appointmentIndex = appointments.findIndex(
    a => a.id === appointmentId && a.user_id === req.user.id
  );
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: '找不到該預約' });
  }
  
  // 更新預約狀態
  appointments[appointmentIndex].status = status;
  
  res.json(appointments[appointmentIndex]);
});

app.delete('/api/appointments/:id', authenticateToken, (req, res) => {
  const appointmentId = parseInt(req.params.id);
  
  const appointmentIndex = appointments.findIndex(
    a => a.id === appointmentId && a.user_id === req.user.id
  );
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: '找不到該預約' });
  }
  
  // 檢查預約是否可以取消
  if (appointments[appointmentIndex].status !== 'pending' && appointments[appointmentIndex].status !== 'confirmed') {
    return res.status(400).json({ message: '無法取消此預約' });
  }
  
  // 更新預約狀態為已取消
  appointments[appointmentIndex].status = 'cancelled';
  
  res.json({ message: '預約已取消' });
});

// 評價相關API
app.post('/api/providers/:id/reviews', authenticateToken, (req, res) => {
  const providerId = parseInt(req.params.id);
  const { rating, comment } = req.body;
  
  // 檢查評分是否有效
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: '評分必須在1-5之間' });
  }
  
  // 創建新評價
  const newReview = {
    id: reviews.length + 1,
    user_id: req.user.id,
    provider_id: providerId,
    rating,
    comment,
    created_at: new Date().toISOString()
  };
  
  reviews.push(newReview);
  
  // 更新商家評分
  const providerIndex = providers.findIndex(p => p.id === providerId);
  
  if (providerIndex !== -1) {
    const providerReviews = reviews.filter(r => r.provider_id === providerId);
    const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / providerReviews.length;
    
    providers[providerIndex].rating = parseFloat(averageRating.toFixed(1));
    providers[providerIndex].review_count = providerReviews.length;
  }
  
  res.status(201).json(newReview);
});

// 管理員API
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  // 返回所有用戶（不包括密碼）
  const safeUsers = users.map(user => ({
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role
  }));
  
  res.json(safeUsers);
});

app.get('/api/admin/appointments', authenticateToken, requireAdmin, (req, res) => {
  // 返回所有預約，包括用戶和商家信息
  const detailedAppointments = appointments.map(appointment => {
    const user = users.find(u => u.id === appointment.user_id);
    const provider = providers.find(p => p.id === appointment.provider_id);
    const service = services.find(s => s.id === appointment.service_id);
    
    return {
      ...appointment,
      user: user ? { id: user.id, name: user.name, phone: user.phone } : null,
      provider: provider ? { id: provider.id, name: provider.name } : null,
      service: service ? { id: service.id, name: service.name, price: service.price } : null
    };
  });
  
  res.json(detailedAppointments);
});

app.get('/api/admin/dashboard', authenticateToken, requireAdmin, (req, res) => {
  // 系統概覽數據
  const userCount = users.length;
  const providerCount = providers.length;
  const appointmentCount = appointments.length;
  const totalRevenue = appointments.reduce((sum, appointment) => {
    const service = services.find(s => s.id === appointment.service_id);
    return sum + (service ? service.price : 0);
  }, 0);
  
  // 計算最近一週的預約數量
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentAppointments = appointments.filter(a => new Date(a.created_at) >= oneWeekAgo);
  
  res.json({
    userCount,
    providerCount,
    appointmentCount,
    totalRevenue,
    recentAppointmentsCount: recentAppointments.length
  });
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, role } = req.body;
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: '用戶不存在' });
  }
  
  // 更新用戶信息
  if (name) users[userIndex].name = name;
  if (role) users[userIndex].role = role;
  
  res.json({
    id: users[userIndex].id,
    phone: users[userIndex].phone,
    name: users[userIndex].name,
    role: users[userIndex].role
  });
});

// SEO管理API
app.get('/api/admin/seo/metadata', authenticateToken, requireAdmin, (req, res) => {
  // 這裡應該從資料庫獲取元數據
  // 由於目前沒有資料庫，我們返回硬編碼的示例數據
  const metadataExample = {
    '/': {
      title: '汽車美容預約平台 - 專業洗車、打蠟、鍍膜服務預約',
      description: '汽車美容預約平台提供專業洗車、打蠟、鍍膜等服務預約，快速尋找附近優質商家，線上輕鬆預約，無需等待。',
      keywords: '汽車美容,預約平台,洗車服務,打蠟,鍍膜,汽車保養',
      ogImage: '/images/home-og.jpg'
    },
    '/providers': {
      title: '商家列表 - 尋找附近汽車美容服務商 | 汽車美容預約平台',
      description: '瀏覽所有合作的汽車美容服務商，查看詳細信息、服務項目和用戶評價，選擇最適合您的服務提供商。',
      keywords: '汽車美容商家,服務商列表,洗車店,附近商家,評價',
      ogImage: '/images/providers-og.jpg'
    },
    '/about': {
      title: '關於我們 - 汽車美容預約平台',
      description: '了解汽車美容預約平台的使命、價值觀和服務承諾，我們致力於為客戶提供最優質的汽車美容服務體驗。',
      keywords: '關於汽車美容預約平台,平台介紹,服務承諾,品牌故事',
      ogImage: '/images/about-og.jpg'
    }
  };
  
  res.json(metadataExample);
});

app.put('/api/admin/seo/metadata/:path', authenticateToken, requireAdmin, (req, res) => {
  const { path } = req.params;
  const metadata = req.body;
  
  // 這裡應該更新資料庫中的元數據
  // 由於目前沒有資料庫，我們只是返回成功
  
  console.log(`更新頁面 ${path} 的元數據:`, metadata);
  
  res.json({
    success: true,
    message: '元數據已更新',
    path,
    metadata
  });
});

app.get('/api/admin/seo/schemas', authenticateToken, requireAdmin, (req, res) => {
  // 示例結構化數據
  const schemasExample = [
    {
      id: 1,
      type: 'LocalBusiness',
      data: {
        name: '汽車美容預約平台',
        address: '台北市信義區松高路1號',
        telephone: '02-12345678',
        openingHours: 'Mo-Fr 09:00-18:00'
      }
    },
    {
      id: 2,
      type: 'Service',
      data: {
        name: '豪華洗車服務',
        description: '專業豪華洗車服務，包括外觀清洗、內飾清潔等',
        provider: '汽車美容預約平台',
        price: '500 TWD'
      }
    }
  ];
  
  res.json(schemasExample);
});

app.post('/api/admin/seo/schemas', authenticateToken, requireAdmin, (req, res) => {
  const schema = req.body;
  
  // 這裡應該保存到資料庫
  console.log('新增結構化數據:', schema);
  
  res.status(201).json({
    success: true,
    message: '結構化數據已建立',
    id: Date.now(), // 模擬生成ID
    ...schema
  });
});

app.get('/api/admin/seo/sitemap', authenticateToken, requireAdmin, (req, res) => {
  // 示例網站地圖數據
  const sitemapExample = [
    { url: 'https://example.com/', lastmod: '2023-04-01', changefreq: 'weekly', priority: '1.0' },
    { url: 'https://example.com/providers', lastmod: '2023-04-02', changefreq: 'weekly', priority: '0.8' },
    { url: 'https://example.com/about', lastmod: '2023-03-15', changefreq: 'monthly', priority: '0.5' },
    { url: 'https://example.com/services', lastmod: '2023-03-20', changefreq: 'monthly', priority: '0.7' },
    { url: 'https://example.com/contact', lastmod: '2023-03-10', changefreq: 'monthly', priority: '0.5' }
  ];
  
  res.json(sitemapExample);
});

app.post('/api/admin/seo/generate-sitemap', authenticateToken, requireAdmin, (req, res) => {
  // 這裡應該實際生成網站地圖
  console.log('生成網站地圖');
  
  res.json({
    success: true,
    message: '網站地圖已生成',
    lastGenerated: new Date().toISOString()
  });
});

app.post('/api/admin/seo/submit-sitemap', authenticateToken, requireAdmin, (req, res) => {
  const { engines } = req.body; // 例如 ['google', 'bing']
  
  // 這裡應該實際提交網站地圖到搜尋引擎
  console.log(`提交網站地圖到搜尋引擎: ${engines.join(', ')}`);
  
  res.json({
    success: true,
    message: '網站地圖已提交',
    engines,
    submittedAt: new Date().toISOString()
  });
});

// 404錯誤處理
app.use((req, res, next) => {
  res.status(404).json({
    message: '找不到請求的資源',
    status: 404
  });
});

// 全局錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('錯誤：', err.message);
  
  // 不向用戶暴露敏感的錯誤詳情
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      status: 'error',
      message: '服務器內部錯誤，請稍後再試。'
    });
  } else {
    return res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack
    });
  }
});

// 啟動服務器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`後端服務器運行在 http://localhost:${PORT}`);
});