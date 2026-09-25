import { CheckCircle2, CircleAlert } from "lucide-react";
import { useWatch } from "react-hook-form";
import { FormSection } from "@/components/form";
import {
  ORGANIZATION_TYPE_LABELS,
  PROCESSING_SERVICE_LABELS,
  computeFactoryStatus,
  getProvinceName,
  getWardName,
  type FactoryFormValues,
  type OrganizationType,
  type ProcessingService,
} from "@/features/factory";
import { InfoGrid } from "../detail/InfoGrid";
import { CompletionBar } from "../CompletionBar";
import { KpiStatusBadge } from "../KpiStatusBadge";
import { useFactoryFormContext } from "./useFactoryFormContext";

export function ReviewSection() {
  const { control } = useFactoryFormContext();
  const values = useWatch({ control }) as FactoryFormValues;
  const status = computeFactoryStatus(values);
  const machines = values.offersExternalCapacity ? values.machines : [];
  const hasGps = values.location.latitude !== undefined && values.location.longitude !== undefined;

  const hints = [
    !status.hasAvailableCapacity && "Khai báo máy đang hoạt động có công suất cho bên ngoài > 0 để được tính vào chỉ số 300 cơ sở.",
    !hasGps && "Thêm toạ độ để hiển thị trên bản đồ và tính khoảng cách.",
    !values.avatarUrl && "Thêm ảnh đại diện để hồ sơ đáng tin cậy hơn.",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-4">
      <FormSection title="Tình trạng hồ sơ" description="Hệ thống sẽ tính lại sau khi lưu">
        <div className="flex flex-wrap gap-8">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Mức hoàn thiện</p>
            <CompletionBar percent={status.completionPercent} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Chỉ số 300 cơ sở</p>
            <KpiStatusBadge eligible={status.isKpiEligible} />
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {hints.length === 0 ? (
            <li className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Hồ sơ đầy đủ.
            </li>
          ) : (
            hints.map((hint) => (
              <li key={hint} className="flex items-start gap-2 text-sm text-amber-700">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {hint}
              </li>
            ))
          )}
        </ul>
      </FormSection>

      <FormSection title="Tóm tắt">
        <InfoGrid
          items={[
            { label: "Tên cơ sở", value: values.name },
            { label: "Loại hình", value: ORGANIZATION_TYPE_LABELS[values.organizationType as OrganizationType] },
            { label: "Người đại diện", value: `${values.representative.fullName} · ${values.representative.phone}` },
            {
              label: "Địa điểm",
              value: [values.location.address, getWardName(values.location.provinceCode, values.location.wardCode), getProvinceName(values.location.provinceCode)]
                .filter(Boolean)
                .join(", "),
            },
            { label: "Dịch vụ", value: values.services.map((s) => PROCESSING_SERVICE_LABELS[s as ProcessingService]).join(", ") },
            { label: "Máy / dây chuyền", value: machines.length ? `${machines.length} máy` : "Không cung cấp cho bên ngoài" },
            { label: "Chứng nhận", value: values.hasCertification ? `${values.certifications.length} chứng nhận` : "Không có" },
          ]}
        />
      </FormSection>
    </div>
  );
}
