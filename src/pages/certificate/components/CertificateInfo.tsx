import { ImagePreview } from "@/components/common/ImagePreview";
import dayjs from "dayjs";
import { InfoGrid } from "@/components/common/InfoGrid";
import { FormSection } from "@/components/form";
import {
  getCertificateValidity,
  type CertificateFormValues,
} from "@/features/certificate";
import { ValidityBadge } from "./ValidityBadge";

const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : undefined);

/** Read-only view, shared by the review step and the detail page */
export function CertificateInfo({
  values: c,
}: {
  values: CertificateFormValues;
}) {
  const { validity, daysToExpiry } = getCertificateValidity(c.expiryDate);

  return (
    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
      <FormSection title="Thông tin chứng nhận">
        <InfoGrid
          items={[
            { label: "Loại chứng nhận", value: c.certificateType },
            { label: "Số chứng nhận", value: c.certificateNumber || "—" },
            { label: "Đơn vị cấp", value: c.issuer || "—" },
            { label: "Ngày cấp", value: date(c.issuedDate) || "—" },
            {
              label: "Ngày hết hạn",
              value: date(c.expiryDate) ?? "Không thời hạn",
            },
            {
              label: "Tình trạng",
              value: c.issuedDate ? (
                <ValidityBadge
                  validity={validity}
                  daysToExpiry={daysToExpiry}
                />
              ) : undefined,
            },
          ]}
        />
      </FormSection>

      <div className="space-y-8">
        <FormSection title="Phạm vi áp dụng">
          <InfoGrid
            items={[
              {
                label: "Mô tả phạm vi",
                value: c.scopeDescription || "Chưa có mô tả",
                wide: true,
              },
            ]}
          />
        </FormSection>

        <FormSection title="Ảnh chứng nhận">
          {c.imageUrl ? (
            <ImagePreview src={c.imageUrl} alt={c.certificateType}>
              <img
                src={c.imageUrl}
                alt={c.certificateType}
                className="max-h-64 rounded-lg border border-slate-200 object-contain"
              />
            </ImagePreview>
          ) : (
            <p className="text-sm text-slate-500">Chưa có ảnh</p>
          )}
        </FormSection>
      </div>
    </div>
  );
}
