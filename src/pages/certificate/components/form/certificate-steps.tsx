import type { SchemaStep } from "@/components/form";
import type { CertificateFormValues } from "@/features/certificate";
import { InfoSection } from "./InfoSection";
import { ReviewSection } from "./ReviewSection";
import { ScopeSection } from "./ScopeSection";

export const CERTIFICATE_STEPS: SchemaStep<CertificateFormValues>[] = [
  {
    id: "info",
    title: "Thông tin",
    description: "Ảnh, loại, số, đơn vị cấp, hiệu lực",
    fields: [
      "imageUrl",
      "certificateType",
      "certificateNumber",
      "issuer",
      "issuedDate",
      "expiryDate",
    ],
    content: <InfoSection />,
  },
  {
    id: "scope",
    title: "Phạm vi",
    description: "Mô tả phạm vi áp dụng",
    fields: ["scopeDescription"],
    content: <ScopeSection />,
  },
  {
    id: "review",
    title: "Xác nhận",
    description: "Kiểm tra trước khi lưu",
    fields: [],
    content: <ReviewSection />,
  },
];
