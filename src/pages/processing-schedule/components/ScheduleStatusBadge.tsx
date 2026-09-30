import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  SCHEDULE_STATUS_CLASS,
  SCHEDULE_STATUS_LABELS,
  type ScheduleStatus,
} from "@/features/processing-schedule";

export function ScheduleStatusBadge({
  status,
  label,
}: {
  status: ScheduleStatus;
  label?: string;
}) {
  const normalizedStatus =
    status === "ACTIVE"
      ? "OPEN"
      : (status as keyof typeof SCHEDULE_STATUS_CLASS);
  const className =
    SCHEDULE_STATUS_CLASS[normalizedStatus] ??
    "border-slate-200 bg-slate-100 text-slate-600";
  const displayLabel =
    label ?? SCHEDULE_STATUS_LABELS[normalizedStatus] ?? status;

  return (
    <Badge variant="outline" className={`whitespace-nowrap ${className}`}>
      {displayLabel}
    </Badge>
  );
}
