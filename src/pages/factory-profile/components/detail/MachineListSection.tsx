import { Thumbnail } from "@/components/common/Thumbnail";
import {
  Button,
  DeleteDialog,
  Input,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Gauge,
  Layers,
  Pencil,
  Plus,
  Search,
  Sprout,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DetailCard, DetailField } from "@/components/common/DetailCard";
import type { FactoryProfile } from "@/features/factory";
import {
  useAdminDeleteFactoryMachine,
  useAdminFactoryMachines,
  useCreateFactoryMachine,
  useDeleteFactoryMachine,
  useFactoryMachines,
  useUpdateFactoryMachine,
  type FactoryMachineInput,
  type FactoryMachineItem,
} from "@/features/machine";
import { useIsFactoryAdmin } from "@/features/viewer";
import { MachineFormDialog } from "@/pages/machine/components/MachineFormDialog";
import type { MachineDialogValues } from "@/pages/machine/components/machine-form-schema";

const fmt = new Intl.NumberFormat("vi-VN");

const CAPACITY_UNIT_LABELS: Record<string, string> = {
  KG_PER_MONTH: "kg/tháng",
  TONNE_PER_MONTH: "tấn/tháng",
};

const STATUS_META: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Đang hoạt động",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  PAUSED: {
    label: "Tạm dừng",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

function Chips({ items, className }: { items: string[]; className: string }) {
  if (!items.length) return <span className="text-xs text-slate-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t, idx) => (
        <span
          key={`${t}-${idx}`}
          className={`rounded-md border px-2 py-0.5 text-xs font-medium ${className}`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

const toDialogValues = (m: FactoryMachineItem): MachineDialogValues => ({
  id: m.id,
  name: m.name,
  imageUrl: m.imageUrl ?? "",
  status: m.status,
  processingServiceIds: (m.processingServices ?? []).map((s) => s.id),
  maxCapacity: m.maxCapacity,
  capacityUnit: m.capacityUnit,
  productGroupIds: (m.productGroups ?? []).map((g) => g.id),
});

/** `readOnly`: viewing another factory / farmer view — no add / edit / delete */
export function MachineListSection({
  factory,
  readOnly,
}: {
  factory: FactoryProfile;
  readOnly?: boolean;
}) {
  const { toast } = useToast();
  const isAdmin = useIsFactoryAdmin();
  const profileId = factory?.id ? Number(factory.id) : undefined;

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Member gets own factory machines; Admin gets machines scoped to profileId
  const memberQuery = useFactoryMachines(
    { keyword: debouncedKeyword, page: 0, size: 100 },
    { enabled: !isAdmin && !readOnly },
  );
  const adminQuery = useAdminFactoryMachines(
    { profileId, keyword: debouncedKeyword, page: 0, size: 100 },
    { enabled: isAdmin && !!profileId },
  );

  const query = isAdmin ? adminQuery : memberQuery;
  const machines = query.data?.content ?? [];
  const title = `Máy móc & công suất (${machines.length} máy)`;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<FactoryMachineItem | null>(null);
  const [deleting, setDeleting] = useState<FactoryMachineItem | null>(null);

  const createMachine = useCreateFactoryMachine();
  const updateMachine = useUpdateFactoryMachine();
  const deleteMemberMachine = useDeleteFactoryMachine();
  const deleteAdminMachine = useAdminDeleteFactoryMachine();

  const editingValues = useMemo(
    () => (editing ? toDialogValues(editing) : undefined),
    [editing],
  );

  const fail = (titleMsg: string, error: unknown) => {
    const err = error as { status?: number; response?: { status?: number } };
    const is409 =
      err?.status === 409 ||
      err?.response?.status === 409 ||
      (error as Error)?.message?.includes("đang được sử dụng");

    toast({
      title: titleMsg,
      description: is409
        ? "Máy đang có lịch nhận chế biến hoặc dữ liệu liên quan. Vui lòng chuyển trạng thái máy sang tạm dừng hoặc xóa các lịch nhận chế biến trước."
        : (error as Error).message,
      variant: "destructive",
    });
  };

  const openForm = (machine: FactoryMachineItem | null) => {
    setEditing(machine);
    setFormOpen(true);
  };

  const handleSubmit = async (values: MachineDialogValues) => {
    try {
      const payload: FactoryMachineInput = {
        name: values.name.trim(),
        imageUrl: values.imageUrl?.trim() || null,
        status: values.status,
        processingServiceIds: values.processingServiceIds.map((id) =>
          Number(id),
        ),
        maxCapacity: values.maxCapacity,
        capacityUnit: values.capacityUnit,
        productGroupIds: values.productGroupIds.map((id) => Number(id)),
      };

      if (editing?.id) {
        await updateMachine.mutateAsync({ id: editing.id, input: payload });
        toast({
          title: "Thành công",
          description: `Đã cập nhật máy "${values.name}".`,
        });
      } else {
        await createMachine.mutateAsync(payload);
        toast({
          title: "Thành công",
          description: `Đã thêm máy "${values.name}".`,
        });
      }
      setFormOpen(false);
      setEditing(null);
    } catch (error) {
      fail("Không thể lưu", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      if (isAdmin) {
        await deleteAdminMachine.mutateAsync(deleting.id);
      } else {
        await deleteMemberMachine.mutateAsync(deleting.id);
      }
      toast({
        title: "Đã xóa",
        description: `Đã xóa máy "${deleting.name}".`,
      });
      setDeleting(null);
    } catch (error) {
      fail("Không thể xóa", error);
    }
  };

  const isSaving = createMachine.isPending || updateMachine.isPending;
  const isDeleting =
    deleteMemberMachine.isPending || deleteAdminMachine.isPending;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm theo tên máy, mã máy..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 pr-8"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {!readOnly && (
          <Button onClick={() => openForm(null)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Thêm máy
          </Button>
        )}
      </div>

      {query.isLoading ? (
        <div className="grid gap-5 xl:grid-cols-2 xl:gap-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
            />
          ))}
        </div>
      ) : machines.length === 0 ? (
        <DetailCard icon={Wrench} title={title}>
          <p className="text-sm text-slate-500">
            {debouncedKeyword
              ? `Không tìm thấy máy móc phù hợp với từ khóa "${debouncedKeyword}".`
              : "Chưa có máy móc / dây chuyền nào được khai báo cho cơ sở này."}
          </p>
          {debouncedKeyword && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setKeyword("")}
              className="mt-3 text-xs"
            >
              Xóa tìm kiếm
            </Button>
          )}
        </DetailCard>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2 xl:gap-6">
          {machines.map((m) => {
            const statusInfo = STATUS_META[m.status] ?? {
              label: m.status,
              className: "border-slate-200 bg-slate-100 text-slate-700",
            };
            const unit = CAPACITY_UNIT_LABELS[m.capacityUnit] ?? m.capacityUnit;
            const serviceNames = (m.processingServices ?? []).map(
              (s) => s.name,
            );
            const productGroupNames = (m.productGroups ?? []).map(
              (g) => g.name,
            );

            return (
              <section
                key={m.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 sm:py-4">
                  {m.imageUrl ? (
                    <Thumbnail src={m.imageUrl} alt={m.name} size="lg" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                      <Wrench className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        {m.code || "MÁY MÓC"}
                      </p>
                    </div>
                    <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                      {m.name}
                    </h3>
                  </div>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                  {!readOnly && (
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
                  )}
                </header>

                <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-4 sm:p-5">
                  <div className="col-span-2">
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
                  </div>

                  <div className="col-span-2">
                    <DetailField
                      icon={Layers}
                      label="Dịch vụ chế biến"
                      iconClassName="text-emerald-500"
                    >
                      <Chips
                        items={serviceNames}
                        className="border-emerald-100 bg-emerald-50 text-emerald-700"
                      />
                    </DetailField>
                  </div>

                  <div className="col-span-2">
                    <DetailField
                      icon={Sprout}
                      label="Nhóm nông sản / sản phẩm"
                      iconClassName="text-lime-600"
                    >
                      <Chips
                        items={productGroupNames}
                        className="border-lime-100 bg-lime-50 text-lime-700"
                      />
                    </DetailField>
                  </div>
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
        isSubmitting={isSaving}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        description={`Xóa máy "${deleting?.name ?? ""}"?`}
      />
    </div>
  );
}
