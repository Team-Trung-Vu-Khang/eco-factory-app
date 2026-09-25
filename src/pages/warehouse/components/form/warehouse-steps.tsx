import type { SchemaStep } from "@/components/form";
import type { WarehouseFormValues } from "@/features/warehouse";
import { CapacitySection } from "./CapacitySection";
import { GeneralSection } from "./GeneralSection";
import { OperationSection } from "./OperationSection";
import { ReviewSection } from "./ReviewSection";

export const getWarehouseSteps = (mode: "create" | "edit"): SchemaStep<WarehouseFormValues>[] => [
  {
    id: "general",
    title: "Thông tin chung",
    description: "Tên, loại, vị trí",
    fields: ["name", "code", "type", "status", "address", "latitude", "longitude"],
    content: <GeneralSection showStatus={mode === "edit"} />,
  },
  {
    id: "capacity",
    title: "Sức chứa & điều kiện",
    description: "Sức chứa, nhiệt độ, độ ẩm",
    fields: ["capacity", "usedCapacity", "capacityUnit", "temperatureMin", "temperatureMax", "humidityMin", "humidityMax"],
    content: <CapacitySection />,
  },
  {
    id: "operation",
    title: "Vận hành",
    description: "Nông sản, phụ trách",
    fields: ["productGroupIds", "managerId", "managerName", "managerPhone", "acceptsExternalStorage", "note"],
    content: <OperationSection />,
  },
  {
    id: "review",
    title: "Xác nhận",
    description: "Kiểm tra trước khi lưu",
    fields: [],
    content: <ReviewSection />,
  },
];
