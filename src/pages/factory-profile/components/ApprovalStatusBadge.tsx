import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FACTORY_APPROVAL_STATUS_LABELS, type FactoryApprovalStatus } from "@/features/factory";

const CLASS: Record<FactoryApprovalStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  REJECTED: "border-rose-200 bg-rose-50 text-rose-700",
};

export function ApprovalStatusBadge({ status }: { status: FactoryApprovalStatus }) {
  return (
    <Badge variant="outline" className={CLASS[status]}>
      {FACTORY_APPROVAL_STATUS_LABELS[status]}
    </Badge>
  );
}
