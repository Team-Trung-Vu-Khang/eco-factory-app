import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { factoryAccountApi, factoryAccountKeys } from "../api/factory-account.api";
import type { FactoryAccountFormValues } from "../schema";
import type { FactoryAccountListParams, FactoryAccountStatus } from "../types";

export function useFactoryAccounts(params: FactoryAccountListParams) {
  return useQuery({
    queryKey: factoryAccountKeys.list(params),
    queryFn: () => factoryAccountApi.list(params),
    placeholderData: keepPreviousData,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: factoryAccountKeys.all });
}

export function useCreateFactoryAccount() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (v: FactoryAccountFormValues) => factoryAccountApi.create(v), onSuccess: invalidate });
}

export function useUpdateFactoryAccount() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: FactoryAccountFormValues }) => factoryAccountApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useSetFactoryAccountStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: FactoryAccountStatus }) => factoryAccountApi.setStatus(id, status),
    onSuccess: invalidate,
  });
}

export function useDeleteFactoryAccount() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => factoryAccountApi.remove(id), onSuccess: invalidate });
}
