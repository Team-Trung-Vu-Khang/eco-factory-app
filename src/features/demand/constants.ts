const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));

export type MaterialCondition = "FRESH" | "DRIED" | "SEMI_FINISHED" | "OTHER";

export const MATERIAL_CONDITION_LABELS: Record<MaterialCondition, string> = {
  FRESH: "Tươi",
  DRIED: "Khô",
  SEMI_FINISHED: "Bán thành phẩm",
  OTHER: "Khác",
};

export type QuantityUnit = "KG" | "TON" | "LOT" | "BATCH" | "OTHER";

export const QUANTITY_UNIT_LABELS: Record<QuantityUnit, string> = {
  KG: "kg",
  TON: "tấn",
  LOT: "lô",
  BATCH: "mẻ",
  OTHER: "khác",
};

export type SearchScope = "SAME_PROVINCE" | "NEIGHBOR_PROVINCES" | "NATIONWIDE" | "OTHER";

export const SEARCH_SCOPE_LABELS: Record<SearchScope, string> = {
  SAME_PROVINCE: "Cùng tỉnh",
  NEIGHBOR_PROVINCES: "Tỉnh lân cận",
  NATIONWIDE: "Toàn quốc",
  OTHER: "Khác",
};

/** Funnel order matters: DRAFT → … → COMPLETED; CANCELLED is reachable from any open state */
export type DemandStatus =
  | "DRAFT"
  | "SEARCHING"
  | "SENT"
  | "RESPONDED"
  | "NEGOTIATING"
  | "CONNECTED"
  | "COMPLETED"
  | "CANCELLED";

export const DEMAND_STATUS_LABELS: Record<DemandStatus, string> = {
  DRAFT: "Mới tạo",
  SEARCHING: "Đang tìm cơ sở",
  SENT: "Đã gửi nhu cầu",
  RESPONDED: "Đã có phản hồi",
  NEGOTIATING: "Đang trao đổi",
  CONNECTED: "Đã kết nối",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Hủy",
};

export const DEMAND_FUNNEL: DemandStatus[] = ["DRAFT", "SEARCHING", "SENT", "RESPONDED", "NEGOTIATING", "CONNECTED", "COMPLETED"];

/** Logframe KQ2: "50 nữ chủ DN tiếp cận được cơ sở chế biến" */
export const FEMALE_REACH_TARGET = 50;

export const MATERIAL_CONDITION_OPTIONS = toOptions(MATERIAL_CONDITION_LABELS);
export const QUANTITY_UNIT_OPTIONS = toOptions(QUANTITY_UNIT_LABELS);
export const SEARCH_SCOPE_OPTIONS = toOptions(SEARCH_SCOPE_LABELS);
export const DEMAND_STATUS_OPTIONS = toOptions(DEMAND_STATUS_LABELS);
