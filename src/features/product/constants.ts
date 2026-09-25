const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.entries(labels) as [T, string][]).map(([value, label]) => ({ value, label }));

export type ProductStatus = "ACTIVE" | "PAUSED" | "DISCONTINUED";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "Đang sản xuất",
  PAUSED: "Tạm ngừng",
  DISCONTINUED: "Ngừng sản xuất",
};

export type WeightUnit = "G" | "KG" | "ML" | "L";

export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = { G: "g", KG: "kg", ML: "ml", L: "lít" };

export type ShelfLifeUnit = "DAY" | "MONTH" | "YEAR";

export const SHELF_LIFE_UNIT_LABELS: Record<ShelfLifeUnit, string> = { DAY: "ngày", MONTH: "tháng", YEAR: "năm" };

export type OutputUnit = "KG_PER_MONTH" | "TON_PER_MONTH" | "UNIT_PER_MONTH";

export const OUTPUT_UNIT_LABELS: Record<OutputUnit, string> = {
  KG_PER_MONTH: "kg/tháng",
  TON_PER_MONTH: "tấn/tháng",
  UNIT_PER_MONTH: "sản phẩm/tháng",
};

/** Logframe KQ2: "20 sản phẩm nông nghiệp được phát triển" */
export const NEW_PRODUCT_TARGET = 20;

export const PRODUCT_STATUS_OPTIONS = toOptions(PRODUCT_STATUS_LABELS);
export const WEIGHT_UNIT_OPTIONS = toOptions(WEIGHT_UNIT_LABELS);
export const SHELF_LIFE_UNIT_OPTIONS = toOptions(SHELF_LIFE_UNIT_LABELS);
export const OUTPUT_UNIT_OPTIONS = toOptions(OUTPUT_UNIT_LABELS);
