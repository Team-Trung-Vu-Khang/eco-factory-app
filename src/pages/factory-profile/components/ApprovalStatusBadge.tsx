import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FACTORY_APPROVAL_STATUS_LABELS,
  type FactoryApprovalStatus,
  type FactoryReviewStatus,
} from "@/features/factory";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ duyệt",
  PENDING_REVIEW: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const CLASS: Record<string, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  PENDING_REVIEW: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
};

export function ApprovalStatusBadge({
  status,
}: {
  status: FactoryApprovalStatus | FactoryReviewStatus | string;
}) {
  const label =
    STATUS_LABELS[status] ||
    (FACTORY_APPROVAL_STATUS_LABELS as Record<string, string>)[status] ||
    status;
  const cls = CLASS[status] || "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <Badge variant="outline" className={cls}>
      {label}
    </Badge>
  );
}
