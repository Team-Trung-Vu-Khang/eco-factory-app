import {
  Button,
  DeleteDialog,
  useIsMobile,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable, type Column } from "@/components/common/DataTable";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import {
  SCHEDULE_HISTORY_FILTER_OPTIONS,
  useAdminSchedules,
  useCloseSchedule,
  useSchedules,
  type ScheduleRow,
} from "@/features/processing-schedule";
import { useFactoryFilter } from "./components/useFactoryFilter";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";
import { MobileScheduleList } from "./components/MobileScheduleList";
import { scheduleColumns } from "./components/schedule-columns";

export default function ScheduleHistoryPage() {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [closing, setClosing] = useState<ScheduleRow | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  // Admin: every factory (filterable) · factory: its own posts only
  const factoryOptions = useFactoryFilter();
  const isAdmin = factoryOptions.isAdmin;
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();
  // Mobile app (factory member): history as cards with status chips
  const mobileApp = isMobile && mobileUiMode === "app";
  const [factoryId, setFactoryId] = useState<string | undefined>();

  const queryParams = {
    page,
    size,
    keyword: debouncedKeyword.trim() || undefined,
    status: status || undefined,
    profileId: factoryOptions.scope(factoryId)
      ? Number(factoryOptions.scope(factoryId))
      : undefined,
  };

  const memberQuery = useSchedules(queryParams, {
    enabled: !isAdmin && !mobileApp,
  });
  const adminQuery = useAdminSchedules(queryParams, {
    enabled: isAdmin && !mobileApp,
  });
  const query = isAdmin ? adminQuery : memberQuery;
  const close = useCloseSchedule();

  const historyFilters = [
    {
      key: "status",
      label: "Trạng thái",
      options: SCHEDULE_HISTORY_FILTER_OPTIONS,
    },
  ];

  // Admin: view only — no closing posts
  const columns: Column<ScheduleRow>[] = isAdmin
    ? scheduleColumns
    : [
        ...scheduleColumns,
        {
          key: "actions",
          label: "",
          render: (_, s) =>
            s.status === "OPEN" && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => setClosing(s)}
              >
                Đóng tin
              </Button>
            ),
        },
      ];

  const closeDialog = (
    <DeleteDialog
      open={!!closing}
      onOpenChange={(o) => !o && setClosing(null)}
      onConfirm={async () => {
        if (!closing) return;
        try {
          await close.mutateAsync(closing.id);
          toast({
            title: "Đã đóng tin",
            description: `${closing.machine?.name ?? "Máy"} không còn nhận kết nối mới.`,
          });
          setClosing(null);
        } catch (error) {
          toast({
            title: "Không thể đóng tin",
            description: (error as Error).message,
            variant: "destructive",
          });
        }
      }}
      loading={close.isPending}
      title="Đóng tin đăng?"
      description={`Đóng lịch nhận chế biến của "${closing?.machine?.name ?? ""}"? Nông hộ sẽ không tìm thấy lịch này nữa.`}
    />
  );

  if (mobileApp)
    return (
      <>
        <MobileScheduleList
          variant="history"
          admin={isAdmin}
          // Admin history is view-only, as on desktop
          onClose={isAdmin ? undefined : setClosing}
        />
        {closeDialog}
      </>
    );

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
        searchPlaceholder="Tìm theo máy, nhà máy, tiêu đề..."
        onSearch={(v) => {
          setKeyword(v);
          setPage(0);
        }}
        filters={
          isAdmin ? [factoryOptions.filter, ...historyFilters] : historyFilters
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
        onPageSize={(s) => {
          setSize(s);
          setPage(0);
        }}
        onIndexChange={(index) => setPage(Math.max(0, index - 1))}
        columnToggleable={false}
        downloadable={false}
      />

      {closeDialog}
    </PageWrapper>
  );
}
