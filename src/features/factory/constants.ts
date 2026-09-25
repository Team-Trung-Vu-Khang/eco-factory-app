// Enums & labels from docs/factory-and-demand-spec.md (section 2)

const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({
    value,
    label,
  }));

export type OrganizationType =
  | "HOUSEHOLD_BUSINESS"
  | "COOPERATIVE_GROUP"
  | "COOPERATIVE"
  | "ENTERPRISE"
  | "RESEARCH_INSTITUTE"
  | "UNIVERSITY"
  | "RESEARCH_CENTER";

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  HOUSEHOLD_BUSINESS: "Hộ kinh doanh",
  COOPERATIVE_GROUP: "Tổ hợp tác",
  COOPERATIVE: "Hợp tác xã",
  ENTERPRISE: "Doanh nghiệp",
  RESEARCH_INSTITUTE: "Viện nghiên cứu",
  UNIVERSITY: "Trường Đại học - Cao đẳng",
  RESEARCH_CENTER: "Trung tâm nghiên cứu - ứng dụng",
};

export type Gender = "FEMALE" | "MALE" | "OTHER";

export const GENDER_LABELS: Record<Gender, string> = {
  FEMALE: "Nữ",
  MALE: "Nam",
  OTHER: "Khác",
};

export type ProcessingService =
  | "PRE_PROCESSING"
  | "WASHING"
  | "SORTING"
  | "DRYING"
  | "GRINDING"
  | "PRESSING"
  | "FERMENTING"
  | "STORAGE"
  | "PACKAGING"
  | "OTHER";

export const PROCESSING_SERVICE_LABELS: Record<ProcessingService, string> = {
  PRE_PROCESSING: "Sơ chế",
  WASHING: "Rửa",
  SORTING: "Phân loại",
  DRYING: "Sấy",
  GRINDING: "Nghiền",
  PRESSING: "Ép",
  FERMENTING: "Lên men",
  STORAGE: "Bảo quản",
  PACKAGING: "Đóng gói",
  OTHER: "Khác",
};

export type CapacityUnit =
  | "KG_PER_HOUR"
  | "KG_PER_DAY"
  | "TON_PER_DAY"
  | "BATCH_PER_DAY"
  | "OTHER";

export const CAPACITY_UNIT_LABELS: Record<CapacityUnit, string> = {
  KG_PER_HOUR: "kg/giờ",
  KG_PER_DAY: "kg/ngày",
  TON_PER_DAY: "tấn/ngày",
  BATCH_PER_DAY: "mẻ/ngày",
  OTHER: "Khác",
};

export type MachineStatus = "ACTIVE" | "MAINTENANCE" | "PAUSED";

export const MACHINE_STATUS_LABELS: Record<MachineStatus, string> = {
  ACTIVE: "Đang hoạt động",
  MAINTENANCE: "Bảo trì",
  PAUSED: "Tạm dừng",
};

export type CertificationType = "FOOD_SAFETY" | "HACCP" | "ISO" | "GMP" | "OTHER";

export const CERTIFICATION_TYPE_LABELS: Record<CertificationType, string> = {
  FOOD_SAFETY: "ATTP",
  HACCP: "HACCP",
  ISO: "ISO",
  GMP: "GMP",
  OTHER: "Khác",
};

// TODO: load from master-data API (shared with MEVI Farms)
export const PRODUCT_GROUP_LABELS: Record<string, string> = {
  TEA: "Chè",
  VEGETABLE: "Rau củ",
  FRUIT: "Trái cây",
  HERB: "Dược liệu",
  GRAIN: "Ngũ cốc",
  COFFEE: "Cà phê",
  SPICE: "Gia vị",
};

// TODO: load from administrative-unit API (2 levels: province → ward)
export const PROVINCES: { code: string; name: string; wards: { code: string; name: string }[] }[] = [
  { code: "HN", name: "Hà Nội", wards: [{ code: "HN-BD", name: "Phường Ba Đình" }, { code: "HN-HK", name: "Phường Hoàn Kiếm" }, { code: "HN-CN", name: "Phường Cửa Nam" }, { code: "HN-SS", name: "Xã Sóc Sơn" }] },
  { code: "TQ", name: "Tuyên Quang", wards: [{ code: "TQ-HG", name: "Phường Hà Giang 1" }, { code: "TQ-VX", name: "Xã Vị Xuyên" }] },
  { code: "PT", name: "Phú Thọ", wards: [{ code: "PT-VT", name: "Phường Việt Trì" }, { code: "PT-DH", name: "Xã Đoan Hùng" }, { code: "PT-HB", name: "Phường Hòa Bình" }] },
  { code: "LC", name: "Lào Cai", wards: [{ code: "LC-LC", name: "Phường Lào Cai" }, { code: "LC-SP", name: "Phường Sa Pa" }] },
  { code: "NB", name: "Ninh Bình", wards: [{ code: "NB-HL", name: "Phường Hoa Lư" }, { code: "NB-TD", name: "Xã Tam Điệp" }] },
  { code: "LD", name: "Lâm Đồng", wards: [{ code: "LD-DL", name: "Phường Đà Lạt" }, { code: "LD-BL", name: "Phường Bảo Lộc" }] },
];

// TODO: load from master-data API
export const CERTIFICATION_ISSUER_LABELS: Record<string, string> = {
  VFA: "Cục An toàn thực phẩm (Bộ Y tế)",
  DOH: "Sở Y tế",
  DARD: "Sở Nông nghiệp và Môi trường",
  NAFIQAD: "Cục Quản lý chất lượng Nông lâm sản và Thủy sản",
  QUACERT: "Trung tâm Chứng nhận Phù hợp (QUACERT)",
  VINACERT: "Công ty CP Chứng nhận và Giám định VinaCert",
  BV: "Bureau Veritas Việt Nam",
  SGS: "SGS Việt Nam",
  TUV: "TÜV Rheinland Việt Nam",
  CU: "Control Union Việt Nam",
  OTHER: "Khác",
};

export const getProvinceName = (code: string) =>
  PROVINCES.find((p) => p.code === code)?.name ?? code;

export const getWardName = (provinceCode: string, wardCode: string) =>
  PROVINCES.find((p) => p.code === provinceCode)?.wards.find((w) => w.code === wardCode)
    ?.name ?? wardCode;

export const ORGANIZATION_TYPE_OPTIONS = toOptions(ORGANIZATION_TYPE_LABELS);
export const GENDER_OPTIONS = toOptions(GENDER_LABELS);
export const PROCESSING_SERVICE_OPTIONS = toOptions(PROCESSING_SERVICE_LABELS);
export const CAPACITY_UNIT_OPTIONS = toOptions(CAPACITY_UNIT_LABELS);
export const MACHINE_STATUS_OPTIONS = toOptions(MACHINE_STATUS_LABELS);
export const CERTIFICATION_TYPE_OPTIONS = toOptions(CERTIFICATION_TYPE_LABELS);
export const PRODUCT_GROUP_OPTIONS = toOptions(PRODUCT_GROUP_LABELS);
export const CERTIFICATION_ISSUER_OPTIONS = toOptions(CERTIFICATION_ISSUER_LABELS);
