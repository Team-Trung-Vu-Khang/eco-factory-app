import { Button, DataTable, useToast, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Check, X } from "lucide-react";
import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import { CONNECTION_STATUS_OPTIONS, SEARCH_QUANTITY_UNIT_LABELS, useConnections, useResolveConnection, type ConnectionRequest } from "@/features/connection";
import { getCropName } from "@/features/crop";
import { CAPACITY_UNIT_LABELS } from "@/features/factory";
import { useCurrentFarmer, useIsFarmer } from "@/features/viewer";
import { ConnectionStatusBadge } from "./components/ConnectionStatusBadge";
import { ResolveDialog } from "./components/ResolveDialog";

const fmt = new Intl.NumberFormat("vi-VN");
const filters = [{ key: "status", label: "Trạng thái", options: CONNECTION_STATUS_OPTIONS }];

const baseColumns: Column<ConnectionRequest>[] = [
  {
    key: "factoryName",
    label: "Nhà máy",
    render: (_, c) => (
      <div className="min-w-44">
        <p className="font-medium text-slate-900">{c.factoryName}</p>
        <p className="text-xs text-slate-500">{c.machineName}</p>
      </div>
    ),
  },
  {
    key: "cropIds",
    label: "Cây trồng",
    render: (_, c) => (
      <div className="text-sm text-slate-700">
        {c.cropIds.map(getCropName).join(", ") || "—"}
        {c.quantity !== undefined && (
          <p className="text-xs tabular-nums text-slate-500">
            {fmt.format(c.quantity)}{" "}
            {c.requirements?.quantityUnit
              ? SEARCH_QUANTITY_UNIT_LABELS[c.requirements.quantityUnit]
              : c.capacityUnit
                ? CAPACITY_UNIT_LABELS[c.capacityUnit]
                : ""}
          </p>
        )}
      </div>
    ),
  },
  { key: "note", label: "Ghi chú", render: (_, c) => <span className="text-sm text-slate-600">{c.note || "—"}</span> },
  {
    key: "createdAt",
    label: "Ngày đăng ký",
    render: (_, c) => <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">{dayjs(c.createdAt).format("DD/MM/YYYY HH:mm")}</span>,
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, c) => (
      <div className="max-w-56 space-y-0.5">
        <ConnectionStatusBadge status={c.status} />
        {c.resultNote && <p className="text-xs text-slate-500">{c.resultNote}</p>}
      </div>
    ),
  },
];

const farmerColumn: Column<ConnectionRequest> = {
  key: "farmerName",
  label: "Nông hộ",
  render: (_, c) => (
    <div className="min-w-36">
      <p className="font-medium text-slate-900">{c.farmerName}</p>
      <p className="text-xs tabular-nums text-slate-500">{c.farmerPhone}</p>
    </div>
  ),
};

export default function ConnectionHistoryPage() {
  const { toast } = useToast();
  const isFarmer = useIsFarmer();
  const farmer = useCurrentFarmer();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [resolving, setResolving] = useState<{ request: ConnectionRequest; status: "SUCCESS" | "FAILED" } | null>(null);

  // Farmer: own requests only · Admin: every farmer
  const query = useConnections({ page, size, keyword, status, farmerId: isFarmer ? farmer.id : undefined });
  const resolve = useResolveConnection();

  const columns: Column<ConnectionRequest>[] = isFarmer
    ? baseColumns
    : [
        farmerColumn,
        ...baseColumns,
        {
          key: "actions",
          label: "Xác nhận",
          render: (_, c) =>
            c.status === "PENDING" ? (
              <div className="flex gap-1">
                <Button size="sm" variant="outline" className="h-7 text-emerald-700" onClick={() => setResolving({ request: c, status: "SUCCESS" })}>
                  <Check className="mr-1 h-3.5 w-3.5" />
                  Thành công
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-rose-600" onClick={() => setResolving({ request: c, status: "FAILED" })}>
                  <X className="mr-1 h-3.5 w-3.5" />
                  Không
                </Button>
              </div>
            ) : (
              <span className="whitespace-nowrap text-xs tabular-nums text-slate-500">
                {c.resolvedAt ? dayjs(c.resolvedAt).format("DD/MM/YYYY") : ""}
              </span>
            ),
        },
      ];

  const handleResolve = async (note: string) => {
    if (!resolving) return;
    try {
      await resolve.mutateAsync({ id: resolving.request.id, status: resolving.status, note: note || undefined });
      toast({
        title: "Đã cập nhật",
        description: resolving.status === "SUCCESS" ? "Kết nối thành công, tin đăng đã được đóng." : "Đã ghi nhận kết nối không thành công.",
      });
      setResolving(null);
    } catch (error) {
      toast({ title: "Không thể cập nhật", description: (error as Error).message, variant: "destructive" });
    }
  };

  return (
    <PageWrapper
      title="Lịch sử kết nối"
      description={isFarmer ? "Các nhà máy bạn đã đăng ký kết nối và trạng thái" : "Yêu cầu kết nối của tất cả nông hộ — xác nhận kết quả để đóng tin đăng"}
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder={isFarmer ? "Tìm theo nhà máy, máy..." : "Tìm theo nông hộ, SĐT, nhà máy..."}
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
        currentIndex={page}
        totalElements={query.data?.totalElements}
        totalPages={query.data?.totalPages}
        onPageSize={(next) => {
          setSize(next);
          setPage(0);
        }}
        onIndexChange={setPage}
      />

      <ResolveDialog
        key={resolving ? `${resolving.request.id}-${resolving.status}` : "none"}
        target={resolving} loading={resolve.isPending} onOpenChange={(o) => !o && setResolving(null)} onConfirm={handleResolve} />
    </PageWrapper>
  );
}
