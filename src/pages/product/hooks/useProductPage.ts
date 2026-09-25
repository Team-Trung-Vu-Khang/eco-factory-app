import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useState } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  useDeleteProduct,
  useProducts,
  type Product,
  type ProductListParams,
} from "@/features/product";

type Filters = Pick<ProductListParams, "productGroupId" | "status" | "isNewlyDeveloped">;

export function useProductPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [deleting, setDeleting] = useState<Product | null>(null);

  const query = useProducts({ page, size, keyword, ...filters });
  const deleteMutation = useDeleteProduct();

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
    goCreate: () => navigate(ROUTES.productCreate),
    goView: (c: Product) => navigate(ROUTES.productDetail(c.id)),
    goEdit: (c: Product) => navigate(ROUTES.productEdit(c.id)),
    deleting,
    setDeleting,
    isDeleting: deleteMutation.isPending,
    handleConfirmDelete,
  };
}
