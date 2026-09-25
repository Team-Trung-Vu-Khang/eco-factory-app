import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DEMAND_STATUS_LABELS, type DemandStatus } from "@/features/demand";

const CLASS: Record<DemandStatus, string> = {
  DRAFT: "border-slate-200 bg-slate-50 text-slate-600",
  SEARCHING: "border-sky-200 bg-sky-50 text-sky-700",
  SENT: "border-indigo-200 bg-indigo-50 text-indigo-700",
  RESPONDED: "border-violet-200 bg-violet-50 text-violet-700",
  NEGOTIATING: "border-amber-200 bg-amber-50 text-amber-700",
  CONNECTED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  COMPLETED: "border-emerald-300 bg-emerald-100 text-emerald-800",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
};

export function DemandStatusBadge({ status }: { status: DemandStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap ${CLASS[status]}`}>
      {DEMAND_STATUS_LABELS[status]}
    </Badge>
  );
}
