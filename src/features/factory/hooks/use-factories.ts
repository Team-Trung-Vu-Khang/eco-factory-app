import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { factoryApi, factoryKeys } from "../api/factory.api";
import type { FactoryFormValues, MachineFormValues } from "../schemas/factory-schema";
import type { FactoryListParams, MachineListParams } from "../types";

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

export function useMachines(params: MachineListParams) {
  return useQuery({
    queryKey: factoryKeys.machines(params),
    queryFn: () => factoryApi.listMachines(params),
    placeholderData: keepPreviousData,
  });
}

export function useSaveMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ factoryId, values, machineId }: { factoryId: string; values: MachineFormValues; machineId?: string }) =>
      factoryApi.saveMachine(factoryId, values, machineId),
    onSuccess: () => qc.invalidateQueries({ queryKey: factoryKeys.all }),
  });
}

export function useDeleteMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ factoryId, machineId }: { factoryId: string; machineId: string }) => factoryApi.removeMachine(factoryId, machineId),
    onSuccess: () => qc.invalidateQueries({ queryKey: factoryKeys.all }),
  });
}

/** All factories as select options (+ id → name lookup) */
export function useFactoryOptions() {
  const { data } = useFactories({ page: 0, size: 500 });
  const options = (data?.content ?? []).map((f) => ({ value: f.id, label: f.name }));
  const nameOf = (id?: string) => options.find((o) => o.value === id)?.label ?? "—";
  return { options, nameOf, factories: data?.content ?? [] };
}
