import { Button, DataTable, DeleteDialog, useToast, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import { useCloseSchedule, useSchedules, type ScheduleRow } from "@/features/processing-schedule";
import { scheduleColumns, scheduleFilters } from "./components/schedule-columns";

export default function ScheduleHistoryPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [closing, setClosing] = useState<ScheduleRow | null>(null);
  const query = useSchedules({ page, size, keyword, status });
  const close = useCloseSchedule();

  const columns: Column<ScheduleRow>[] = [
    ...scheduleColumns,
    {
      key: "actions",
      label: "",
      render: (_, s) =>
        s.displayStatus === "ACTIVE" && (
          <Button variant="outline" size="sm" className="h-7" onClick={() => setClosing(s)}>
            Đóng tin
          </Button>
        ),
    },
  ];

  return (
    <PageWrapper title="Lịch sử đăng tin" description="Toàn bộ lịch nhận chế biến đã đăng">
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
        filters={scheduleFilters}
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

      <DeleteDialog
        open={!!closing}
        onOpenChange={(o) => !o && setClosing(null)}
        onConfirm={async () => {
          if (!closing) return;
          await close.mutateAsync(closing.id);
          toast({ title: "Đã đóng tin", description: `${closing.machineName} không còn nhận kết nối mới.` });
          setClosing(null);
        }}
        loading={close.isPending}
        title="Đóng tin đăng?"
        description={`Đóng lịch nhận chế biến của "${closing?.machineName ?? ""}"? Nông hộ sẽ không tìm thấy lịch này nữa.`}
      />
    </PageWrapper>
  );
}
