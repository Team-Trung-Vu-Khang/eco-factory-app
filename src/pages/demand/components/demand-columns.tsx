import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { QUANTITY_UNIT_LABELS, type Demand } from "@/features/demand";
import { PROCESSING_SERVICE_LABELS, PRODUCT_GROUP_LABELS, getProvinceName } from "@/features/factory";
import { DemandStatusBadge } from "./DemandStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (v?: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "");

export const demandColumns: Column<Demand>[] = [
  {
    key: "productName",
    label: "Nhu cầu",
    render: (_, d) => (
      <div className="min-w-48">
        <p className="font-medium text-slate-900">{d.productName}</p>
        <p className="text-xs text-slate-500 tabular-nums">
          {PRODUCT_GROUP_LABELS[d.productGroupId]} · {fmt.format(d.quantity)} {QUANTITY_UNIT_LABELS[d.quantityUnit]}
        </p>
      </div>
    ),
  },
  {
    key: "requester",
    label: "Người có nhu cầu",
    render: (_, d) => (
      <div className="min-w-44">
        <p className="text-sm text-slate-900">{d.requester.fullName}</p>
        <p className="text-xs text-slate-500">{d.requester.organizationName}</p>
      </div>
    ),
  },
  {
    key: "services",
    label: "Dịch vụ",
    render: (_, d) => <span className="text-sm text-slate-600">{d.services.map((s) => PROCESSING_SERVICE_LABELS[s]).join(", ")}</span>,
  },
  {
    key: "neededFrom",
    label: "Thời gian · Địa điểm",
    render: (_, d) => (
      <div className="whitespace-nowrap text-sm tabular-nums">
        <p className="text-slate-700">{[date(d.neededFrom), date(d.neededTo)].filter(Boolean).join(" – ")}</p>
        <p className="text-xs text-slate-500">{getProvinceName(d.materialLocation.provinceCode)}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, d) => (
      <div className="flex flex-col items-start gap-1">
        <DemandStatusBadge status={d.status} />
        <span className="text-xs text-slate-500 tabular-nums">
          {d.viewedFactoryCount} xem · {d.respondedFactoryCount} phản hồi
        </span>
      </div>
    ),
  },
];
