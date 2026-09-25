import dayjs from "dayjs";
import { InfoGrid } from "@/components/common/InfoGrid";
import { FormSection, ImageDropzone } from "@/components/form";
import { getCertificateValidity, type CertificateFormValues } from "@/features/certificate";
import {
  CERTIFICATION_ISSUER_LABELS,
  CERTIFICATION_TYPE_LABELS,
  PRODUCT_GROUP_LABELS,
  type CertificationType,
} from "@/features/factory";
import { ValidityBadge } from "./ValidityBadge";

const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : undefined);

/** Read-only view, shared by the review step and the detail page */
export function CertificateInfo({ values: c }: { values: CertificateFormValues }) {
  const { validity, daysToExpiry } = getCertificateValidity(c.expiryDate);

  return (
    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
      <FormSection title="Thông tin chứng nhận">
        <InfoGrid
          items={[
            { label: "Loại", value: CERTIFICATION_TYPE_LABELS[c.type as CertificationType] },
            { label: "Tên / tiêu chuẩn", value: c.standardName },
            { label: "Số chứng nhận", value: c.number },
            { label: "Đơn vị cấp", value: c.issuer ? (CERTIFICATION_ISSUER_LABELS[c.issuer] ?? c.issuer) : undefined },
            { label: "Ngày cấp", value: date(c.issuedDate) },
            { label: "Ngày hết hạn", value: date(c.expiryDate) ?? "Không thời hạn" },
            { label: "Tình trạng", value: c.issuedDate ? <ValidityBadge validity={validity} daysToExpiry={daysToExpiry} /> : undefined },
          ]}
        />
      </FormSection>

      <FormSection title="Phạm vi áp dụng">
        <InfoGrid
          items={[
            { label: "Nhóm sản phẩm", value: c.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id).join(", "), wide: true },
            { label: "Mô tả phạm vi", value: c.scopeDescription, wide: true },
            { label: "Ghi chú", value: c.note, wide: true },
          ]}
        />
      </FormSection>

      <FormSection title="Tài liệu chứng nhận" className="lg:col-span-2">
        <ImageDropzone value={c.files} onChange={() => {}} disabled allowPdf />
      </FormSection>
    </div>
  );
}
