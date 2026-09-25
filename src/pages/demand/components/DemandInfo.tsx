import dayjs from "dayjs";
import { InfoGrid } from "@/components/common/InfoGrid";
import { FormSection, ImageDropzone } from "@/components/form";
import {
  DEMAND_STATUS_LABELS,
  MATERIAL_CONDITION_LABELS,
  QUANTITY_UNIT_LABELS,
  SEARCH_SCOPE_LABELS,
  type DemandFormValues,
  type DemandStatus,
  type MaterialCondition,
  type QuantityUnit,
  type SearchScope,
} from "@/features/demand";
import {
  CERTIFICATION_TYPE_LABELS,
  GENDER_LABELS,
  PROCESSING_SERVICE_LABELS,
  PRODUCT_GROUP_LABELS,
  getProvinceName,
  getWardName,
  type CertificationType,
  type Gender,
  type ProcessingService,
} from "@/features/factory";
import { useDemandTypeOptions } from "../hooks/useDemandTypeOptions";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (v?: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "");

/** Read-only view, shared by the review step and the detail page */
export function DemandInfo({ values: d }: { values: DemandFormValues }) {
  const { options: typeOptions } = useDemandTypeOptions();
  const r = d.requester;
  const loc = d.materialLocation;

  return (
    <div className="space-y-8">
      <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
        <FormSection title="Người có nhu cầu">
          <InfoGrid
            items={[
              { label: "Họ và tên", value: r.fullName },
              { label: "Giới tính", value: GENDER_LABELS[r.gender as Gender] },
              { label: "Đơn vị / nông hộ / HTX", value: r.organizationName },
              { label: "Số điện thoại", value: r.phone },
              { label: "Tỉnh / Thành phố", value: r.provinceCode && getProvinceName(r.provinceCode) },
              { label: "Trạng thái", value: DEMAND_STATUS_LABELS[d.status as DemandStatus] },
            ]}
          />
        </FormSection>

        <FormSection title="Sản phẩm">
          <InfoGrid
            items={[
              { label: "Tên sản phẩm", value: d.productName },
              { label: "Nhóm nông sản", value: PRODUCT_GROUP_LABELS[d.productGroupId] },
              { label: "Tình trạng nguyên liệu", value: MATERIAL_CONDITION_LABELS[d.materialCondition as MaterialCondition] },
              {
                label: "Khối lượng",
                value: Number.isFinite(d.quantity) ? `${fmt.format(d.quantity)} ${QUANTITY_UNIT_LABELS[d.quantityUnit as QuantityUnit] ?? ""}` : undefined,
              },
            ]}
          />
        </FormSection>

        <FormSection title="Loại nhu cầu">
          <InfoGrid
            items={[
              { label: "Loại nhu cầu", value: typeOptions.find((o) => o.value === d.demandTypeId)?.label },
              { label: "Chứng nhận yêu cầu", value: d.requiredCertifications.map((c) => CERTIFICATION_TYPE_LABELS[c as CertificationType]).join(", ") },
              { label: "Dịch vụ cần thực hiện", value: d.services.map((s) => PROCESSING_SERVICE_LABELS[s as ProcessingService]).join(", "), wide: true },
              { label: "Yêu cầu kỹ thuật", value: d.technicalRequirements, wide: true },
              { label: "Yêu cầu đóng gói", value: d.packagingRequirements, wide: true },
            ]}
          />
        </FormSection>

        <FormSection title="Thời gian & địa điểm">
          <InfoGrid
            items={[
              { label: "Thời gian cần chế biến", value: [date(d.neededFrom), date(d.neededTo)].filter(Boolean).join(" – ") },
              { label: "Phạm vi tìm cơ sở", value: SEARCH_SCOPE_LABELS[d.searchScope as SearchScope] },
              {
                label: "Địa điểm nguyên liệu",
                value: [loc.address, loc.wardCode && getWardName(loc.provinceCode, loc.wardCode), loc.provinceCode && getProvinceName(loc.provinceCode)]
                  .filter(Boolean)
                  .join(", "),
                wide: true,
              },
              { label: "Ghi chú", value: d.note, wide: true },
            ]}
          />
        </FormSection>
      </div>

      {d.materialPhotos.length > 0 && (
        <FormSection title="Ảnh nguyên liệu / sản phẩm">
          <ImageDropzone value={d.materialPhotos} onChange={() => {}} disabled />
        </FormSection>
      )}
    </div>
  );
}
