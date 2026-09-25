import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { DemandType } from "@/features/demand-type";
import { PROCESSING_SERVICE_LABELS } from "@/features/factory";

export const demandTypeColumns: Column<DemandType>[] = [
  {
    key: "name",
    label: "Loại nhu cầu",
    render: (_, t) => (
      <div className="min-w-40">
        <p className="font-medium text-slate-900">{t.name}</p>
        <p className="font-mono text-xs text-slate-500">{t.code}</p>
      </div>
    ),
  },
  {
    key: "processingServices",
    label: "Dịch vụ liên quan",
    render: (_, t) => (
      <div className="flex flex-wrap gap-1">
        {t.processingServices.map((s) => (
          <Badge key={s} variant="secondary" className="font-normal">
            {PROCESSING_SERVICE_LABELS[s]}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "description",
    label: "Mô tả",
    render: (_, t) => <span className="text-sm text-slate-600">{t.description || "—"}</span>,
  },
  {
    key: "usageCount",
    label: "Nhu cầu đang dùng",
    render: (_, t) => <span className="text-sm tabular-nums">{t.usageCount}</span>,
  },
  {
    key: "isActive",
    label: "Trạng thái",
    render: (_, t) =>
      t.isActive ? (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Hoạt động</Badge>
      ) : (
        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">Ngừng hoạt động</Badge>
      ),
  },
];

export const demandTypeFilters = [
  {
    key: "isActive",
    label: "Trạng thái",
    options: [
      { value: "true", label: "Hoạt động" },
      { value: "false", label: "Ngừng hoạt động" },
    ],
  },
];
