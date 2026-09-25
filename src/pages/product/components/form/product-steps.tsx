import type { SchemaStep } from "@/components/form";
import type { ProductFormValues } from "@/features/product";
import { InfoSection } from "./InfoSection";
import { ProcessingSection } from "./ProcessingSection";
import { ProductionSection } from "./ProductionSection";
import { ReviewSection } from "./ReviewSection";

export const getProductSteps = (mode: "create" | "edit"): SchemaStep<ProductFormValues>[] => [
  {
    id: "info",
    title: "Thông tin",
    description: "Tên, nhóm, hình ảnh",
    fields: ["images", "name", "sku", "productGroupId", "status", "description"],
    content: <InfoSection showStatus={mode === "edit"} />,
  },
  {
    id: "processing",
    title: "Chế biến & đóng gói",
    description: "Nguyên liệu, quy cách, bảo quản",
    fields: ["rawMaterials", "processingServices", "packagings", "shelfLifeValue", "shelfLifeUnit", "storageConditions"],
    content: <ProcessingSection />,
  },
  {
    id: "production",
    title: "Sản xuất",
    description: "Sản lượng, chứng nhận",
    fields: ["outputCapacity", "outputUnit", "certificateIds", "isNewlyDeveloped", "launchedAt"],
    content: <ProductionSection />,
  },
  {
    id: "review",
    title: "Xác nhận",
    description: "Kiểm tra trước khi lưu",
    fields: [],
    content: <ReviewSection />,
  },
];
