import {
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import {
  useCloseSchedule,
  useSchedules,
  type ScheduleRow,
} from "@/features/processing-schedule";
import { useIsFactoryAdmin } from "@/features/viewer";
import { useFactoryFilter } from "./components/useFactoryFilter";
import {
  scheduleColumns,
  scheduleFilters,
} from "./components/schedule-columns";

export default function ScheduleHistoryPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [closing, setClosing] = useState<ScheduleRow | null>(null);
  const [factoryId, setFactoryId] = useState<string | undefined>();
  const query = useSchedules({ page, size, keyword, status, factoryId });
  const close = useCloseSchedule();

  // Admin: view only — no closing posts
  const isAdmin = useIsFactoryAdmin();
  const factoryOptions = useFactoryFilter();
  const columns: Column<ScheduleRow>[] = isAdmin
    ? scheduleColumns
    : [
        ...scheduleColumns,
        {
          key: "actions",
          label: "",
          render: (_, s) =>
            s.displayStatus === "ACTIVE" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={() => setClosing(s)}
              >
                Đóng tin
              </Button>
            ),
        },
      ];

  return (
    <PageWrapper
      title="Lịch sử đăng tin"
      description="Toàn bộ lịch nhận chế biến đã đăng"
    >
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder="Tìm theo máy, nhà máy..."
        onSearch={(v) => {
          setKeyword(v);
          setPage(0);
        }}
        filters={
          isAdmin
            ? [factoryOptions.filter, ...scheduleFilters]
            : scheduleFilters
        }
        onFilterChange={(key, value) => {
          const next = value && value !== "all" ? value : undefined;
          if (key === "factoryId") setFactoryId(next);
          else setStatus(next);
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
      />

      <DeleteDialog
        open={!!closing}
        onOpenChange={(o) => !o && setClosing(null)}
        onConfirm={async () => {
          if (!closing) return;
          await close.mutateAsync(closing.id);
          toast({
            title: "Đã đóng tin",
            description: `${closing.machineName} không còn nhận kết nối mới.`,
          });
          setClosing(null);
        }}
        loading={close.isPending}
        title="Đóng tin đăng?"
        description={`Đóng lịch nhận chế biến của "${closing?.machineName ?? ""}"? Nông hộ sẽ không tìm thấy lịch này nữa.`}
      />
    </PageWrapper>
  );
}
