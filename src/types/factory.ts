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
