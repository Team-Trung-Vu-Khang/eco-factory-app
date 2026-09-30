import {
  Button,
  cn,
  useToast,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Check, Phone, Users } from "lucide-react";
import { useState } from "react";
import {
  useAcceptConnectionRequest,
  useConnections,
  type ConnectionRequestItem,
} from "@/features/connection";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import type { ScheduleRow } from "@/features/processing-schedule";
import { useIsFactoryAdmin } from "@/features/viewer";
import { ConnectionStatusBadge } from "@/pages/connection/components/ConnectionStatusBadge";
import { ResolveDialog } from "@/pages/connection/components/ResolveDialog";

const fmt = new Intl.NumberFormat("vi-VN");

const quantityOf = (c: ConnectionRequestItem) => {
  if (c.maxCapacity === undefined || c.maxCapacity === null) return null;
  const unit = c.capacityUnit
    ? (CAPACITY_UNIT_LABELS[c.capacityUnit] ?? c.capacityUnit)
    : "";
  return `${fmt.format(c.maxCapacity)} ${unit}`;
};

/** Count of connection requests on a post + dialog listing them */
export function ScheduleConnectionsButton({
  schedule,
}: {
  schedule: ScheduleRow;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useConnections(
    {
      page: 0,
      size: 100,
      scheduleId: schedule.id,
    },
    { enabled: open, workspaceId: schedule.workspaceId },
  );
  const requests = data?.content ?? [];
  const requestCount = schedule.connectionRequestCount ?? 0;
  const { toast } = useToast();
  // Admin: view only — resolving is the factory's job
  const isAdmin = useIsFactoryAdmin();
  const acceptMutation = useAcceptConnectionRequest();
  const [resolving, setResolving] = useState<{
    request: ConnectionRequestItem;
    status: "SUCCESS" | "FAILED";
  } | null>(null);

  const handleResolve = async (note: string) => {
    if (!resolving) return;
    try {
      await acceptMutation.mutateAsync({
        id: resolving.request.id,
        resultNote: note || undefined,
        workspaceId: schedule.workspaceId,
      });
      toast({
        title: "Đã xác nhận kết nối",
        description: "Đã kết nối thành công, tin đăng đã được đóng.",
      });
      setResolving(null);
    } catch (error) {
      toast({
        title: "Không thể xác nhận kết nối",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 min-w-14 gap-1.5 px-3 font-medium tabular-nums",
          // Has requests: green call-to-action · none: muted, not clickable
          requestCount > 0
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
            : "text-slate-400",
        )}
        disabled={requestCount === 0}
        onClick={() => setOpen(true)}
        title={
          requestCount > 0 ? "Xem yêu cầu kết nối" : "Chưa có yêu cầu kết nối"
        }
      >
        <Users className="h-3.5 w-3.5" />
        {requestCount}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Yêu cầu kết nối ({data?.totalElements ?? requests.length})
            </DialogTitle>
            <DialogDescription>
              {schedule.machine?.name ?? "Máy"} ·{" "}
              {dayjs(schedule.startDate).format("DD/MM/YYYY")} →{" "}
              {dayjs(schedule.endDate).format("DD/MM/YYYY")}
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto">
            {isLoading ? (
              <li className="py-6 text-center text-sm text-slate-500">
                Đang tải danh sách yêu cầu...
              </li>
            ) : requests.length === 0 ? (
              <li className="py-6 text-center text-sm text-slate-500">
                Chưa có yêu cầu kết nối nào.
              </li>
            ) : (
              requests.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      {c.contactName || "Nông hộ"}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      {c.contactPhone && (
                        <>
                          <Phone className="h-3 w-3" />
                          {c.contactPhone} ·{" "}
                        </>
                      )}
                      {dayjs(c.requestedAt || c.createdAt).format(
                        "DD/MM/YYYY HH:mm",
                      )}
                    </p>
                    <p className="text-sm text-slate-700">
                      {c.crops?.join(", ") || "—"}
                      {quantityOf(c) && (
                        <span className="text-slate-500">
                          {" "}
                          · {quantityOf(c)}
                        </span>
                      )}
                    </p>
                    {c.materialCondition && (
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Nguyên liệu:</span>{" "}
                        {c.materialCondition}
                      </p>
                    )}
                    {c.packagingRequirement && (
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Đóng gói:</span>{" "}
                        {c.packagingRequirement}
                      </p>
                    )}
                    {c.technicalRequirement && (
                      <p className="text-xs text-slate-600">
                        <span className="font-medium">Kỹ thuật:</span>{" "}
                        {c.technicalRequirement}
                      </p>
                    )}
                    {c.message && (
                      <p className="text-xs text-slate-500 italic">
                        "{c.message}"
                      </p>
                    )}
                  </div>
                  <div className="max-w-56 shrink-0 space-y-1.5 sm:text-right">
                    <ConnectionStatusBadge status={c.status} />
                    {c.resultNote && (
                      <p className="text-xs text-slate-500">{c.resultNote}</p>
                    )}
                    {c.rejectReason && (
                      <p className="text-xs text-rose-500">{c.rejectReason}</p>
                    )}
                    {c.status === "PENDING" && !isAdmin && (
                      <div className="flex gap-1 sm:justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-emerald-700"
                          onClick={() =>
                            setResolving({ request: c, status: "SUCCESS" })
                          }
                        >
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Xác nhận kết nối
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </DialogContent>
      </Dialog>

      <ResolveDialog
        key={resolving ? `${resolving.request.id}-${resolving.status}` : "none"}
        target={resolving}
        loading={acceptMutation.isPending}
        onOpenChange={(o) => !o && setResolving(null)}
        onConfirm={handleResolve}
      />
    </>
  );
}
