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

/** Id of a service in the shared processing-service catalog */
export type ProcessingService = string;

export const PROCESSING_SERVICE_LABELS: Record<string, string> = {
  // Seed for the processing-service catalog
  PRE_PROCESSING: "Sơ chế",
  WASHING: "Rửa",
  SORTING: "Phân loại",
  DRYING: "Sấy",
  GRINDING: "Nghiền",
  PRESSING: "Ép",
  FERMENTING: "Lên men",
  STORAGE: "Bảo quản",
  PACKAGING: "Đóng gói",
  PEELING: "Bóc vỏ, tách hạt",
  FREEZING: "Cấp đông",
  ROASTING: "Rang",
  EXTRACTING: "Chiết xuất, chưng cất",
  BOTTLING: "Chiết rót",
  LABELING: "Dán nhãn, truy xuất nguồn gốc",
  OTHER: "Khác",
};

export type CapacityUnit =
  | "KG_PER_HOUR"
  | "LIT_PER_HOUR"
  | "KG_PER_DAY"
  | "LIT_PER_DAY"
  | "TON_PER_DAY"
  | "KG_PER_MONTH"
  | "TON_PER_MONTH";

export const CAPACITY_UNIT_LABELS: Record<CapacityUnit, string> = {
  KG_PER_HOUR: "kg/giờ",
  LIT_PER_HOUR: "lit/giờ",
  KG_PER_DAY: "kg/ngày",
  LIT_PER_DAY: "lit/ngày",
  TON_PER_DAY: "tấn/ngày",
  KG_PER_MONTH: "kg/tháng",
  TON_PER_MONTH: "tấn/tháng",
};

export type MachineStatus = "ACTIVE" | "MAINTENANCE" | "PAUSED";

export const MACHINE_STATUS_LABELS: Record<MachineStatus, string> = {
  ACTIVE: "Đang hoạt động",
  MAINTENANCE: "Bảo trì",
  PAUSED: "Tạm dừng",
};

export type CertificationType =
  | "FOOD_SAFETY"
  | "HACCP"
  | "ISO"
  | "GMP"
  | "OTHER";

export const CERTIFICATION_TYPE_LABELS: Record<CertificationType, string> = {
  FOOD_SAFETY: "ATTP",
  HACCP: "HACCP",
  ISO: "ISO",
  GMP: "GMP",
  OTHER: "Khác",
};

/** Full certificate names — shown in pickers next to the short code */
export const CERTIFICATION_TYPE_NAMES: Record<CertificationType, string> = {
  FOOD_SAFETY: "Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm",
  HACCP: "Hệ thống phân tích mối nguy và điểm kiểm soát tới hạn",
  ISO: "Tiêu chuẩn quản lý chất lượng quốc tế (ISO 9001 / ISO 22000)",
  GMP: "Thực hành sản xuất tốt",
  OTHER: "Chứng nhận khác",
};

// TODO: load from master-data API (shared with MEVI Farms)
export const PRODUCT_GROUP_LABELS: Record<string, string> = {
  TEA: "Cây chè",
  VEGETABLE: "Rau màu",
  FRUIT: "Cây ăn quả",
  HERB: "Cây dược liệu",
  GRAIN: "Cây lương thực",
  COFFEE: "Cây công nghiệp",
  SPICE: "Cây gia vị",
};

// TODO: load from administrative-unit API (2 levels: province → ward)
export const PROVINCES: {
  code: string;
  name: string;
  wards: { code: string; name: string }[];
}[] = [
  {
    code: "HN",
    name: "Hà Nội",
    wards: [
      { code: "HN-BD", name: "Phường Ba Đình" },
      { code: "HN-HK", name: "Phường Hoàn Kiếm" },
      { code: "HN-CN", name: "Phường Cửa Nam" },
      { code: "HN-SS", name: "Xã Sóc Sơn" },
    ],
  },
  {
    code: "TQ",
    name: "Tuyên Quang",
    wards: [
      { code: "TQ-HG", name: "Phường Hà Giang 1" },
      { code: "TQ-VX", name: "Xã Vị Xuyên" },
      { code: "TQ-CB", name: "Xã Cao Bồ" },
      { code: "TQ-ML", name: "Phường Mỹ Lâm" },
      { code: "TQ-MB", name: "Xã Mỹ Bằng" },
    ],
  },
  {
    code: "PT",
    name: "Phú Thọ",
    wards: [
      { code: "PT-VT", name: "Phường Việt Trì" },
      { code: "PT-DH", name: "Xã Đoan Hùng" },
      { code: "PT-HB", name: "Phường Hòa Bình" },
      { code: "PT-TB", name: "Xã Thanh Ba" },
    ],
  },
  {
    code: "LC",
    name: "Lào Cai",
    wards: [
      { code: "LC-LC", name: "Phường Lào Cai" },
      { code: "LC-SP", name: "Phường Sa Pa" },
      { code: "LC-YB", name: "Phường Yên Bái" },
    ],
  },
  {
    code: "SL",
    name: "Sơn La",
    wards: [
      { code: "SL-MC", name: "Phường Mộc Châu" },
      { code: "SL-TL", name: "Xã Tân Lập" },
    ],
  },
  {
    code: "NB",
    name: "Ninh Bình",
    wards: [
      { code: "NB-HL", name: "Phường Hoa Lư" },
      { code: "NB-TD", name: "Phường Tam Điệp" },
    ],
  },
  {
    code: "NA",
    name: "Nghệ An",
    wards: [
      { code: "NA-VH", name: "Phường Vinh Hưng" },
      { code: "NA-QC", name: "Xã Quỳnh Châu" },
    ],
  },
  {
    code: "DLK",
    name: "Đắk Lắk",
    wards: [
      { code: "DLK-BMT", name: "Phường Buôn Ma Thuột" },
      { code: "DLK-TA", name: "Phường Tân An" },
    ],
  },
  {
    code: "LD",
    name: "Lâm Đồng",
    wards: [
      { code: "LD-DL", name: "Phường Đà Lạt" },
      { code: "LD-LV", name: "Phường Lâm Viên - Đà Lạt" },
      { code: "LD-BL", name: "Phường Bảo Lộc" },
      { code: "LD-LT", name: "Xã Lộc Tân" },
      { code: "LD-PH", name: "Xã Phú Hội" },
    ],
  },
  {
    code: "AG",
    name: "An Giang",
    wards: [
      { code: "AG-LX", name: "Phường Long Xuyên" },
      { code: "AG-CP", name: "Xã Châu Phú" },
    ],
  },
  {
    code: "CT",
    name: "Cần Thơ",
    wards: [
      { code: "CT-TK", name: "Phường Trung Kiên" },
      { code: "CT-TN", name: "Phường Thốt Nốt" },
    ],
  },
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
  PROVINCES.find((p) => p.code === provinceCode)?.wards.find(
    (w) => w.code === wardCode,
  )?.name ?? wardCode;

export const ORGANIZATION_TYPE_OPTIONS = toOptions(ORGANIZATION_TYPE_LABELS);
export const GENDER_OPTIONS = toOptions(GENDER_LABELS);
export const PROCESSING_SERVICE_OPTIONS = toOptions(PROCESSING_SERVICE_LABELS);
/** Selectable units — other labels kept only to display existing data */
export const CAPACITY_UNIT_OPTIONS = toOptions({
  // KG_PER_HOUR: CAPACITY_UNIT_LABELS.KG_PER_HOUR,
  // LIT_PER_HOUR: CAPACITY_UNIT_LABELS.LIT_PER_HOUR,
  // KG_PER_DAY: CAPACITY_UNIT_LABELS.KG_PER_DAY,
  // LIT_PER_DAY: CAPACITY_UNIT_LABELS.LIT_PER_DAY,
  // TON_PER_DAY: CAPACITY_UNIT_LABELS.TON_PER_DAY,
  KG_PER_MONTH: CAPACITY_UNIT_LABELS.KG_PER_MONTH,
  TON_PER_MONTH: CAPACITY_UNIT_LABELS.TON_PER_MONTH,
});
export const MACHINE_STATUS_OPTIONS = toOptions(MACHINE_STATUS_LABELS);
export const CERTIFICATION_TYPE_OPTIONS = toOptions(CERTIFICATION_TYPE_LABELS);
export const CERTIFICATION_TYPE_NAMED_OPTIONS = (
  Object.keys(CERTIFICATION_TYPE_LABELS) as CertificationType[]
).map((value) => ({
  value,
  label:
    value === "OTHER"
      ? CERTIFICATION_TYPE_LABELS[value]
      : `${CERTIFICATION_TYPE_LABELS[value]} — ${CERTIFICATION_TYPE_NAMES[value]}`,
}));
export const PRODUCT_GROUP_OPTIONS = toOptions(PRODUCT_GROUP_LABELS);
export const CERTIFICATION_ISSUER_OPTIONS = toOptions(
  CERTIFICATION_ISSUER_LABELS,
);

/** Profile review: factory-member edits wait for admin approval */
export type FactoryApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export const FACTORY_APPROVAL_STATUS_LABELS: Record<FactoryApprovalStatus, string> = {
  PENDING: "Đang chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
};

export const FACTORY_APPROVAL_STATUS_OPTIONS = (Object.entries(FACTORY_APPROVAL_STATUS_LABELS) as [FactoryApprovalStatus, string][]).map(
  ([value, label]) => ({ value, label }),
);
