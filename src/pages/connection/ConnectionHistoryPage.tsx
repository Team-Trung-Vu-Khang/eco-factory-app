import { ThumbnailLabel } from "@/components/common/Thumbnail";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable, type Column } from "@/components/common/DataTable";
import { MATERIAL_CONDITION_LABELS } from "@/features/demand/constants";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import {
  CONNECTION_STATUS_OPTIONS,
  useAdminConnections,
  useCancelConnectionRequest,
  useMyConnectionRequests,
  type ConnectionRequestItem,
} from "@/features/connection";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import { useIsFactoryAdmin } from "@/features/viewer";
import { ConnectionStatusBadge } from "./components/ConnectionStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");
const filters = [
  { key: "status", label: "Trạng thái", options: CONNECTION_STATUS_OPTIONS },
];

export default function ConnectionHistoryPage() {
  const { toast } = useToast();
  const isAdmin = useIsFactoryAdmin();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [cancelling, setCancelling] = useState<ConnectionRequestItem | null>(
    null,
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  const queryParams = {
    page,
    size,
    keyword: debouncedKeyword.trim() || undefined,
    status: status || undefined,
  };

  const farmQuery = useMyConnectionRequests(queryParams, { enabled: !isAdmin });
  const adminQuery = useAdminConnections(queryParams, { enabled: isAdmin });
  const query = isAdmin ? adminQuery : farmQuery;
  const cancelMutation = useCancelConnectionRequest();

  const handleCancelRequest = async () => {
    if (!cancelling) return;
    try {
      await cancelMutation.mutateAsync(cancelling.id);
      toast({
        title: "Đã hủy yêu cầu",
        description: "Yêu cầu kết nối đã được hủy thành công.",
      });
      setCancelling(null);
    } catch (error) {
      toast({
        title: "Không thể hủy yêu cầu",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const columns: Column<ConnectionRequestItem>[] = [
    ...(isAdmin
      ? [
          {
            key: "contactName",
            label: "Nông hộ",
            render: (_: unknown, c: ConnectionRequestItem) => (
              <div className="min-w-36">
                <p className="font-medium text-slate-900">
                  {c.contactName || "—"}
                </p>
                {c.contactPhone && (
                  <p className="text-xs tabular-nums text-slate-500">
                    {c.contactPhone}
                  </p>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      key: "factory",
      label: "Nhà máy & Tin đăng",
      render: (_, c) => (
        <div className="min-w-48">
          <ThumbnailLabel src={c.schedule?.machine?.imageUrl} label={c.profile?.name ?? "—"}>
            <p className="font-medium text-slate-900">{c.profile?.name ?? "—"}</p>
            <p className="text-xs text-slate-500">
              {c.schedule?.title ||
                c.schedule?.machine?.name ||
                "Lịch nhận chế biến"}
            </p>
          </ThumbnailLabel>
        </div>
      ),
    },
    {
      key: "crops",
      label: "Cây trồng & Sản lượng",
      render: (_, c) => (
        <div className="text-sm text-slate-700">
          <p>{c.crops?.join(", ") || "—"}</p>
          {c.materialCondition && (
            <p className="text-xs text-slate-500">
              {MATERIAL_CONDITION_LABELS[
                c.materialCondition as keyof typeof MATERIAL_CONDITION_LABELS
              ] ?? c.materialCondition}
            </p>
          )}
          {c.maxCapacity !== undefined && c.maxCapacity !== null && (
            <p className="text-xs tabular-nums text-slate-500">
              {fmt.format(c.maxCapacity)}{" "}
              {c.capacityUnit
                ? (CAPACITY_UNIT_LABELS[c.capacityUnit] ?? c.capacityUnit)
                : ""}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "message",
      label: "Lời nhắn",
      render: (_, c) => (
        <span className="text-sm text-slate-600 line-clamp-2">
          {c.message || "—"}
        </span>
      ),
    },
    {
      key: "requestedAt",
      label: "Thời gian gửi",
      render: (_, c) => (
        <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">
          {dayjs(c.requestedAt || c.createdAt).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (_, c) => <ConnectionStatusBadge status={c.status} />,
    },
    {
      key: "factoryNote",
      label: "Ghi chú của nhà máy",
      render: (_, c) =>
        c.resultNote || c.rejectReason ? (
          <div className="max-w-60 space-y-0.5 text-sm">
            {c.resultNote && (
              <p className="line-clamp-2 text-slate-600">{c.resultNote}</p>
            )}
            {c.rejectReason && (
              <p className="line-clamp-2 text-rose-600">
                <span className="font-medium">Lý do từ chối:</span>{" "}
                {c.rejectReason}
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        ),
    },
    ...(!isAdmin
      ? [
          {
            key: "actions",
            label: "",
            render: (_: unknown, c: ConnectionRequestItem) =>
              c.status === "PENDING" || c.status === "SUCCESS" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => setCancelling(c)}
                >
                  {c.status === "SUCCESS" ? "Hủy kết nối" : "Hủy yêu cầu"}
                </Button>
              ) : null,
          },
        ]
      : []),
  ];

  return (
    <PageWrapper
      title="Lịch sử kết nối"
      description={
        isAdmin
          ? "Tra cứu yêu cầu kết nối nhà máy của nông hộ"
          : "Các nhà máy bạn đã đăng ký kết nối và trạng thái phản hồi"
      }
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder={
          isAdmin
            ? "Tìm theo nông hộ, SĐT, nhà máy..."
            : "Tìm theo nhà máy, máy, cây trồng..."
        }
        onSearch={(v) => {
          setKeyword(v);
          setPage(0);
        }}
        filters={filters}
        onFilterChange={(_key, value) => {
          setStatus(value && value !== "all" ? value : undefined);
          setPage(0);
        }}
        pageSize={size}
        currentIndex={page + 1}
        totalElements={query.data?.totalElements}
        totalPages={query.data?.totalPages}
        onPageSize={(next) => {
          setSize(next);
          setPage(0);
        }}
        onIndexChange={(index) => setPage(Math.max(0, index - 1))}
        columnToggleable={false}
        downloadable={false}
      />

      <Dialog
        open={!!cancelling}
        onOpenChange={(o) =>
          !o && !cancelMutation.isPending && setCancelling(null)
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {cancelling?.status === "SUCCESS"
                ? "Hủy kết nối?"
                : "Hủy yêu cầu kết nối?"}
            </DialogTitle>
            <DialogDescription>
              Bạn sắp hủy yêu cầu kết nối dưới đây.
            </DialogDescription>
          </DialogHeader>
          {cancelling && (
            <dl className="grid max-h-[50vh] grid-cols-[7rem_1fr] gap-x-3 gap-y-1.5 overflow-y-auto rounded-lg bg-slate-50 px-3 py-2.5 text-sm">
              {requestRows(cancelling).map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="whitespace-pre-line break-words text-slate-800">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={handleCancelRequest}
            >
              {cancelMutation.isPending ? "Đang hủy..." : "Hủy yêu cầu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}

/** Thông tin yêu cầu đã gửi — chỉ liệt kê các trường có dữ liệu */
function requestRows(c: ConnectionRequestItem): [string, string][] {
  const condition = c.materialCondition
    ? (MATERIAL_CONDITION_LABELS[
        c.materialCondition as keyof typeof MATERIAL_CONDITION_LABELS
      ] ?? c.materialCondition)
    : undefined;
  const unit = c.capacityUnit
    ? (CAPACITY_UNIT_LABELS[c.capacityUnit] ?? c.capacityUnit)
    : "";
  const rows: [string, string | null | undefined][] = [
    ["Nhà máy", c.profile?.name],
    ["Tin đăng", c.schedule?.title || c.schedule?.machine?.name || undefined],
    ["Dịch vụ", c.processingServices?.map((s) => s.name).join(", ")],
    ["Nông sản", c.crops?.join(", ")],
    [
      "Sản lượng",
      c.maxCapacity != null ? `${c.maxCapacity} ${unit}`.trim() : undefined,
    ],
    ["Tình trạng", condition],
    ["Đóng gói", c.packagingRequirement],
    ["Kỹ thuật", c.technicalRequirement],
    ["Lời nhắn", c.message],
    ["Gửi lúc", dayjs(c.requestedAt || c.createdAt).format("DD/MM/YYYY HH:mm")],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]);
}
