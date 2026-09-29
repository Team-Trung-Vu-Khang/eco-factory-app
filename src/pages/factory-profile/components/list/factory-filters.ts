export const FACTORY_REVIEW_STATUS_OPTIONS = [
  { value: "PENDING_REVIEW", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
];

export const PROGRAM_300_OPTIONS = [
  { value: "true", label: "Đủ điều kiện" },
  { value: "false", label: "Chưa đủ" },
];

export const CERTIFICATE_STATUS_FILTER_OPTIONS = [
  { value: "ACTIVE", label: "Còn hạn" },
  { value: "EXPIRING_SOON", label: "Sắp hết hạn" },
  { value: "EXPIRED", label: "Đã hết hạn" },
];

export const factoryFilters = [
  {
    key: "reviewStatus",
    label: "Trạng thái duyệt",
    options: FACTORY_REVIEW_STATUS_OPTIONS,
  },
  {
    key: "program300Eligible",
    label: "Chỉ số 300 cơ sở",
    options: PROGRAM_300_OPTIONS,
  },
  {
    key: "certificateStatus",
    label: "Trạng thái chứng nhận",
    options: CERTIFICATE_STATUS_FILTER_OPTIONS,
  },
];
