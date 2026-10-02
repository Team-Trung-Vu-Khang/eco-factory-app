import {
  Button,
  DeleteDialog,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable, type Column } from "@/components/common/DataTable";
import { useEffect, useRef, useState } from "react";
import { useSearch } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import {
  useAdminDeleteSchedule,
  useAdminSchedules,
  useCloseSchedule,
  useCreateSchedule,
  useSchedules,
  useUpdateSchedule,
  type ScheduleFormValues,
  type ScheduleRow,
} from "@/features/processing-schedule";
import { useFactoryFilter } from "./components/useFactoryFilter";
import { scheduleColumns } from "./components/schedule-columns";
import { ScheduleForm } from "./components/ScheduleForm";

/** "Đăng tin": post a processing window + manage the ones still open */
export default function ProcessingSchedulePage() {
  const { toast } = useToast();
  const machineId =
    new URLSearchParams(useSearch()).get("machineId") ?? undefined;
  const formRef = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState<ScheduleRow | null>(null);
  const [deleting, setDeleting] = useState<ScheduleRow | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleRow | null>(
    null,
  );

  const create = useCreateSchedule();
  const update = useUpdateSchedule();
  const close = useCloseSchedule();
  const remove = useAdminDeleteSchedule();

  // Admin: every factory (filterable) · factory: its own posts only
  const factoryFilter = useFactoryFilter();
  const isAdmin = factoryFilter.isAdmin;
  const [factoryId, setFactoryId] = useState<string | undefined>();
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

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
    status: "OPEN",
    profileId: factoryFilter.scope(factoryId)
      ? Number(factoryFilter.scope(factoryId))
      : undefined,
  };

  const memberQuery = useSchedules(queryParams, { enabled: !isAdmin });
  const adminQuery = useAdminSchedules(queryParams, { enabled: isAdmin });
  const activeQuery = isAdmin ? adminQuery : memberQuery;
  const active = activeQuery.data?.content ?? [];
  const totalElements = activeQuery.data?.totalElements ?? active.length;
  const totalPages = activeQuery.data?.totalPages ?? 1;

  const handleEditClick = (s: ScheduleRow) => {
    setEditingSchedule(s);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Actions column
  const columns: Column<ScheduleRow>[] = [
    ...scheduleColumns,
    {
      key: "actions",
      label: "",
      render: (_, s) => (
        <div className="flex items-center justify-end gap-1.5">
          {!isAdmin ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-primary hover:text-primary"
                onClick={() => handleEditClick(s)}
              >
                Sửa
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => setClosing(s)}
              >
                Đóng tin
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => setDeleting(s)}
            >
              Xóa
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleSubmit = async (values: ScheduleFormValues) => {
    try {
      const payload = {
        title: values.title,
        machineId: Number(values.machineId),
        startDate: values.startDate,
        endDate: values.endDate,
        maxCapacity: values.maxCapacity,
        capacityUnit: values.capacityUnit,
        note: values.note || undefined,
      };

      if (editingSchedule) {
        await update.mutateAsync({ id: editingSchedule.id, values: payload });
        toast({
          title: "Đã cập nhật tin đăng",
          description: `Lịch nhận chế biến cho "${editingSchedule.machine?.name ?? ""}" đã được cập nhật thành công.`,
        });
        setEditingSchedule(null);
        return true;
      }

      await create.mutateAsync(payload);
      toast({
        title: "Đã đăng tin",
        description: "Lịch nhận chế biến đã sẵn sàng nhận kết nối từ nông hộ.",
      });
      return true;
    } catch (error) {
      toast({
        title: editingSchedule
          ? "Không thể cập nhật tin đăng"
          : "Không thể đăng tin",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <PageWrapper
      title="Lịch nhận chế biến"
      description="Đăng lịch nhận chế biến theo từng đợt cho máy / dây chuyền"
    >
      <div className="space-y-6">
        {!isAdmin && (
          <div ref={formRef}>
            <ScheduleForm
              machineId={machineId}
              editingSchedule={editingSchedule}
              isSubmitting={create.isPending || update.isPending}
              onSubmit={handleSubmit}
              onCancelEdit={() => setEditingSchedule(null)}
            />
          </div>
        )}

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Tin đang mở ({totalElements})
          </h2>
          <DataTable
            columns={columns}
            data={active}
            loading={activeQuery.isFetching}
            searchable
            searchPlaceholder="Tìm theo máy, nhà máy, tiêu đề..."
            onSearch={(val) => {
              setKeyword(val);
              setPage(0);
            }}
            // Admin sees every factory's posts — filter by factory
            filters={isAdmin ? [factoryFilter.filter] : undefined}
            onFilterChange={(_key, value) => {
              setFactoryId(value && value !== "all" ? value : undefined);
              setPage(0);
            }}
            pageSize={size}
            currentIndex={page + 1}
            totalElements={totalElements}
            totalPages={totalPages}
            onPageSize={(s) => {
              setSize(s);
              setPage(0);
            }}
            onIndexChange={(index) => setPage(Math.max(0, index - 1))}
            columnToggleable={false}
            downloadable={false}
          />
        </section>
      </div>

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

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.id);
            toast({
              title: "Đã xóa tin đăng",
              description: `Đã xóa lịch nhận chế biến của "${deleting.machine?.name ?? ""}".`,
            });
            setDeleting(null);
          } catch (error) {
            const err = error as {
              status?: number;
              response?: { status?: number };
            };
            const is409 =
              err?.status === 409 ||
              err?.response?.status === 409 ||
              (error as Error)?.message?.includes("đang được sử dụng");

            toast({
              title: "Không thể xóa tin",
              description: is409
                ? "Lịch nhận chế biến đang có yêu cầu kết nối liên quan. Vui lòng đóng lịch thay vì xóa."
                : (error as Error).message,
              variant: "destructive",
            });
          }
        }}
        loading={remove.isPending}
        title="Xóa tin đăng?"
        description={`Xóa vĩnh viễn lịch nhận chế biến của "${deleting?.machine?.name ?? ""}" khỏi hệ thống?`}
      />
    </PageWrapper>
  );
}
