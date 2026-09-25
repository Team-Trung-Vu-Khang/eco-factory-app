import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { factoryApi, factoryKeys } from "../api/factory.api";
import type { FactoryFormValues } from "../schemas/factory-schema";
import type { FactoryListParams } from "../types";

export function useFactories(params: FactoryListParams) {
  return useQuery({
    queryKey: factoryKeys.list(params),
    queryFn: () => factoryApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useFactory(id: string | undefined) {
  return useQuery({
    queryKey: factoryKeys.detail(id ?? ""),
    queryFn: () => factoryApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateFactory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: FactoryFormValues) => factoryApi.create(values),
    onSuccess: () => qc.invalidateQueries({ queryKey: factoryKeys.lists() }),
  });
}

export function useUpdateFactory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: FactoryFormValues }) =>
      factoryApi.update(id, values),
    onSuccess: (factory) => {
      qc.invalidateQueries({ queryKey: factoryKeys.lists() });
      qc.setQueryData(factoryKeys.detail(factory.id), factory);
    },
  });
}

export function useDeleteFactory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => factoryApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: factoryKeys.lists() }),
  });
}
