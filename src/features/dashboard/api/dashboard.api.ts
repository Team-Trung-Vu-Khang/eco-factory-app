import type { FactoryDashboard } from "../types";

export const dashboardKeys = {
  all: ["factory-dashboard"] as const,
};

// TODO: replace with apiClient.get("/api/factory/dashboard") when the API is ready
const MOCK_DASHBOARD: FactoryDashboard = {
  stats: {
    availableCapacityTonPerDay: 4.5,
    maxCapacityTonPerDay: 12,
    newMatchingDemands: 6,
    activeDemands: 4,
    connectedDemands: 11,
    profileCompletionPercent: 80,
  },
  profile: {
    completionPercent: 80,
    isKpiEligible: false,
    kpiEligibleAt: null,
    checklist: [
      { key: "basic", label: "Thông tin cơ bản", done: true },
      { key: "representative", label: "Người đại diện", done: true },
      { key: "location", label: "Địa điểm & vị trí bản đồ", done: true },
      { key: "activity", label: "Nông sản & dịch vụ chế biến", done: true },
      { key: "machines", label: "Máy móc & công suất khả dụng", done: false },
      { key: "photos", label: "Ảnh đại diện cơ sở", done: false },
    ],
  },
  monthlyDemands: [
    { month: "T4", received: 3, connected: 1 },
    { month: "T5", received: 5, connected: 2 },
    { month: "T6", received: 4, connected: 2 },
    { month: "T7", received: 8, connected: 3 },
    { month: "T8", received: 7, connected: 1 },
    { month: "T9", received: 10, connected: 2 },
  ],
  machines: [
    { id: "m1", name: "Máy sấy lạnh", unit: "kg/ngày", maxCapacity: 3000, availableCapacity: 1200, status: "ACTIVE" },
    { id: "m2", name: "Dây chuyền sơ chế rau củ", unit: "kg/ngày", maxCapacity: 5000, availableCapacity: 2500, status: "ACTIVE" },
    { id: "m3", name: "Máy nghiền bột", unit: "kg/ngày", maxCapacity: 2000, availableCapacity: 800, status: "ACTIVE" },
    { id: "m4", name: "Máy đóng gói hút chân không", unit: "kg/ngày", maxCapacity: 2000, availableCapacity: 0, status: "MAINTENANCE" },
  ],
  recentDemands: [
    { id: "d1", requesterName: "Nguyễn Thị Hoa", productName: "Chè Shan tuyết", quantity: 800, unit: "kg", services: ["DRYING", "PACKAGING"], provinceName: "Hà Giang", distanceKm: 18, status: "SENT", createdAt: "2026-09-24T08:30:00Z" },
    { id: "d2", requesterName: "HTX Bưởi Đoan Hùng", productName: "Bưởi", quantity: 2, unit: "tấn", services: ["SORTING", "STORAGE"], provinceName: "Phú Thọ", distanceKm: 42, status: "RESPONDED", createdAt: "2026-09-22T02:10:00Z" },
    { id: "d3", requesterName: "Lò Thị Mai", productName: "Gừng", quantity: 500, unit: "kg", services: ["DRYING", "GRINDING"], provinceName: "Lào Cai", distanceKm: 65, status: "NEGOTIATING", createdAt: "2026-09-20T07:45:00Z" },
    { id: "d4", requesterName: "Trần Thị Lan", productName: "Dứa", quantity: 1.5, unit: "tấn", services: ["PRE_PROCESSING", "PRESSING"], provinceName: "Ninh Bình", distanceKm: null, status: "CONNECTED", createdAt: "2026-09-15T04:00:00Z" },
    { id: "d5", requesterName: "Hoàng Thị Thu", productName: "Cà gai leo", quantity: 300, unit: "kg", services: ["DRYING"], provinceName: "Hòa Bình", distanceKm: 30, status: "COMPLETED", createdAt: "2026-09-08T09:20:00Z" },
  ],
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const dashboardApi = {
  get: async (): Promise<FactoryDashboard> => {
    await delay(500);
    return MOCK_DASHBOARD;
  },
};
