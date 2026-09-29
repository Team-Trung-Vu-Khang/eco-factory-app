import { Button, cn, useToast, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Check, Phone, Users, X } from "lucide-react";
import { useState } from "react";
import { SEARCH_QUANTITY_UNIT_LABELS, useConnections, useResolveConnection, type ConnectionRequest } from "@/features/connection";
import { getCropName } from "@/features/crop";
import { CAPACITY_UNIT_LABELS } from "@/features/factory";
import type { ScheduleRow } from "@/features/processing-schedule";
import { useIsFactoryAdmin } from "@/features/viewer";
import { ConnectionStatusBadge } from "@/pages/connection/components/ConnectionStatusBadge";
import { ResolveDialog } from "@/pages/connection/components/ResolveDialog";

type Resolving = { request: ConnectionRequest; status: "SUCCESS" | "FAILED" };

const fmt = new Intl.NumberFormat("vi-VN");

const quantityOf = (c: ConnectionRequest) => {
  if (c.quantity === undefined) return null;
  const unit = c.requirements?.quantityUnit
    ? SEARCH_QUANTITY_UNIT_LABELS[c.requirements.quantityUnit]
    : c.capacityUnit
      ? CAPACITY_UNIT_LABELS[c.capacityUnit]
      : "";
  return `${fmt.format(c.quantity)} ${unit}`;
};

/** Count of connection requests on a post + dialog listing them */
export function ScheduleConnectionsButton({
  schedule,
}: {
  schedule: Pick<ScheduleRow, "id" | "machineName" | "fromDate" | "toDate">;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useConnections({ page: 0, size: 100, scheduleId: schedule.id });
  const requests = data?.content ?? [];
  const { toast } = useToast();
  // Admin: view only — resolving is the factory's job
  const isAdmin = useIsFactoryAdmin();
  const resolve = useResolveConnection();
  const [resolving, setResolving] = useState<Resolving | null>(null);

  const handleResolve = async (note: string) => {
    if (!resolving) return;
    try {
      await resolve.mutateAsync({ id: resolving.request.id, status: resolving.status, note: note || undefined });
      toast({
        title: "Đã cập nhật",
        description: resolving.status === "SUCCESS" ? "Đã kết nối, tin đăng đã được đóng." : "Đã huỷ kết nối.",
      });
      setResolving(null);
    } catch (error) {
      toast({ title: "Không thể cập nhật", description: (error as Error).message, variant: "destructive" });
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
          requests.length
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
            : "text-slate-400",
        )}
        disabled={isLoading || !requests.length}
        onClick={() => setOpen(true)}
        title={requests.length ? "Xem yêu cầu kết nối" : "Chưa có yêu cầu kết nối"}
      >
        <Users className="h-3.5 w-3.5" />
        {isLoading ? "…" : requests.length}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Yêu cầu kết nối ({requests.length})</DialogTitle>
            <DialogDescription>
              {schedule.machineName} · {dayjs(schedule.fromDate).format("DD/MM/YYYY")} →{" "}
              {dayjs(schedule.toDate).format("DD/MM/YYYY")}
            </DialogDescription>
          </DialogHeader>
          <ul className="max-h-[60vh] divide-y divide-slate-100 overflow-y-auto">
            {requests.map((c) => (
              <li key={c.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-slate-900">{c.farmerName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Phone className="h-3 w-3" />
                    {c.farmerPhone} · {dayjs(c.createdAt).format("DD/MM/YYYY HH:mm")}
                  </p>
                  <p className="text-sm text-slate-700">
                    {c.cropIds.map(getCropName).join(", ") || "—"}
                    {quantityOf(c) && <span className="text-slate-500"> · {quantityOf(c)}</span>}
                  </p>
                  {c.note && <p className="text-xs text-slate-500">{c.note}</p>}
                </div>
                <div className="max-w-56 shrink-0 space-y-1.5 sm:text-right">
                  <ConnectionStatusBadge status={c.status} />
                  {c.resultNote && <p className="text-xs text-slate-500">{c.resultNote}</p>}
                  {c.status === "PENDING" && !isAdmin && (
                    <div className="flex gap-1 sm:justify-end">
                      <Button size="sm" variant="outline" className="h-7 text-emerald-700" onClick={() => setResolving({ request: c, status: "SUCCESS" })}>
                        <Check className="mr-1 h-3.5 w-3.5" />
                        Xác nhận kết nối
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-rose-600" onClick={() => setResolving({ request: c, status: "FAILED" })}>
                        <X className="mr-1 h-3.5 w-3.5" />
                        Huỷ kết nối
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <ResolveDialog
        key={resolving ? `${resolving.request.id}-${resolving.status}` : "none"}
        target={resolving}
        loading={resolve.isPending}
        onOpenChange={(o) => !o && setResolving(null)}
        onConfirm={handleResolve}
      />
    </>
  );
}
