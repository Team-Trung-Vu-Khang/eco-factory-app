const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));

export type WarehouseType = "DRY" | "COOL" | "COLD" | "FROZEN" | "SILO";

export const WAREHOUSE_TYPE_LABELS: Record<WarehouseType, string> = {
  DRY: "Kho thường",
  COOL: "Kho mát",
  COLD: "Kho lạnh",
  FROZEN: "Kho đông lạnh",
  SILO: "Silo",
};

/** Types that need a temperature range */
export const TEMPERATURE_CONTROLLED: WarehouseType[] = ["COOL", "COLD", "FROZEN"];

export type StorageUnit = "TON" | "KG" | "M3" | "PALLET";

export const STORAGE_UNIT_LABELS: Record<StorageUnit, string> = {
  TON: "tấn",
  KG: "kg",
  M3: "m³",
  PALLET: "pallet",
};

export type WarehouseStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

export const WAREHOUSE_STATUS_LABELS: Record<WarehouseStatus, string> = {
  ACTIVE: "Đang hoạt động",
  MAINTENANCE: "Bảo trì",
  INACTIVE: "Ngừng hoạt động",
};

export const WAREHOUSE_TYPE_OPTIONS = toOptions(WAREHOUSE_TYPE_LABELS);
export const STORAGE_UNIT_OPTIONS = toOptions(STORAGE_UNIT_LABELS);
export const WAREHOUSE_STATUS_OPTIONS = toOptions(WAREHOUSE_STATUS_LABELS);
