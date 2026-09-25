import type { SchemaStep } from "@/components/form";
import type { DemandFormValues } from "@/features/demand";
import { LocationTimeSection } from "./LocationTimeSection";
import { NeedSection } from "./NeedSection";
import { RequesterSection } from "./RequesterSection";
import { ReviewSection } from "./ReviewSection";

export const getDemandSteps = (mode: "create" | "edit"): SchemaStep<DemandFormValues>[] => [
  {
    id: "requester",
    title: "Người có nhu cầu",
    description: "Thông tin liên hệ",
    fields: ["requester", "hasDemand", "status"],
    content: <RequesterSection showStatus={mode === "edit"} />,
  },
  {
    id: "need",
    title: "Nhu cầu",
    description: "Sản phẩm, dịch vụ",
    fields: ["productGroupId", "productName", "materialCondition", "quantity", "quantityUnit", "demandTypeId", "services", "requiredCertifications", "technicalRequirements", "packagingRequirements"],
    content: <NeedSection />,
  },
  {
    id: "location",
    title: "Thời gian & địa điểm",
    description: "Khi nào, ở đâu",
    fields: ["neededFrom", "neededTo", "searchScope", "materialLocation", "materialPhotos", "note"],
    content: <LocationTimeSection />,
  },
  {
    id: "review",
    title: "Xác nhận",
    description: "Kiểm tra trước khi lưu",
    fields: [],
    content: <ReviewSection />,
  },
];
