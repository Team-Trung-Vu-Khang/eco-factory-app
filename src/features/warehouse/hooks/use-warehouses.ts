import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { warehouseApi, warehouseKeys } from "../api/warehouse.api";
import type { WarehouseFormValues } from "../schemas/warehouse-schema";
import type { WarehouseListParams } from "../types";

export function useWarehouses(params: WarehouseListParams) {
  return useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: () => warehouseApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useWarehouse(id: string | undefined) {
  return useQuery({
    queryKey: warehouseKeys.detail(id ?? ""),
    queryFn: () => warehouseApi.get(id!),
    enabled: !!id,
  });
}

export function useWarehouseSummary() {
  return useQuery({ queryKey: warehouseKeys.summary(), queryFn: warehouseApi.summary });
}

function useInvalidateWarehouses() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: warehouseKeys.all });
}

export function useCreateWarehouse() {
  const invalidate = useInvalidateWarehouses();
  return useMutation({
    mutationFn: (values: WarehouseFormValues) => warehouseApi.create(values),
    onSuccess: invalidate,
  });
}

export function useUpdateWarehouse() {
  const invalidate = useInvalidateWarehouses();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: WarehouseFormValues }) => warehouseApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteWarehouse() {
  const invalidate = useInvalidateWarehouses();
  return useMutation({
    mutationFn: (id: string) => warehouseApi.remove(id),
    onSuccess: invalidate,
  });
}
