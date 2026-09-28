/**
 * Centralized API Endpoints for Eco Factory App
 * Organized by domain and authorization level
 */

export const API_ENDPOINTS = {
  // ─── AUTHENTICATION & SESSIONS ────────────────────────────────────
  auth: {
    me: "/auth/me",
    login: (provider: string) => `/auth/login/${encodeURIComponent(provider)}`,
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    changePassword: "/auth/change-password",
    passwordResetOtp: "/auth/password-reset/otp",
    passwordResetConfirm: "/auth/password-reset/confirm",
  },

  // ─── REGISTRATIONS (PUBLIC) ───────────────────────────────────────
  registrations: {
    base: "/api/registrations",
    phoneAvailability: "/api/registrations/phone-availability",
    referrerLookup: "/api/registrations/referrer-lookup",
  },

  // ─── CURRENT USER & PROFILE ───────────────────────────────────────
  me: {
    profile: "/api/me/profile",
    roles: "/api/me/roles",
    referrer: "/api/me/referrer",
  },

  // ─── MASTER DATA (SHARED / DỮ LIỆU LIÊN KẾT) ─────────────────────
  masterData: {
    // Nhóm nông sản/sản phẩm đang chế biến
    factoryProductGroups: {
      public: "/api/master-data/factory-product-groups",
      publicDetail: (id: string | number) => `/api/master-data/factory-product-groups/${id}`,
      admin: "/api/admin/master-data/factory-product-groups",
      adminDetail: (id: string | number) => `/api/admin/master-data/factory-product-groups/${id}`,
    },

    // Dịch vụ chế biến tại nhà máy
    factoryProcessingServices: {
      public: "/api/master-data/factory-processing-services",
      publicDetail: (id: string | number) => `/api/master-data/factory-processing-services/${id}`,
      admin: "/api/admin/master-data/factory-processing-services",
      adminDetail: (id: string | number) => `/api/admin/master-data/factory-processing-services/${id}`,
    },

    // Chứng chỉ, tiêu chuẩn và tổ chức cấp
    certificates: {
      public: "/api/master-data/certificates",
      admin: "/api/admin/master-data/certificates",
    },
    certificateStandards: {
      public: "/api/master-data/certificate-standards",
      admin: "/api/admin/master-data/certificate-standards",
    },
    certificateIssuers: {
      public: "/api/master-data/certificate-issuers",
      admin: "/api/admin/master-data/certificate-issuers",
    },

    // Thiết bị & Nhóm thiết bị máy móc
    equipment: {
      public: "/api/master-data/equipment",
      admin: "/api/admin/master-data/equipment",
    },
    equipmentToolGroups: {
      public: "/api/master-data/equipment-tool-groups",
      admin: "/api/admin/master-data/equipment-tool-groups",
    },

    // Phụ phẩm & Nhóm phụ phẩm
    byProducts: {
      public: "/api/master-data/by-products",
      admin: "/api/admin/master-data/by-products",
    },
    byProductGroups: {
      public: "/api/master-data/by-product-groups",
      admin: "/api/admin/master-data/by-product-groups",
    },

    // Quy cách đóng gói / Bao bì
    packagingTypes: {
      public: "/api/master-data/packaging-types",
      admin: "/api/admin/master-data/packaging-types",
    },

    // Đơn vị tính cơ bản
    unitsBase: {
      public: "/api/master-data/units-base",
      admin: "/api/admin/master-data/units-base",
    },

    // Địa lý hành chính (Tỉnh/Thành, Xã/Phường)
    geo: {
      provinces: "/api/master-data/geo/provinces",
      provinceDetail: (code: string | number) => `/api/master-data/geo/provinces/${code}`,
      wards: "/api/master-data/geo/wards",
      wardDetail: (code: string | number) => `/api/master-data/geo/wards/${code}`,
    },
  },

  // ─── HỒ SƠ NHÀ MÁY & CƠ SỞ (FARM / FACTORY DOMAIN) ────────────────
  farm: {
    workspaceProfile: "/api/farm/workspace-profile",
    certificates: {
      base: "/api/farm/certificates",
      detail: (id: string | number) => `/api/farm/certificates/${id}`,
    },
    equipment: {
      base: "/api/farm/supplies/equipment",
      detail: (id: string | number) => `/api/farm/supplies/equipment/${id}`,
    },
    branches: {
      base: "/api/farm/branches",
      detail: (id: string | number) => `/api/farm/branches/${id}`,
    },
    contacts: {
      base: "/api/farm/contacts",
      detail: (id: string | number) => `/api/farm/contacts/${id}`,
    },
    personnel: {
      base: "/api/farm/personnel",
      detail: (id: string | number) => `/api/farm/personnel/${id}`,
    },
    departments: {
      base: "/api/farm/departments",
      detail: (id: string | number) => `/api/farm/departments/${id}`,
    },
    bankAccounts: {
      base: "/api/farm/bank-accounts",
      detail: (id: string | number) => `/api/farm/bank-accounts/${id}`,
    },
    legalIdentifications: {
      base: "/api/farm/legal-identifications",
      detail: (id: string | number) => `/api/farm/legal-identifications/${id}`,
    },
  },

  // ─── CENTER & WORKSPACES ──────────────────────────────────────────
  center: {
    workspaces: "/api/center/workspaces",
    currentWorkspace: "/api/center/workspaces/current",
  },

  // ─── STORAGE & FILE UPLOAD ────────────────────────────────────────
  storage: {
    files: "/api/storage/files",
    diaryPhotos: "/api/storage/diary-photos",
  },
} as const;
