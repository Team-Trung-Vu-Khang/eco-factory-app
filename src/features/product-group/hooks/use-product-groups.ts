import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo } from "react";
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

/** Public product group detail (incl. crops); disabled until id is set */
export function usePublicProductGroup(id?: string | number) {
  return useQuery({
    queryKey: productGroupKeys.publicDetail(id ?? ""),
    queryFn: () => productGroupApi.getPublic(id!),
    enabled: id != null && id !== "",
    staleTime: 30_000,
  });
}

/** Function to fetch dynamic options for AsyncSelect components (cached 30s via TanStack Query) */
export const fetchProductGroupOptions = (keyword = "") =>
  queryClient.fetchQuery({
    queryKey: productGroupKeys.search(keyword, 20),
    queryFn: () => productGroupApi.searchOptions(keyword, 20),
    staleTime: 30_000,
  });

/** Active product groups (public master data), cached 30s */
export function useActiveProductGroups() {
  return useQuery({
    queryKey: [...productGroupKeys.all, "all"],
    queryFn: productGroupApi.all,
    staleTime: 30_000,
  });
}

/** AsyncSelect fetcher for crops declared in product groups (cached 30s) */
export const fetchProductGroupCropOptions = (keyword = "") =>
  queryClient.fetchQuery({
    queryKey: productGroupKeys.cropSearch(keyword, 20),
    queryFn: () => productGroupApi.searchCropOptions(keyword, 20),
    staleTime: 30_000,
  });

/** Select options for forms; falls back to [] while loading */
export function useProductGroupOptions() {
  const { data } = useActiveProductGroups();
  return (data ?? []).map((g) => ({ value: String(g.id), label: g.name }));
}

export interface ProductGroupCrop {
  name: string;
  groupName: string;
}

/** Crops declared in active product groups — source for crop pickers (deduped by name) */
export function useProductGroupCrops() {
  const query = useActiveProductGroups();
  const crops = useMemo(() => {
    const seen = new Map<string, ProductGroupCrop>();
    for (const g of query.data ?? []) {
      for (const name of g.crops ?? []) {
        const key = name.trim();
        if (key && !seen.has(key))
          seen.set(key, { name: key, groupName: g.name });
      }
    }
    return [...seen.values()];
  }, [query.data]);
  return { crops, isLoading: query.isLoading };
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
