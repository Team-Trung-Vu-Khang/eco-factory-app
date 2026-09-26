import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMemo, useState } from "react";

interface CrudPageOptions<T extends { id: string; name: string }, V> {
  /** Entity name in toasts, e.g. "nhóm nông sản" */
  noun: string;
  toFormValues: (row: T) => V;
  create: UseMutationResult<unknown, Error, V>;
  update: UseMutationResult<unknown, Error, { id: string; values: V }>;
  remove: UseMutationResult<unknown, Error, string>;
}

/** Paging/search + create/edit dialog + delete confirm state shared by catalog pages */
export function useCrudPage<T extends { id: string; name: string }, V>({ noun, toFormValues, create, update, remove }: CrudPageOptions<T, V>) {
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const editingValues = useMemo(() => (editing ? toFormValues(editing) : undefined), [editing, toFormValues]);

  const fail = (title: string, error: unknown) => toast({ title, description: (error as Error).message, variant: "destructive" });

  return {
    params: { page, size, keyword },
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

    formOpen,
    setFormOpen,
    editingValues,
    isSubmitting: create.isPending || update.isPending,
    openCreate: () => {
      setEditing(null);
      setFormOpen(true);
    },
    openEdit: (row: T) => {
      setEditing(row);
      setFormOpen(true);
    },
    handleSubmit: async (values: V) => {
      try {
        if (editing) await update.mutateAsync({ id: editing.id, values });
        else await create.mutateAsync(values);
        toast({ title: "Thành công", description: editing ? `Đã cập nhật ${noun}.` : `Đã thêm ${noun}.` });
        setFormOpen(false);
      } catch (error) {
        fail("Không thể lưu", error);
      }
    },

    deleting,
    setDeleting,
    isDeleting: remove.isPending,
    handleConfirmDelete: async () => {
      if (!deleting) return;
      try {
        await remove.mutateAsync(deleting.id);
        toast({ title: "Đã xóa", description: `Đã xóa "${deleting.name}".` });
      } catch (error) {
        fail("Không thể xóa", error);
      }
      setDeleting(null);
    },
  };
}
