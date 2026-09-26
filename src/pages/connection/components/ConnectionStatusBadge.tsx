import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CONNECTION_STATUS_CLASS, CONNECTION_STATUS_LABELS, type ConnectionStatus } from "@/features/connection";

export function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  return (
    <Badge variant="outline" className={`whitespace-nowrap ${CONNECTION_STATUS_CLASS[status]}`}>
      {CONNECTION_STATUS_LABELS[status]}
    </Badge>
  );
}
