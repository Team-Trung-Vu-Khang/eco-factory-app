import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  adminFactoryMachineApi,
  adminMachineKeys,
  factoryMachineApi,
  machineKeys,
} from "../api/machine.api";
import type { FactoryMachineInput, FactoryMachineListParams } from "../types";

/** Own workspace machines page by page for infinite scroll (mobile, member) */
export function useInfiniteFactoryMachines(
  params: Omit<FactoryMachineListParams, "page" | "size">,
  pageSize = 10,
) {
  return useInfiniteQuery({
    queryKey: [
      ...machineKeys.list({ ...params, page: 0, size: pageSize }),
      "infinite",
    ],
    queryFn: ({ pageParam }) =>
      factoryMachineApi.list({ ...params, page: pageParam, size: pageSize }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.page + 1 < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useFactoryMachines(
  params: FactoryMachineListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: machineKeys.list(params),
    queryFn: () => factoryMachineApi.list(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

export function useAdminFactoryMachines(
  params: FactoryMachineListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: adminMachineKeys.list(params),
    queryFn: () => adminFactoryMachineApi.list(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

export function useFactoryMachine(id?: string | number) {
  return useQuery({
    queryKey: id ? machineKeys.detail(id) : [],
    queryFn: () => (id ? factoryMachineApi.get(id) : null),
    enabled: !!id,
  });
}

export function useAdminFactoryMachine(id?: string | number) {
  return useQuery({
    queryKey: id ? adminMachineKeys.detail(id) : [],
    queryFn: () => (id ? adminFactoryMachineApi.get(id) : null),
    enabled: !!id,
  });
}

export function useCreateFactoryMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FactoryMachineInput) => factoryMachineApi.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: machineKeys.all });
    },
  });
}

export function useUpdateFactoryMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string | number;
      input: FactoryMachineInput;
    }) => factoryMachineApi.update(id, input),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: machineKeys.all });
      qc.invalidateQueries({ queryKey: machineKeys.detail(variables.id) });
    },
  });
}

export function useDeleteFactoryMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => factoryMachineApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: machineKeys.all });
    },
  });
}

export function useAdminDeleteFactoryMachine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => adminFactoryMachineApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMachineKeys.all });
    },
  });
}
