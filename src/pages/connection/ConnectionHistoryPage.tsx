import {
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
          <p className="font-medium text-slate-900">{c.profile?.name ?? "—"}</p>
          <p className="text-xs text-slate-500">
            {c.schedule?.title ||
              c.schedule?.machine?.name ||
              "Lịch nhận chế biến"}
          </p>
        </div>
      ),
    },
    {
      key: "crops",
      label: "Cây trồng & Sản lượng",
      render: (_, c) => (
        <div className="text-sm text-slate-700">
          <p>{c.crops?.join(", ") || "—"}</p>
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
      label: "Ghi chú / Lời nhắn",
      render: (_, c) => (
        <span className="text-sm text-slate-600 line-clamp-2">
          {c.message || c.materialCondition || "—"}
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
      render: (_, c) => (
        <div className="max-w-56 space-y-0.5">
          <ConnectionStatusBadge status={c.status} />
          {c.resultNote && (
            <p className="text-xs text-slate-500">{c.resultNote}</p>
          )}
          {c.rejectReason && (
            <p className="text-xs text-rose-500">{c.rejectReason}</p>
          )}
        </div>
      ),
    },
    ...(!isAdmin
      ? [
          {
            key: "actions",
            label: "",
            render: (_: unknown, c: ConnectionRequestItem) =>
              c.status === "PENDING" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => setCancelling(c)}
                >
                  Hủy yêu cầu
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

      <DeleteDialog
        open={!!cancelling}
        onOpenChange={(o) => !o && setCancelling(null)}
        onConfirm={handleCancelRequest}
        loading={cancelMutation.isPending}
        title="Hủy yêu cầu kết nối?"
        description={`Bạn có chắc muốn hủy yêu cầu kết nối tới "${cancelling?.profile?.name ?? "Nhà máy"}"?`}
      />
    </PageWrapper>
  );
}
