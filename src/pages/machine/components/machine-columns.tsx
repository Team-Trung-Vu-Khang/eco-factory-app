import { Badge, Button, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { CalendarPlus } from "lucide-react";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  CAPACITY_UNIT_LABELS,
  MACHINE_STATUS_LABELS,
  MACHINE_STATUS_OPTIONS,
  PROCESSING_SERVICE_LABELS,
  PROCESSING_SERVICE_OPTIONS,
  type MachineRow,
} from "@/features/factory";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM") : "…");

export const machineColumns: Column<MachineRow>[] = [
  {
    key: "name",
    label: "Máy / dây chuyền",
    render: (_, m) => (
      <div className="min-w-44">
        <p className="font-medium text-slate-900">{m.name}</p>
        <p className="text-xs text-slate-500">{m.factoryName}</p>
      </div>
    ),
  },
  {
    key: "functions",
    label: "Chức năng",
    render: (_, m) => (
      <div className="flex flex-wrap gap-1">
        {m.functions.map((f) => (
          <Badge key={f} variant="secondary" className="font-normal">
            {PROCESSING_SERVICE_LABELS[f]}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "maxCapacity",
    label: "Công suất tối đa",
    render: (_, m) => (
      <span className="whitespace-nowrap text-sm tabular-nums">
        {fmt.format(m.maxCapacity)} {CAPACITY_UNIT_LABELS[m.capacityUnit]}
      </span>
    ),
  },
  {
    key: "certificateIds",
    label: "Chứng nhận",
    render: (_, m) => <span className="text-sm tabular-nums text-slate-600">{m.certificateIds?.length || "—"}</span>,
  },
  {
    key: "availableCapacity",
    label: "Lịch nhận chế biến",
    render: (_, m) =>
      m.availableCapacity > 0 ? (
        <span className="whitespace-nowrap text-sm tabular-nums text-emerald-700">
          {fmt.format(m.availableCapacity)} {CAPACITY_UNIT_LABELS[m.availableUnit ?? m.capacityUnit]} · {date(m.availableFrom)}–{date(m.availableTo)}
        </span>
      ) : m.status === "ACTIVE" ? (
        <Button asChild variant="outline" size="sm" className="h-7">
          <Link href={`${ROUTES.processingSchedules}?machineId=${m.id}`}>
            <CalendarPlus className="mr-1 h-3.5 w-3.5" />
            Đăng lịch
          </Link>
        </Button>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      ),
  },
  {
    key: "status",
    label: "Tình trạng",
    render: (_, m) => (
      <Badge variant="outline" className={m.status === "ACTIVE" ? "text-emerald-700" : "text-amber-700"}>
        {MACHINE_STATUS_LABELS[m.status]}
      </Badge>
    ),
  },
];

export const machineFilters = [
  { key: "status", label: "Tình trạng", options: MACHINE_STATUS_OPTIONS },
  { key: "function", label: "Chức năng", options: PROCESSING_SERVICE_OPTIONS },
];
