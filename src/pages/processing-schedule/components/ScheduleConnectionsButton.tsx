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
import {
  Check,
  MessageSquareText,
  Package,
  Phone,
  Settings2,
  Sprout,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  useAcceptConnectionRequest,
  useConnections,
  type ConnectionRequestItem,
} from "@/features/connection";
import { MATERIAL_CONDITION_LABELS } from "@/features/demand/constants";
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
          <ul className="-mx-1 max-h-[65vh] space-y-3 overflow-y-auto px-1 py-1">
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
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  {/* Người gửi + trạng thái */}
                  <div className="flex items-start gap-3 px-4 pt-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
                      {(c.contactName || "N").trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {c.contactName || "Nông hộ"}
                      </p>
                      <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500">
                        {c.contactPhone && (
                          <a
                            href={`tel:${c.contactPhone}`}
                            className="inline-flex items-center gap-1 hover:text-emerald-700"
                          >
                            <Phone className="h-3 w-3" />
                            {c.contactPhone}
                          </a>
                        )}
                        {c.contactPhone && <span>·</span>}
                        {dayjs(c.requestedAt || c.createdAt).format(
                          "DD/MM/YYYY HH:mm",
                        )}
                      </p>
                    </div>
                    <ConnectionStatusBadge status={c.status} />
                  </div>

                  <RequestDetails request={c} />

                  {(c.resultNote || c.rejectReason) && (
                    <div className="mx-4 mb-4 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <p className="text-xs font-medium text-slate-500">
                        Ghi chú của nhà máy
                      </p>
                      {c.resultNote && (
                        <p className="text-slate-700">{c.resultNote}</p>
                      )}
                      {c.rejectReason && (
                        <p className="text-rose-600">
                          <span className="font-medium">Lý do từ chối:</span>{" "}
                          {c.rejectReason}
                        </p>
                      )}
                    </div>
                  )}

                  {c.status === "PENDING" && !isAdmin && (
                    <div className="flex justify-end border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
                      <Button
                        size="sm"
                        onClick={() =>
                          setResolving({ request: c, status: "SUCCESS" })
                        }
                      >
                        <Check className="mr-1.5 h-4 w-4" />
                        Xác nhận kết nối
                      </Button>
                    </div>
                  )}
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

/** Nhu cầu của nông hộ: nông sản + sản lượng nổi bật, yêu cầu phụ dạng chip */
function RequestDetails({ request: c }: { request: ConnectionRequestItem }) {
  const condition = c.materialCondition
    ? (MATERIAL_CONDITION_LABELS[
        c.materialCondition as keyof typeof MATERIAL_CONDITION_LABELS
      ] ?? c.materialCondition)
    : undefined;
  const quantity = quantityOf(c);
  const crops = c.crops?.length ? c.crops.join(", ") : undefined;
  const specs = [
    { label: "Tình trạng", value: condition, icon: Sprout },
    { label: "Đóng gói", value: c.packagingRequirement, icon: Package },
    { label: "Kỹ thuật", value: c.technicalRequirement, icon: Settings2 },
  ].filter((s) => s.value);

  return (
    <div className="space-y-3 px-4 py-3">
      {(crops || quantity) && (
        <div className="flex items-stretch divide-x divide-emerald-100 rounded-lg bg-emerald-50/70">
          <div className="min-w-0 flex-1 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-emerald-700/70">
              Nông sản
            </p>
            <p className="truncate font-semibold text-slate-900">
              {crops ?? "Chưa chọn"}
            </p>
          </div>
          {quantity && (
            <div className="shrink-0 px-3 py-2 text-right">
              <p className="text-[11px] uppercase tracking-wide text-emerald-700/70">
                Sản lượng
              </p>
              <p className="font-semibold tabular-nums text-slate-900">
                {quantity}
              </p>
            </div>
          )}
        </div>
      )}

      {specs.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {specs.map(({ label, value, icon: Icon }) => (
            <span
              key={label}
              title={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-700"
            >
              <Icon className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-500">{label}:</span>
              {value}
            </span>
          ))}
        </div>
      )}

      {c.message && (
        <p className="flex gap-2 text-sm text-slate-700">
          <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <span className="italic">“{c.message}”</span>
        </p>
      )}
    </div>
  );
}
