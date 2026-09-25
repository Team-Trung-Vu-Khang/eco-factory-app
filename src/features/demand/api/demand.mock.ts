import type { DemandFormValues } from "../schemas/demand-schema";

type Seed = DemandFormValues & { viewedFactoryCount: number; sentFactoryCount: number; respondedFactoryCount: number };

const base = { technicalRequirements: "", packagingRequirements: "", note: "", materialPhotos: [], requiredCertifications: [], neededTo: "" };

export const SEED_DEMANDS: Seed[] = [
  {
    ...base,
    requester: { fullName: "Hoàng Thị Mai", gender: "FEMALE", organizationName: "HTX Chè Shan tuyết Hoàng Su Phì", phone: "0912345678", provinceCode: "TQ" },
    hasDemand: true, demandTypeId: "dt2", productGroupId: "TEA", productName: "Chè Shan tuyết", materialCondition: "FRESH",
    quantity: 2, quantityUnit: "TON", services: ["DRYING"], requiredCertifications: ["FOOD_SAFETY"],
    technicalRequirements: "Sấy ở nhiệt độ thấp, giữ màu xanh", neededFrom: "2026-10-05", neededTo: "2026-10-20",
    materialLocation: { provinceCode: "TQ", wardCode: "TQ-VX", address: "Thôn Nậm Ngặt, xã Vị Xuyên", latitude: 22.67, longitude: 104.98 },
    searchScope: "NEIGHBOR_PROVINCES", status: "RESPONDED", viewedFactoryCount: 4, sentFactoryCount: 2, respondedFactoryCount: 1,
  },
  {
    ...base,
    requester: { fullName: "Nguyễn Văn Hùng", gender: "MALE", organizationName: "Hộ kinh doanh Hùng Bưởi", phone: "0987654321", provinceCode: "PT" },
    hasDemand: true, demandTypeId: "dt3", productGroupId: "FRUIT", productName: "Bưởi Đoan Hùng", materialCondition: "FRESH",
    quantity: 5, quantityUnit: "TON", services: ["STORAGE"], neededFrom: "2026-11-01",
    materialLocation: { provinceCode: "PT", wardCode: "PT-DH", address: "Xóm Chí Đám, xã Đoan Hùng" },
    searchScope: "SAME_PROVINCE", status: "SEARCHING", viewedFactoryCount: 2, sentFactoryCount: 0, respondedFactoryCount: 0,
  },
  {
    ...base,
    requester: { fullName: "Đinh Thị Lan", gender: "FEMALE", organizationName: "Tổ hợp tác Dứa Tam Điệp", phone: "0356789123", provinceCode: "NB" },
    hasDemand: true, demandTypeId: "dt4", productGroupId: "FRUIT", productName: "Dứa Queen", materialCondition: "FRESH",
    quantity: 800, quantityUnit: "KG", services: ["WASHING", "PRESSING", "PACKAGING"], requiredCertifications: ["HACCP"],
    packagingRequirements: "Chai thủy tinh 330ml", neededFrom: "2026-09-10", neededTo: "2026-09-30",
    materialLocation: { provinceCode: "NB", wardCode: "NB-TD", address: "Đồi Mỹ Hạ, xã Tam Điệp" },
    searchScope: "SAME_PROVINCE", status: "CONNECTED", viewedFactoryCount: 6, sentFactoryCount: 3, respondedFactoryCount: 2,
  },
  {
    ...base,
    requester: { fullName: "Lò Thị Xuân", gender: "FEMALE", organizationName: "Nông hộ Lò Thị Xuân", phone: "0398112233", provinceCode: "LC" },
    hasDemand: true, demandTypeId: "dt1", productGroupId: "SPICE", productName: "Gừng", materialCondition: "FRESH",
    quantity: 3, quantityUnit: "LOT", services: ["PRE_PROCESSING", "WASHING", "SORTING"], neededFrom: "2026-10-15",
    materialLocation: { provinceCode: "LC", wardCode: "LC-SP", address: "Bản Tả Van, phường Sa Pa" },
    searchScope: "NATIONWIDE", status: "DRAFT", viewedFactoryCount: 0, sentFactoryCount: 0, respondedFactoryCount: 0,
  },
  {
    ...base,
    requester: { fullName: "Trần Minh Đức", gender: "MALE", organizationName: "HTX Cà phê Cầu Đất", phone: "0909111222", provinceCode: "LD" },
    hasDemand: true, demandTypeId: "dt4", productGroupId: "COFFEE", productName: "Cà phê Arabica", materialCondition: "DRIED",
    quantity: 10, quantityUnit: "BATCH", services: ["GRINDING", "PACKAGING"], neededFrom: "2026-08-01", neededTo: "2026-08-31",
    materialLocation: { provinceCode: "LD", wardCode: "LD-DL", address: "Thôn Trường Thọ, phường Đà Lạt" },
    searchScope: "SAME_PROVINCE", status: "COMPLETED", viewedFactoryCount: 3, sentFactoryCount: 2, respondedFactoryCount: 2,
  },
];
