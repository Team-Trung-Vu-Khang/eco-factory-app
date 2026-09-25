import { DEMAND_STATUS_OPTIONS } from "@/features/demand";
import { PRODUCT_GROUP_OPTIONS, PROVINCES } from "@/features/factory";

export const demandFilters = [
  { key: "status", label: "Trạng thái", options: DEMAND_STATUS_OPTIONS },
  { key: "productGroupId", label: "Nhóm nông sản", options: PRODUCT_GROUP_OPTIONS },
  { key: "provinceCode", label: "Tỉnh nguyên liệu", options: PROVINCES.map((p) => ({ value: p.code, label: p.name })) },
];
