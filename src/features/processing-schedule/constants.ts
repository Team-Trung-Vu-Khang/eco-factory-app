export type ScheduleStatus = "UPCOMING" | "OPEN" | "EXPIRED" | "CLOSED";

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  UPCOMING: "Sắp nhận",
  OPEN: "Đang nhận",
  EXPIRED: "Hết hạn",
  CLOSED: "Đã đóng",
};

export const SCHEDULE_STATUS_CLASS: Record<ScheduleStatus, string> = {
  UPCOMING: "border-sky-200 bg-sky-50 text-sky-700",
  OPEN: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EXPIRED: "border-amber-200 bg-amber-50 text-amber-700",
  CLOSED: "border-slate-200 bg-slate-50 text-slate-600",
};

export const SCHEDULE_STATUS_OPTIONS = (Object.entries(SCHEDULE_STATUS_LABELS) as [ScheduleStatus, string][]).map(
  ([value, label]) => ({ value, label }),
);
