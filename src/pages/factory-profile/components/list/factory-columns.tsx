import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  GENDER_LABELS,
  ORGANIZATION_TYPE_LABELS,
  PROCESSING_SERVICE_LABELS,
  getProvinceName,
  type Factory,
} from "@/features/factory";
import { CompletionBar } from "../CompletionBar";
import { KpiStatusBadge } from "../KpiStatusBadge";

export const factoryColumns: Column<Factory>[] = [
  {
    key: "name",
    label: "Tên cơ sở",
    render: (_, row) => (
      <div className="min-w-48">
        <p className="font-medium text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">{ORGANIZATION_TYPE_LABELS[row.organizationType]}</p>
      </div>
    ),
  },
  {
    key: "representative",
    label: "Người đại diện",
    render: (_, row) => (
      <div>
        <p className="text-sm">{row.representative.fullName}</p>
        <p className="text-xs text-slate-500">
          {GENDER_LABELS[row.representative.gender]} · {row.representative.phone}
        </p>
      </div>
    ),
  },
  {
    key: "location",
    label: "Tỉnh / Thành phố",
    render: (_, row) => getProvinceName(row.location.provinceCode),
  },
  {
    key: "services",
    label: "Dịch vụ",
    render: (_, row) => (
      <span className="text-sm text-slate-600">
        {row.services.map((s) => PROCESSING_SERVICE_LABELS[s]).join(", ")}
      </span>
    ),
  },
  {
    key: "hasAvailableCapacity",
    label: "Công suất khả dụng",
    render: (_, row) =>
      row.hasAvailableCapacity ? (
        <span className="text-sm font-medium text-emerald-700">Có</span>
      ) : (
        <span className="text-sm text-slate-400">Không</span>
      ),
  },
  {
    key: "completionPercent",
    label: "Hoàn thiện",
    render: (_, row) => <CompletionBar percent={row.completionPercent} />,
  },
  {
    key: "isKpiEligible",
    label: "Chỉ số 300 cơ sở",
    render: (_, row) => <KpiStatusBadge eligible={row.isKpiEligible} />,
  },
];
