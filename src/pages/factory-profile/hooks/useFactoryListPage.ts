import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  useAdminFactoryProfiles,
  type FactoryProfile,
  type AdminFactoryProfileListParams,
} from "@/features/factory";

type Filters = Omit<AdminFactoryProfileListParams, "page" | "size" | "keyword">;

export function useFactoryListPage() {
  const [, navigate] = useLocation();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [keyword]);

  const query = useAdminFactoryProfiles({
    page,
    size,
    keyword: debouncedKeyword,
    ...filters,
  });

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => {
      if (!value || value === "all") {
        const next = { ...prev };
        delete (next as Record<string, unknown>)[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
    setPage(0);
  };

  const handlePageSize = (next: number) => {
    setSize(next);
    setPage(0);
  };

  // TODO: Mở lại khi BE bổ sung API DELETE /api/admin/factory/profiles/:id
  // const [deleting, setDeleting] = useState<FactoryProfile | null>(null);
  // const deleteMutation = useDeleteFactoryProfile();
  // const handleConfirmDelete = async () => {
  //   if (!deleting) return;
  //   try {
  //     await deleteMutation.mutateAsync(deleting.id);
  //     toast({ title: "Đã xóa", description: `Đã xóa "${deleting.name}".` });
  //     setDeleting(null);
  //   } catch (error) {
  //     toast({ title: "Không thể xóa", description: (error as Error).message, variant: "destructive" });
  //   }
  // };

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
    goView: (row: FactoryProfile) =>
      navigate(ROUTES.profileDetail(String(row.id))),
    goEdit: (row: FactoryProfile) =>
      navigate(ROUTES.profileEdit(String(row.id))),
    // deleting,
    // setDeleting,
    // isDeleting: deleteMutation.isPending,
    // handleConfirmDelete,
  };
}
