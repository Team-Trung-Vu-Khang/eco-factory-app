import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi, productKeys } from "../api/product.api";
import type { ProductFormValues } from "../schemas/product-schema";
import type { ProductListParams } from "../types";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: () => productApi.get(id!),
    enabled: !!id,
  });
}

export function useProductSummary() {
  return useQuery({ queryKey: productKeys.summary(), queryFn: productApi.summary });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: productKeys.all });
}

export function useCreateProduct() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (v: ProductFormValues) => productApi.create(v), onSuccess: invalidate });
}

export function useUpdateProduct() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProductFormValues }) => productApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteProduct() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => productApi.remove(id), onSuccess: invalidate });
}
