/** ACTIVE = open and not past its end date; anything else (past end date or closed) is EXPIRED */
export type ScheduleStatus = "ACTIVE" | "EXPIRED";

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  ACTIVE: "Còn hiệu lực",
  EXPIRED: "Đã quá hạn",
};

export const SCHEDULE_STATUS_CLASS: Record<ScheduleStatus, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EXPIRED: "border-slate-200 bg-slate-50 text-slate-600",
};

export const SCHEDULE_STATUS_OPTIONS = (Object.entries(SCHEDULE_STATUS_LABELS) as [ScheduleStatus, string][]).map(
  ([value, label]) => ({ value, label }),
);
