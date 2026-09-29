import {
  Button,
  DataTable,
  DeleteDialog,
  useToast,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRef, useState } from "react";
import { useSearch } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import {
  useCloseSchedule,
  useCreateSchedule,
  useSchedules,
  useUpdateSchedule,
  type ScheduleFormValues,
  type ScheduleRow,
} from "@/features/processing-schedule";
import { useIsFactoryAdmin } from "@/features/viewer";
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
  const [editingSchedule, setEditingSchedule] = useState<ScheduleRow | null>(
    null,
  );

  const create = useCreateSchedule();
  const update = useUpdateSchedule();
  const close = useCloseSchedule();
  const [factoryId, setFactoryId] = useState<string | undefined>();
  const [keyword, setKeyword] = useState("");
  const activeQuery = useSchedules({
    page: 0,
    size: 100,
    keyword,
    status: "ACTIVE",
    factoryId,
  });
  const active = activeQuery.data?.content ?? [];

  const handleEditClick = (s: ScheduleRow) => {
    setEditingSchedule(s);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Admin: view only — no editing / closing posts
  const isAdmin = useIsFactoryAdmin();
  const factoryFilter = useFactoryFilter();
  const columns: Column<ScheduleRow>[] = isAdmin
    ? scheduleColumns
    : [
        ...scheduleColumns,
        {
          key: "actions",
          label: "",
          render: (_, s) => (
            <div className="flex items-center justify-end gap-1.5">
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
            </div>
          ),
        },
      ];

  const handleSubmit = async (values: ScheduleFormValues) => {
    try {
      if (editingSchedule) {
        await update.mutateAsync({ id: editingSchedule.id, values });
        toast({
          title: "Đã cập nhật tin đăng",
          description: `Lịch nhận chế biến cho "${editingSchedule.machineName}" đã được cập nhật thành công.`,
        });
        setEditingSchedule(null);
        return true;
      }

      await create.mutateAsync(values);
      toast({
        title: "Đã đăng tin",
        description: `${values.machineIds.length} máy / dây chuyền đã sẵn sàng nhận chế biến trong khoảng thời gian này.`,
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
        <div ref={formRef}>
          <ScheduleForm
            machineId={machineId}
            editingSchedule={editingSchedule}
            isSubmitting={create.isPending || update.isPending}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingSchedule(null)}
          />
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Tin đang mở ({active.length})
          </h2>
          <DataTable
            columns={columns}
            data={active}
            loading={activeQuery.isFetching}
            searchable
            searchPlaceholder="Tìm theo máy, nhà máy..."
            onSearch={setKeyword}
            // Admin sees every factory's posts — filter by factory
            filters={isAdmin ? [factoryFilter.filter] : undefined}
            onFilterChange={(_key, value) =>
              setFactoryId(value && value !== "all" ? value : undefined)
            }
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
