import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SCHEDULE_STATUS_CLASS, SCHEDULE_STATUS_LABELS, type ScheduleStatus } from "@/features/processing-schedule";

export function ScheduleStatusBadge({ status }: { status: ScheduleStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap ${SCHEDULE_STATUS_CLASS[status]}`}>
      {SCHEDULE_STATUS_LABELS[status]}
    </Badge>
  );
}
