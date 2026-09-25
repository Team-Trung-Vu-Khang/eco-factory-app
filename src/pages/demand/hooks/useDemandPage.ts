import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  useDeleteDemand,
  useDemands,
  type Demand,
  type DemandListParams,
} from "@/features/demand";

type Filters = Pick<DemandListParams, "demandGroupId" | "status" | "isNewlyDeveloped">;

export function useDemandPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [deleting, setDeleting] = useState<Demand | null>(null);

  const query = useDemands({ page, size, keyword, ...filters });
  const deleteMutation = useDeleteDemand();

  const handleConfirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      toast({ title: "Đã xóa", description: `Đã xóa nhu cầu "${deleting.productName}".` });
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
    handlePageSize: (next: number) => {
      setSize(next);
      setPage(0);
    },
    handleSearch: (value: string) => {
      setKeyword(value);
      setPage(0);
    },
    handleFilterChange: (key: string, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value && value !== "all" ? value : undefined }));
      setPage(0);
    },
    goCreate: () => navigate(ROUTES.demandCreate),
    goView: (c: Demand) => navigate(ROUTES.demandDetail(c.id)),
    goEdit: (c: Demand) => navigate(ROUTES.demandEdit(c.id)),
    deleting,
    setDeleting,
    isDeleting: deleteMutation.isPending,
    handleConfirmDelete,
  };
}
