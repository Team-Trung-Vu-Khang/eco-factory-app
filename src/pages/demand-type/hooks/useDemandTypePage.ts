import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import {
  useCreateDemandType,
  useDeleteDemandType,
  useDemandTypes,
  useUpdateDemandType,
  type DemandType,
  type DemandTypeFormValues,
} from "@/features/demand-type";

const toFormValues = (t: DemandType): DemandTypeFormValues => ({
  name: t.name,
  code: t.code,
  processingServices: t.processingServices,
  description: t.description ?? "",
  isActive: t.isActive,
});

export function useDemandTypePage() {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [isActive, setIsActive] = useState<string | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DemandType | null>(null);
  const [deleting, setDeleting] = useState<DemandType | null>(null);

  const query = useDemandTypes({ page, size, keyword, isActive });
  const createMutation = useCreateDemandType();
  const updateMutation = useUpdateDemandType();
  const deleteMutation = useDeleteDemandType();
  const editingValues = useMemo(() => (editing ? toFormValues(editing) : undefined), [editing]);

  const fail = (title: string, error: unknown) =>
    toast({ title, description: (error as Error).message, variant: "destructive" });

  return {
    data: query.data?.content ?? [],
    totalElements: query.data?.totalElements,
    totalPages: query.data?.totalPages,
    loading: query.isFetching,
    page,
    size,
    setPage,
    handlePageSize: (next: number) => {
      setSize(next);
      setPage(0);
    },
    handleSearch: (value: string) => {
      setKeyword(value);
      setPage(0);
    },
    handleFilterChange: (_key: string, value: string) => {
      setIsActive(value && value !== "all" ? value : undefined);
      setPage(0);
    },

    formOpen,
    setFormOpen,
    editingValues,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    openCreate: () => {
      setEditing(null);
      setFormOpen(true);
    },
    openEdit: (t: DemandType) => {
      setEditing(t);
      setFormOpen(true);
    },
    handleSubmit: async (values: DemandTypeFormValues) => {
      try {
        if (editing) await updateMutation.mutateAsync({ id: editing.id, values });
        else await createMutation.mutateAsync(values);
        toast({ title: "Thành công", description: editing ? "Đã cập nhật loại nhu cầu." : "Đã thêm loại nhu cầu." });
        setFormOpen(false);
      } catch (error) {
        fail("Không thể lưu", error);
      }
    },

    deleting,
    setDeleting,
    isDeleting: deleteMutation.isPending,
    handleConfirmDelete: async () => {
      if (!deleting) return;
      try {
        await deleteMutation.mutateAsync(deleting.id);
        toast({ title: "Đã xóa", description: `Đã xóa "${deleting.name}".` });
        setDeleting(null);
      } catch (error) {
        fail("Không thể xóa", error);
        setDeleting(null);
      }
    },
  };
}
