import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  useDeleteFactory,
  useFactories,
  type Factory,
  type FactoryListParams,
} from "@/features/factory";

type Filters = Pick<FactoryListParams, "organizationType" | "provinceCode" | "kpiStatus">;

export function useFactoryListPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [deleting, setDeleting] = useState<Factory | null>(null);

  const query = useFactories({ page, size, keyword, ...filters });
  const deleteMutation = useDeleteFactory();

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value && value !== "all" ? value : undefined }));
    setPage(0);
  };

  const handlePageSize = (next: number) => {
    setSize(next);
    setPage(0);
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast({ title: "Đã xóa", description: `Đã xóa "${deleting.name}".` });
      setDeleting(null);
    } catch (error) {
      toast({ title: "Không thể xóa", description: (error as Error).message, variant: "destructive" });
    }
  };

  return {
    data: query.data?.content ?? [],
    totalElements: query.data?.totalElements,
    totalPages: query.data?.totalPages,
    loading: query.isFetching,
    page,
    size,
    setPage,
    handlePageSize,
    handleSearch,
    handleFilterChange,
    goCreate: () => navigate(ROUTES.profileCreate),
    goView: (row: Factory) => navigate(ROUTES.profileDetail(row.id)),
    goEdit: (row: Factory) => navigate(ROUTES.profileEdit(row.id)),
    deleting,
    setDeleting,
    isDeleting: deleteMutation.isPending,
    handleConfirmDelete,
  };
}
