import { WAREHOUSE_STATUS_OPTIONS, WAREHOUSE_TYPE_OPTIONS } from "@/features/warehouse";

export const warehouseFilters = [
  { key: "type", label: "Loại kho", options: WAREHOUSE_TYPE_OPTIONS },
  { key: "status", label: "Trạng thái", options: WAREHOUSE_STATUS_OPTIONS },
];
