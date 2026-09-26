import { Button, DataTable, DeleteDialog, useToast, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useSearch } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { useCloseSchedule, useCreateSchedule, useSchedules, type ScheduleFormValues, type ScheduleRow } from "@/features/processing-schedule";
import { scheduleColumns } from "./components/schedule-columns";
import { ScheduleForm } from "./components/ScheduleForm";

/** "Đăng tin": post a processing window + manage the ones still open */
export default function ProcessingSchedulePage() {
  const { toast } = useToast();
  const machineId = new URLSearchParams(useSearch()).get("machineId") ?? undefined;
  const [closing, setClosing] = useState<ScheduleRow | null>(null);

  const create = useCreateSchedule();
  const close = useCloseSchedule();
  const activeQuery = useSchedules({ page: 0, size: 100, status: "ACTIVE" });
  const active = activeQuery.data?.content ?? [];
  const columns: Column<ScheduleRow>[] = [
    ...scheduleColumns,
    {
      key: "actions",
      label: "",
      render: (_, s) => (
        <Button variant="outline" size="sm" className="h-7" onClick={() => setClosing(s)}>
          Đóng tin
        </Button>
      ),
    },
  ];

  const handleSubmit = async (values: ScheduleFormValues) => {
    try {
      await create.mutateAsync(values);
      toast({ title: "Đã đăng tin", description: `${values.machineIds.length} máy / dây chuyền đã sẵn sàng nhận chế biến trong khoảng thời gian này.` });
      return true;
    } catch (error) {
      toast({ title: "Không thể đăng tin", description: (error as Error).message, variant: "destructive" });
      return false;
    }
  };

  return (
    <PageWrapper title="Lịch nhận chế biến" description="Đăng lịch nhận chế biến theo từng đợt cho máy / dây chuyền">
      <div className="space-y-6">
        <ScheduleForm machineId={machineId} isSubmitting={create.isPending} onSubmit={handleSubmit} />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">Tin đang mở ({active.length})</h2>
          <DataTable
            columns={columns}
            data={active}
            loading={activeQuery.isFetching}
            searchable={false}
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
