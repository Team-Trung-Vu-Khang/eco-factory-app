import type { MachineCapacityUnit, MachineStatus } from "./types";

export const MACHINE_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "PAUSED", label: "Tạm dừng" },
] as const;

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

export const MACHINE_CAPACITY_UNIT_OPTIONS = [
  { value: "KG_PER_MONTH", label: "kg/tháng" },
  { value: "TONNE_PER_MONTH", label: "tấn/tháng" },
] as const;
