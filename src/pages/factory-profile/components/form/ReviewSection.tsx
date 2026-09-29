import { useWatch } from "react-hook-form";
import { InfoGrid } from "@/components/common/InfoGrid";
import { FormSection } from "@/components/form";
import {
  GENDER_LABELS,
  type FactoryProfileFormValues,
} from "@/features/factory";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function ReviewSection() {
  const { control } = useFactoryFormContext();
  const values = useWatch({ control }) as FactoryProfileFormValues;

  const images = values.images ?? [];
  const certs = values.hasCertificates ? (values.certificates ?? []) : [];

  return (
    <div className="space-y-6">
      {/* <FormSection
        title="Tình trạng hồ sơ"
        description="Mức độ hoàn thiện và điều kiện chỉ số 300 cơ sở"
      >
        <div className="flex flex-wrap gap-8">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Mức hoàn thiện</p>
            <CompletionBar percent={completeness} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Chỉ số 300 cơ sở</p>
            <KpiStatusBadge eligible={isEligible} />
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {hints.length === 0 ? (
            <li className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Hồ sơ đầy đủ thông tin đề xuất.
            </li>
          ) : (
            hints.map((hint) => (
              <li
                key={hint}
                className="flex items-start gap-2 text-sm text-amber-700"
              >
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {hint}
              </li>
            ))
          )}
        </ul>
      </FormSection> */}

      <FormSection title="Tóm tắt thông tin hồ sơ">
        <InfoGrid
          items={[
            { label: "Tên cơ sở / nhà máy", value: values.name },
            {
              label: "Người đại diện",
              value: `${values.representativeName} · ${GENDER_LABELS[values.representativeGender] ?? ""} · ${values.representativePhone}`,
            },
            {
              label: "Địa điểm",
              value: [values.address, values.ward, values.province]
                .filter(Boolean)
                .join(", "),
            },
            {
              label: "Nhóm nông sản",
              value: `${values.productGroupIds?.length ?? 0} nhóm đã chọn`,
            },
            {
              label: "Dịch vụ chế biến",
              value: `${values.processingServiceIds?.length ?? 0} dịch vụ đã chọn`,
            },
            {
              label: "Chứng nhận",
              value: values.hasCertificates
                ? `${certs.length} chứng nhận`
                : "Không có chứng nhận",
            },
            {
              label: "Hình ảnh máy móc",
              value: `${images.length} ảnh đã tải lên`,
            },
          ]}
        />
      </FormSection>

      {images.length > 0 && (
        <FormSection title={`Hình ảnh máy móc / dây chuyền (${images.length})`}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-6">
            {images.map((img) => (
              <a
                key={img.fileUrl}
                href={img.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="aspect-square overflow-hidden rounded-lg border border-slate-200 shadow-sm"
              >
                <img
                  src={img.fileUrl}
                  alt={img.fileName || ""}
                  className="h-full w-full object-cover transition hover:scale-105"
                />
              </a>
            ))}
          </div>
        </FormSection>
      )}
    </div>
  );
}
