import type { ScheduleBackendStatus } from "./types";

export type ScheduleStatus = ScheduleBackendStatus | "ACTIVE";

export const SCHEDULE_STATUS_LABELS: Record<ScheduleBackendStatus, string> = {
  OPEN: "Còn hiệu lực",
  EXPIRED: "Đã quá hạn",
  CLOSED: "Đã đóng",
};

export const SCHEDULE_STATUS_CLASS: Record<ScheduleBackendStatus, string> = {
  OPEN: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EXPIRED: "border-slate-200 bg-slate-100 text-slate-600",
  CLOSED: "border-rose-200 bg-rose-50 text-rose-700",
};

export const SCHEDULE_HISTORY_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "OPEN", label: "Còn hiệu lực" },
  { value: "EXPIRED,CLOSED", label: "Đã quá hạn" },
];
