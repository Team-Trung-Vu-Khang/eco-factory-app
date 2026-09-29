import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GENDER_LABELS, type FactoryProfile } from "@/features/factory";
import { ApprovalStatusBadge } from "../ApprovalStatusBadge";

export const factoryColumns: Column<FactoryProfile>[] = [
  {
    key: "code",
    label: "Mã cơ sở",
    render: (_, row) => (
      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
        {row.code || `FAC-${row.id}`}
      </span>
    ),
  },
  {
    key: "name",
    label: "Tên cơ sở",
    render: (_, row) => (
      <div className="min-w-48">
        <p className="font-medium text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">
          {row.organizationType?.name ?? "Chưa phân loại"}
          {row.taxCode ? ` · MST: ${row.taxCode}` : ""}
        </p>
      </div>
    ),
  },
  {
    key: "representative",
    label: "Người đại diện",
    render: (_, row) => (
      <div>
        <p className="text-sm font-medium text-slate-800">
          {row.representativeName}
        </p>
        <p className="text-xs text-slate-500">
          {row.representativeGender
            ? `${GENDER_LABELS[row.representativeGender]} · `
            : ""}
          {row.representativePhone}
        </p>
      </div>
    ),
  },
  {
    key: "location",
    label: "Tỉnh / Thành phố",
    render: (_, row) => (
      <span className="text-sm text-slate-700">{row.province || "—"}</span>
    ),
  },
  {
    key: "services",
    label: "Dịch vụ chế biến",
    render: (_, row) => {
      const services = row.processingServices ?? [];
      if (services.length === 0)
        return <span className="text-xs text-slate-400">—</span>;
      return (
        <span className="text-xs text-slate-600 line-clamp-2 max-w-[200px]">
          {services.map((s) => s.name).join(", ")}
        </span>
      );
    },
  },
  // {
  //   key: "completenessPercent",
  //   label: "Hoàn thiện",
  //   render: (_, row) => (
  //     <CompletionBar percent={row.completenessPercent ?? 0} />
  //   ),
  // },
  {
    key: "reviewStatus",
    label: "Trạng thái duyệt",
    render: (_, row) => <ApprovalStatusBadge status={row.reviewStatus} />,
  },
  // {
  //   key: "program300Eligible",
  //   label: "Chỉ số 300 cơ sở",
  //   render: (_, row) => <KpiStatusBadge eligible={!!row.program300Eligible} />,
  // },
];
