import { ThumbnailLabel } from "@/components/common/Thumbnail";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import type {
  FactoryMachineItem,
  MachineCapacityUnit,
  MachineStatus,
} from "@/features/machine";
import { MACHINE_STATUS_OPTIONS } from "./machine-form-schema";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d: string) => dayjs(d).format("DD/MM/YYYY");

export const MACHINE_STATUS_CONFIG: Record<
  MachineStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  PAUSED: {
    label: "Tạm dừng",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

export const CAPACITY_UNIT_LABELS: Record<MachineCapacityUnit, string> = {
  KG_PER_MONTH: "kg/tháng",
  TONNE_PER_MONTH: "tấn/tháng",
};

/** Admin list column for factory profile */
export const factoryColumn: Column<FactoryMachineItem> = {
  key: "factoryName",
  label: "Nhà máy",
  render: (_, m) => (
    <div className="min-w-44">
      {m.profile ? (
        <Link
          href={ROUTES.profileDetail(String(m.profile.id))}
          className="font-medium text-slate-900 hover:text-emerald-700 hover:underline"
        >
          {m.profile.name}
        </Link>
      ) : (
        <span className="text-sm text-slate-500">—</span>
      )}
    </div>
  ),
};

export const machineColumns: Column<FactoryMachineItem>[] = [
  {
    key: "code",
    label: "Mã máy",
    render: (_, m) => (
      <Badge variant="outline" className="font-mono font-medium text-slate-700">
        {m.code}
      </Badge>
    ),
  },
  {
    key: "name",
    label: "Tên máy / dây chuyền",
    render: (_, m) => (
      <div className="min-w-44">
        <ThumbnailLabel src={m.imageUrl} label={m.name} />
      </div>
    ),
  },
  {
    key: "processingServices",
    label: "Dịch vụ",
    render: (_, m) => (
      <div className="flex max-w-xs flex-wrap gap-1">
        {(m.processingServices ?? []).map((s) => (
          <Badge key={s.id} variant="secondary" className="font-normal text-xs">
            {s.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "productGroups",
    label: "Nhóm nông sản",
    render: (_, m) => (
      <div className="flex max-w-xs flex-wrap gap-1">
        {(m.productGroups ?? []).map((g) => (
          <Badge
            key={g.id}
            variant="outline"
            className="font-normal text-xs bg-slate-50"
          >
            {g.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "maxCapacity",
    label: "Công suất",
    render: (_, m) => (
      <span className="whitespace-nowrap text-sm font-medium tabular-nums text-slate-800">
        {fmt.format(m.maxCapacity)}{" "}
        <span className="text-xs font-normal text-slate-500">
          {CAPACITY_UNIT_LABELS[m.capacityUnit] ?? m.capacityUnit}
        </span>
      </span>
    ),
  },
  {
    key: "openSchedules",
    label: "Lịch nhận chế biến",
    render: (_, m) => {
      const schedules = m.openSchedules ?? [];
      if (!schedules.length) {
        return <span className="text-sm text-slate-400">Chưa có lịch</span>;
      }
      return (
        <div className="flex flex-col gap-1 min-w-44">
          {schedules.map((s) => (
            <div
              key={s.id}
              className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800 border border-emerald-200 whitespace-nowrap"
            >
              <span className="tabular-nums font-medium">
                {date(s.startDate)} → {date(s.endDate)}
              </span>
              <span className="text-slate-500">
                ({fmt.format(s.maxCapacity)}{" "}
                {CAPACITY_UNIT_LABELS[s.capacityUnit] ?? s.capacityUnit})
              </span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Tình trạng",
    render: (_, m) => {
      const cfg = MACHINE_STATUS_CONFIG[m.status] ?? {
        label: m.status,
        className: "border-slate-200 text-slate-600",
      };
      return (
        <Badge variant="outline" className={cfg.className}>
          {cfg.label}
        </Badge>
      );
    },
  },
];

export const machineFilters = [
  { key: "status", label: "Tình trạng", options: [...MACHINE_STATUS_OPTIONS] },
];
