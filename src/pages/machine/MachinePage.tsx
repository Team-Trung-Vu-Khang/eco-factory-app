import { Button, DataTable, DeleteDialog, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import PageWrapper from "@/components/common/PageWrapper";
import { useDeleteMachine, useMachines, useSaveMachine, type MachineListParams, type MachineRow } from "@/features/factory";
import { machineColumns, machineFilters } from "./components/machine-columns";
import { MachineFormDialog } from "./components/MachineFormDialog";
import type { MachineDialogValues } from "./components/machine-form-schema";

type Filters = Pick<MachineListParams, "status" | "function">;

const toDialogValues = (m: MachineRow): MachineDialogValues => ({
  factoryId: m.factoryId,
  id: m.id,
  name: m.name,
  functions: m.functions,
  productGroupIds: m.productGroupIds,
  maxCapacity: m.maxCapacity,
  capacityUnit: m.capacityUnit,
  status: m.status,
  certificateIds: m.certificateIds ?? [],
});

export default function MachinePage() {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MachineRow | null>(null);
  const [deleting, setDeleting] = useState<MachineRow | null>(null);

  const query = useMachines({ page, size, keyword, ...filters });
  const save = useSaveMachine();
  const remove = useDeleteMachine();
  const editingValues = useMemo(() => (editing ? toDialogValues(editing) : undefined), [editing]);

  const fail = (title: string, error: unknown) => toast({ title, description: (error as Error).message, variant: "destructive" });

  const handleSubmit = async ({ factoryId, ...values }: MachineDialogValues) => {
    try {
      await save.mutateAsync({ factoryId, values, machineId: editing?.id });
      toast({ title: "Thành công", description: editing ? "Đã cập nhật máy / dây chuyền." : "Đã thêm máy / dây chuyền." });
      setFormOpen(false);
    } catch (error) {
      fail("Không thể lưu", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync({ factoryId: deleting.factoryId, machineId: deleting.id });
      toast({ title: "Đã xóa", description: `Đã xóa "${deleting.name}".` });
    } catch (error) {
      fail("Không thể xóa", error);
    }
    setDeleting(null);
  };

  return (
    <PageWrapper
      title="Máy & Dây chuyền"
      description="Chức năng chính, công suất, chứng nhận và lịch nhận chế biến của từng máy"
      actions={
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm máy
        </Button>
      }
    >
      <DataTable
        columns={machineColumns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder="Tìm theo tên máy, nhà máy..."
        onSearch={(v) => {
          setKeyword(v);
          setPage(0);
        }}
        filters={machineFilters}
        onFilterChange={(key, value) => {
          setFilters((prev) => ({ ...prev, [key]: value && value !== "all" ? value : undefined }));
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
        onEdit={(m) => {
          setEditing(m);
          setFormOpen(true);
        }}
        onDelete={setDeleting}
      />

      <MachineFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialValues={editingValues}
        isSubmitting={save.isPending}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleConfirmDelete}
        loading={remove.isPending}
        description={`Xóa máy "${deleting?.name ?? ""}" khỏi ${deleting?.factoryName ?? ""}?`}
      />
    </PageWrapper>
  );
}
