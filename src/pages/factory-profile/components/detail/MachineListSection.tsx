import {
  Button,
  DeleteDialog,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import {
  CalendarRange,
  Gauge,
  Layers,
  PackageCheck,
  Pencil,
  Plus,
  Sprout,
  Trash2,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  useDeleteMachine,
  useSaveMachine,
  type Machine,
  CAPACITY_UNIT_LABELS,
  MACHINE_STATUS_LABELS,
  PROCESSING_SERVICE_LABELS,
  PRODUCT_GROUP_LABELS,
  type Factory,
} from "@/features/factory";
import { DetailCard, DetailField } from "@/components/common/DetailCard";
import { MachineFormDialog } from "@/pages/machine/components/MachineFormDialog";
import type { MachineDialogValues } from "@/pages/machine/components/machine-form-schema";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "…");

function Chips({ items, className }: { items: string[]; className: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className={`rounded-md border px-2 py-0.5 text-xs font-medium ${className}`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const toDialogValues = (
  factoryId: string,
  m: Machine,
): MachineDialogValues => ({
  factoryId,
  id: m.id,
  name: m.name,
  functions: m.functions,
  productGroupIds: m.productGroupIds,
  maxCapacity: m.maxCapacity,
  capacityUnit: m.capacityUnit,
  status: m.status,
  certificateIds: m.certificateIds ?? [],
});

export function MachineListSection({ factory }: { factory: Factory }) {
  const title = `Máy móc & công suất (${factory.machines.length} máy)`;
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Machine | null>(null);
  const [deleting, setDeleting] = useState<Machine | null>(null);
  const save = useSaveMachine();
  const remove = useDeleteMachine();
  const editingValues = useMemo(
    () => (editing ? toDialogValues(factory.id, editing) : undefined),
    [editing, factory.id],
  );

  const fail = (title: string, error: unknown) =>
    toast({
      title,
      description: (error as Error).message,
      variant: "destructive",
    });

  const openForm = (machine: Machine | null) => {
    setEditing(machine);
    setFormOpen(true);
  };

  const handleSubmit = async ({
    factoryId,
    ...values
  }: MachineDialogValues) => {
    try {
      await save.mutateAsync({ factoryId, values, machineId: editing?.id });
      toast({
        title: "Thành công",
        description: editing
          ? "Đã cập nhật máy / dây chuyền."
          : "Đã thêm máy / dây chuyền.",
      });
      setFormOpen(false);
    } catch (error) {
      fail("Không thể lưu", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync({
        factoryId: factory.id,
        machineId: deleting.id,
      });
      toast({ title: "Đã xóa", description: `Đã xóa "${deleting.name}".` });
    } catch (error) {
      fail("Không thể xóa", error);
    }
    setDeleting(null);
  };

  const isEmpty =
    !factory.offersExternalCapacity || factory.machines.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => openForm(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm máy
        </Button>
      </div>

      {isEmpty ? (
        <DetailCard icon={Wrench} title={title}>
          <p className="text-sm text-slate-500">
            Cơ sở chưa cung cấp năng lực chế biến cho bên ngoài.
          </p>
        </DetailCard>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2 xl:gap-6">
          {factory.machines.map((m) => {
            const active = m.status === "ACTIVE";
            const unit = CAPACITY_UNIT_LABELS[m.capacityUnit];
            return (
              <section
                key={m.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                      Máy móc
                    </p>
                    <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                      {m.name}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                      active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {MACHINE_STATUS_LABELS[m.status]}
                  </span>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Chỉnh sửa máy"
                      onClick={() => openForm(m)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600 hover:text-rose-700"
                      aria-label="Xóa máy"
                      onClick={() => setDeleting(m)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-4 sm:p-5">
                  <DetailField
                    icon={Gauge}
                    label="Công suất tối đa"
                    iconClassName="text-blue-500"
                  >
                    <span className="text-xl font-bold text-slate-900 tabular-nums">
                      {fmt.format(m.maxCapacity)}
                    </span>
                    <span className="ml-1 text-sm font-normal text-slate-500">
                      {unit}
                    </span>
                  </DetailField>
                  <DetailField
                    icon={PackageCheck}
                    label="Đang nhận"
                    iconClassName="text-emerald-500"
                  >
                    {m.availableCapacity > 0 ? (
                      <>
                        <span className="text-xl font-bold text-emerald-600 tabular-nums">
                          {fmt.format(m.availableCapacity)}
                        </span>
                        <span className="ml-1 text-sm font-normal text-slate-500">
                          {
                            CAPACITY_UNIT_LABELS[
                              m.availableUnit ?? m.capacityUnit
                            ]
                          }
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-normal text-slate-400">
                        Chưa đăng lịch
                      </span>
                    )}
                  </DetailField>
                  <div className="col-span-2">
                    <DetailField
                      icon={Layers}
                      label="Dịch vụ"
                      iconClassName="text-emerald-500"
                    >
                      <Chips
                        items={m.functions.map(
                          (f) => PROCESSING_SERVICE_LABELS[f],
                        )}
                        className="border-emerald-100 bg-emerald-50 text-emerald-700"
                      />
                    </DetailField>
                  </div>
                  <div className="col-span-2">
                    <DetailField
                      icon={Sprout}
                      label="Nhóm nông sản"
                      iconClassName="text-lime-600"
                    >
                      <Chips
                        items={m.productGroupIds.map(
                          (id) => PRODUCT_GROUP_LABELS[id] ?? id,
                        )}
                        className="border-lime-100 bg-lime-50 text-lime-700"
                      />
                    </DetailField>
                  </div>
                  {m.availableCapacity > 0 && (
                    <div className="col-span-2">
                      <DetailField
                        icon={CalendarRange}
                        label="Lịch nhận chế biến"
                        iconClassName="text-violet-500"
                      >
                        <span className="text-sm font-medium tabular-nums">
                          {date(m.availableFrom)} → {date(m.availableTo)}
                        </span>
                      </DetailField>
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <MachineFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={editingValues}
        factoryId={factory.id}
        isSubmitting={save.isPending}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleConfirmDelete}
        loading={remove.isPending}
        description={`Xóa máy "${deleting?.name ?? ""}"?`}
      />
    </div>
  );
}
