import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { productGroupApi, productGroupKeys } from "../api/product-group.api";
import type { ProductGroupFormValues } from "../schema";
import type { ProductGroupListParams } from "../types";

export function useProductGroups(params: ProductGroupListParams) {
  return useQuery({
    queryKey: productGroupKeys.list(params),
    queryFn: () => productGroupApi.list(params),
    placeholderData: keepPreviousData,
  });
}

/** Function to fetch dynamic options for AsyncSelect components (cached 30s via TanStack Query) */
export const fetchProductGroupOptions = (keyword = "") =>
  queryClient.fetchQuery({
    queryKey: productGroupKeys.search(keyword, 20),
    queryFn: () => productGroupApi.searchOptions(keyword, 20),
    staleTime: 30_000,
  });

/** Select options for forms; falls back to [] while loading */
export function useProductGroupOptions() {
  const { data } = useQuery({
    queryKey: [...productGroupKeys.all, "all"],
    queryFn: productGroupApi.all,
    staleTime: 30_000,
  });
  return (data ?? []).map((g) => ({ value: String(g.id), label: g.name }));
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: productGroupKeys.all });
}

export function useCreateProductGroup() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (v: ProductGroupFormValues) => productGroupApi.create(v),
    onSuccess: invalidate,
  });
}

export function useUpdateProductGroup() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string | number;
      values: ProductGroupFormValues;
    }) => productGroupApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteProductGroup() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string | number) => productGroupApi.remove(id),
    onSuccess: invalidate,
  });
}
