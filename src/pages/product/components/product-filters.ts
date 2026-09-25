import { PRODUCT_GROUP_OPTIONS } from "@/features/factory";
import { PRODUCT_STATUS_OPTIONS } from "@/features/product";

export const productFilters = [
  { key: "productGroupId", label: "Nhóm nông sản", options: PRODUCT_GROUP_OPTIONS },
  { key: "status", label: "Trạng thái", options: PRODUCT_STATUS_OPTIONS },
  {
    key: "isNewlyDeveloped",
    label: "Sản phẩm mới",
    options: [
      { value: "true", label: "Mới phát triển" },
      { value: "false", label: "Sản phẩm hiện có" },
    ],
  },
];
