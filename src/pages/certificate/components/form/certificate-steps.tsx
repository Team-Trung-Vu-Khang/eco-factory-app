import type { SchemaStep } from "@/components/form";
import type { CertificateFormValues } from "@/features/certificate";
import { DocumentsSection } from "./DocumentsSection";
import { InfoSection } from "./InfoSection";
import { ReviewSection } from "./ReviewSection";
import { ScopeSection } from "./ScopeSection";

export const CERTIFICATE_STEPS: SchemaStep<CertificateFormValues>[] = [
  {
    id: "info",
    title: "Thông tin",
    description: "Loại, số, đơn vị cấp, hiệu lực",
    fields: ["type", "standardName", "number", "issuer", "issuedDate", "expiryDate"],
    content: <InfoSection />,
  },
  {
    id: "scope",
    title: "Phạm vi",
    description: "Sản phẩm được chứng nhận",
    fields: ["productGroupIds", "scopeDescription"],
    content: <ScopeSection />,
  },
  {
    id: "documents",
    title: "Tài liệu",
    description: "Ảnh / PDF chứng nhận",
    fields: ["files", "note"],
    content: <DocumentsSection />,
  },
  {
    id: "review",
    title: "Xác nhận",
    description: "Kiểm tra trước khi lưu",
    fields: [],
    content: <ReviewSection />,
  },
];
