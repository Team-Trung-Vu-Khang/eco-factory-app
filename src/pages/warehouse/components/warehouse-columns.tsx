import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  STORAGE_UNIT_LABELS,
  WAREHOUSE_STATUS_LABELS,
  WAREHOUSE_TYPE_LABELS,
  type Warehouse,
  type WarehouseStatus,
} from "@/features/warehouse";
import { UtilizationBar } from "./UtilizationBar";

const fmt = new Intl.NumberFormat("vi-VN");

const STATUS_CLASS: Record<WarehouseStatus, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  MAINTENANCE: "border-amber-200 bg-amber-50 text-amber-700",
  INACTIVE: "border-slate-200 bg-slate-50 text-slate-600",
};

const range = (min?: number, max?: number, unit = "") =>
  min === undefined && max === undefined ? "—" : `${min ?? "…"} → ${max ?? "…"}${unit}`;

export const warehouseColumns: Column<Warehouse>[] = [
  {
    key: "name",
    label: "Tên kho",
    render: (_, w) => (
      <div className="min-w-40">
        <p className="font-medium text-slate-900">{w.name}</p>
        <p className="text-xs text-slate-500">
          {[w.code, WAREHOUSE_TYPE_LABELS[w.type]].filter(Boolean).join(" · ")}
        </p>
      </div>
    ),
  },
  {
    key: "capacity",
    label: "Sức chứa",
    render: (_, w) => (
      <div className="text-sm tabular-nums">
        <p>
          {fmt.format(w.usedCapacity)} / {fmt.format(w.capacity)} {STORAGE_UNIT_LABELS[w.capacityUnit]}
        </p>
        <p className="text-xs text-slate-500">
          Còn trống {fmt.format(w.availableCapacity)} {STORAGE_UNIT_LABELS[w.capacityUnit]}
        </p>
      </div>
    ),
  },
  {
    key: "utilizationPercent",
    label: "Sử dụng",
    render: (_, w) => <UtilizationBar percent={w.utilizationPercent} />,
  },
  {
    key: "temperature",
    label: "Nhiệt độ",
    render: (_, w) => <span className="text-sm tabular-nums text-slate-600">{range(w.temperatureMin, w.temperatureMax, "°C")}</span>,
  },
  {
    key: "acceptsExternalStorage",
    label: "Nhận bên ngoài",
    render: (_, w) =>
      w.acceptsExternalStorage ? (
        <span className="text-sm font-medium text-emerald-700">Có</span>
      ) : (
        <span className="text-sm text-slate-400">Không</span>
      ),
  },
  {
    key: "managerName",
    label: "Phụ trách",
    render: (_, w) => <span className="text-sm">{w.managerName || "—"}</span>,
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, w) => (
      <Badge variant="outline" className={STATUS_CLASS[w.status]}>
        {WAREHOUSE_STATUS_LABELS[w.status]}
      </Badge>
    ),
  },
];
