import { DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import { useSchedules } from "@/features/processing-schedule";
import { scheduleColumns, scheduleFilters } from "./components/schedule-columns";

export default function ScheduleHistoryPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const query = useSchedules({ page, size, keyword, status });

  return (
    <PageWrapper title="Lịch sử đăng tin" description="Toàn bộ lịch nhận chế biến đã đăng">
      <DataTable
        columns={scheduleColumns}
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
    </PageWrapper>
  );
}
