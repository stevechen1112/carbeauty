#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
汽車美容預約平台開發指令
=======================

本文件包含汽車美容預約平台MVP開發的詳細指令和配置信息。
開發團隊: Cursor
技術堆疊: Vue.js (前端) + PHP (後端)
"""

# 專案基本信息
PROJECT_INFO = {
    "專案名稱": "汽車美容預約平台MVP",
    "開發目標": "建立一個連接洗車服務商(B端)與消費者(C端)的線上預約平台的第一階段MVP版本",
    "開發團隊": "Cursor",
    "開發週期": "12週",
    "上線日期": "開發啟動後12週"
}

# 技術堆疊配置
TECH_STACK = {
    "前端": {
        "框架": "Vue.js 3",
        "狀態管理": "Vuex/Pinia",
        "路由": "Vue Router",
        "UI框架": "Element Plus/Vuetify",
        "HTTP客戶端": "Axios",
        "地圖整合": "Google Maps API",
        "構建工具": "Vite"
    },
    "後端": {
        "語言": "PHP 8.x",
        "框架": "Laravel 或 CodeIgniter",
        "API風格": "RESTful API",
        "數據庫": "MySQL",
        "認證": "JWT/Laravel Sanctum",
        "文檔": "Swagger/OpenAPI"
    },
    "基礎設施": {
        "前端部署": "Nginx/Apache",
        "後端部署": "共享主機或VPS",
        "數據庫": "MySQL服務",
        "文件存儲": "服務器存儲或S3兼容服務"
    }
}

# 核心功能需求
CORE_FEATURES = {
    "C端用戶功能": [
        "手機號註冊/登入",
        "基於位置搜索附近洗車店",
        "查看商家基本信息與服務項目",
        "選擇服務、時間並提交預約",
        "管理個人預約(查看、取消)"
    ],
    "B端商家功能": [
        "商家註冊與資料管理",
        "設置服務項目與價格",
        "管理營業時間與可預約時段",
        "接收並處理預約(確認、完成、取消)",
        "基本預約日曆視圖"
    ],
    "平台管理功能": [
        "商家審核",
        "基本統計數據"
    ]
}

# 不包含在MVP中的功能
NON_MVP_FEATURES = [
    "複雜評價系統",
    "在線支付整合",
    "會員等級系統",
    "高級數據分析",
    "商品管理系統",
    "多角色權限管理",
    "營銷工具和活動",
    "聊天功能"
]

# 數據模型
DATA_MODELS = {
    "用戶(users)": [
        "id", "phone", "name", "avatar", "created_at", "updated_at"
    ],
    "商家(providers)": [
        "id", "name", "address", "latitude", "longitude", "description", 
        "phone", "business_hours", "created_at", "updated_at"
    ],
    "服務(services)": [
        "id", "provider_id", "name", "description", "duration", 
        "price", "created_at", "updated_at"
    ],
    "預約(appointments)": [
        "id", "user_id", "provider_id", "service_id", "date", 
        "time_slot", "status", "notes", "created_at", "updated_at"
    ]
}

# API端點
API_ENDPOINTS = {
    "用戶相關": [
        {"方法": "POST", "路徑": "/api/auth/login", "描述": "用戶登入"},
        {"方法": "GET", "路徑": "/api/user", "描述": "獲取用戶信息"},
        {"方法": "PUT", "路徑": "/api/user", "描述": "更新用戶信息"}
    ],
    "商家相關": [
        {"方法": "GET", "路徑": "/api/providers", "描述": "獲取商家列表"},
        {"方法": "GET", "路徑": "/api/providers/{id}", "描述": "獲取商家詳情"},
        {"方法": "POST", "路徑": "/api/providers", "描述": "商家註冊(B端)"},
        {"方法": "PUT", "路徑": "/api/providers/{id}", "描述": "更新商家信息"}
    ],
    "服務相關": [
        {"方法": "GET", "路徑": "/api/providers/{id}/services", "描述": "獲取商家服務"},
        {"方法": "POST", "路徑": "/api/providers/{id}/services", "描述": "創建服務"}
    ],
    "預約相關": [
        {"方法": "GET", "路徑": "/api/appointments", "描述": "獲取預約列表"},
        {"方法": "POST", "路徑": "/api/appointments", "描述": "創建預約"},
        {"方法": "PUT", "路徑": "/api/appointments/{id}", "描述": "更新預約狀態"},
        {"方法": "DELETE", "路徑": "/api/appointments/{id}", "描述": "取消預約"}
    ]
}

# 頁面規劃
PAGES = {
    "C端頁面": [
        "首頁 - 搜索入口、附近熱門洗車店",
        "搜索結果 - 洗車店列表、基本篩選",
        "商家詳情 - 基本信息、服務列表",
        "預約表單 - 選擇服務、時間",
        "我的預約 - 預約列表、狀態查看",
        "個人中心 - 基本個人信息"
    ],
    "B端頁面": [
        "控制面板 - 今日預約概覽",
        "預約管理 - 預約列表、處理功能",
        "日曆視圖 - 按日期查看預約",
        "服務管理 - 服務列表、編輯功能",
        "店鋪設置 - 基本信息、營業時間",
        "個人設置 - 賬號信息"
    ],
    "管理後台頁面": [
        "商家審核 - 審核列表、審核功能",
        "用戶管理 - 簡單用戶列表",
        "數據總覽 - 基本平台數據"
    ]
}

# 開發時間線
DEVELOPMENT_TIMELINE = [
    {
        "階段": "需求確認與設計",
        "週數": "第1-2週",
        "任務": [
            "確認前後端技術細節",
            "完成用戶流程設計",
            "設計數據庫結構",
            "設計API接口規範",
            "確認UI設計風格"
        ],
        "交付物": "需求文檔、API規範、數據庫設計、UI模型"
    },
    {
        "階段": "前後端基礎開發",
        "週數": "第3-5週",
        "任務": [
            "搭建Vue.js項目結構",
            "搭建PHP後端框架",
            "實現用戶認證系統",
            "建立基本數據模型和API",
            "開發前端公共組件"
        ],
        "交付物": "基礎架構代碼、認證系統"
    },
    {
        "階段": "C端與B端核心功能",
        "週數": "第6-8週",
        "任務": [
            "開發C端搜索和預約功能",
            "實現B端預約管理功能",
            "完成基本地圖集成",
            "實現預約流程和狀態管理",
            "開發日曆視圖"
        ],
        "交付物": "功能可用的C端和B端版本"
    },
    {
        "階段": "整合與優化",
        "週數": "第9-10週",
        "任務": [
            "系統整合測試",
            "用戶體驗優化",
            "API性能優化",
            "修復發現的問題",
            "完善錯誤處理"
        ],
        "交付物": "整合後的系統版本"
    },
    {
        "階段": "測試與發布準備",
        "週數": "第11-12週",
        "任務": [
            "功能測試和驗收",
            "瀏覽器兼容性測試",
            "部署環境準備",
            "生產環境配置",
            "編寫用戶指南"
        ],
        "交付物": "可上線版本，部署文檔，用戶指南"
    }
]

# 團隊配置
TEAM_COMPOSITION = {
    "核心團隊": {
        "前端開發": "2人 (1資深，1初級)",
        "後端開發": "2人 (1資深，1初級)",
        "產品經理/項目經理": "1人 (兼UI協調)"
    },
    "外部資源": {
        "UI/UX設計": "外包或使用模板",
        "QA支持": "按需支持",
        "技術顧問": "按需支持"
    }
}

# 風險管理
RISK_MANAGEMENT = [
    {
        "風險": "範圍蔓延",
        "緩解策略": "嚴格執行MVP原則，拒絕非核心功能"
    },
    {
        "風險": "前後端整合問題",
        "緩解策略": "早期確定API規範，定期整合測試"
    },
    {
        "風險": "PHP性能問題",
        "緩解策略": "使用適當的緩存機制，監控性能瓶頸"
    },
    {
        "風險": "移動端兼容性",
        "緩解策略": "使用標準組件，進行多設備測試"
    },
    {
        "風險": "開發延遲",
        "緩解策略": "保留緩衝時間，優先實現核心功能"
    }
]

# 成功指標
SUCCESS_METRICS = {
    "技術指標": [
        "系統穩定運行(無重大漏洞)",
        "基本頁面加載時間 < 3秒",
        "API響應時間 < 500ms",
        "預約流程完成率 > 70%"
    ],
    "業務指標": [
        "B端商家註冊 ≥ 50家",
        "C端用戶註冊 ≥ 500人",
        "月預約成功數 ≥ 200次"
    ]
}

# 特別注意事項
SPECIAL_NOTES = [
    "保持功能簡單，避免範圍蔓延",
    "優先確保核心預約流程穩定可靠",
    "設計時考慮後續擴展可能(如支付系統、評價系統等)",
    "注重用戶體驗和操作流暢性",
    "確保代碼質量和可維護性",
    "此MVP是更大規劃的第一階段，未來將擴展到B2B2C模式，包括商品供應和品牌建設",
    "前端須採用響應式設計，確保移動端友好",
    "後端API需遵循RESTful設計原則"
]

def print_project_overview():
    """打印專案概覽"""
    print("\n=== 汽車美容預約平台開發指令 ===\n")
    for key, value in PROJECT_INFO.items():
        print(f"{key}: {value}")
    
    print("\n=== 核心業務目標 ===\n")
    print("1. 建立基礎BC連接平台 - C端用戶可搜索並預約洗車服務")
    print("2. 為B端商家提供簡易管理系統 - 接收並處理預約")
    print("3. 收集用戶行為數據作為后續功能迭代依據")
    print("4. 驗證平台基本商業模式")

# 開始進行開發
# 根據README中的數據結構，初始化數據庫模型和API端點

# 用戶數據結構
class User:
    def __init__(self, id, phone, name, avatar, created_at, updated_at):
        self.id = id
        self.phone = phone
        self.name = name
        self.avatar = avatar
        self.created_at = created_at
        self.updated_at = updated_at

# 商家數據結構
class Provider:
    def __init__(self, id, name, address, latitude, longitude, description, phone, business_hours, created_at, updated_at):
        self.id = id
        self.name = name
        self.address = address
        self.latitude = latitude
        self.longitude = longitude
        self.description = description
        self.phone = phone
        self.business_hours = business_hours
        self.created_at = created_at
        self.updated_at = updated_at

# 服務數據結構
class Service:
    def __init__(self, id, provider_id, name, description, duration, price, created_at, updated_at):
        self.id = id
        self.provider_id = provider_id
        self.name = name
        self.description = description
        self.duration = duration
        self.price = price
        self.created_at = created_at
        self.updated_at = updated_at

# 預約數據結構
class Appointment:
    def __init__(self, id, user_id, provider_id, service_id, date, time_slot, status, notes, created_at, updated_at):
        self.id = id
        self.user_id = user_id
        self.provider_id = provider_id
        self.service_id = service_id
        self.date = date
        self.time_slot = time_slot
        self.status = status
        self.notes = notes
        self.created_at = created_at
        self.updated_at = updated_at

# 初始化API端點的基本結構
class API:
    def __init__(self):
        self.endpoints = {}

    def add_endpoint(self, method, path, description):
        self.endpoints[path] = {"method": method, "description": description}

    def list_endpoints(self):
        for path, details in self.endpoints.items():
            print(f"{details['method']} {path} - {details['description']}")

# 初始化API
api = API()

# 添加用戶相關API
api.add_endpoint("POST", "/api/auth/login", "用戶登入")
api.add_endpoint("GET", "/api/user", "獲取用戶信息")
api.add_endpoint("PUT", "/api/user", "更新用戶信息")

# 添加商家相關API
api.add_endpoint("GET", "/api/providers", "獲取商家列表")
api.add_endpoint("GET", "/api/providers/{id}", "獲取商家詳情")
api.add_endpoint("POST", "/api/providers", "商家註冊(B端)")
api.add_endpoint("PUT", "/api/providers/{id}", "更新商家信息")

# 添加服務相關API
api.add_endpoint("GET", "/api/providers/{id}/services", "獲取商家服務")
api.add_endpoint("POST", "/api/providers/{id}/services", "創建服務")

# 添加預約相關API
api.add_endpoint("GET", "/api/appointments", "獲取預約列表")
api.add_endpoint("POST", "/api/appointments", "創建預約")
api.add_endpoint("PUT", "/api/appointments/{id}", "更新預約狀態")
api.add_endpoint("DELETE", "/api/appointments/{id}", "取消預約")

# 列出所有API端點
if __name__ == "__main__":
    print_project_overview()
    print("\n此Python檔案包含了汽車美容預約平台MVP的完整開發指令。")
    print("請將此文件提供給Cursor開發團隊作為開發指南。")
    print("\n=== API端點列表 ===\n")
    api.list_endpoints()
