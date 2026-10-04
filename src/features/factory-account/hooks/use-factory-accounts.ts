import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  factoryAccountApi,
  factoryAccountKeys,
} from "../api/factory-account.api";
import type {
  AdminCreateUserInput,
  AdminUpdateUserInput,
  FactoryAccountListParams,
  FactoryAccountStatus,
} from "../types";

export function useFactoryAccounts(params: FactoryAccountListParams) {
  return useQuery({
    queryKey: factoryAccountKeys.list(params),
    queryFn: () => factoryAccountApi.list(params),
    placeholderData: keepPreviousData,
  });
}

/** Accounts page by page for infinite scroll (mobile) */
export function useInfiniteFactoryAccounts(
  params: Omit<FactoryAccountListParams, "page" | "size">,
  pageSize = 20,
) {
  return useInfiniteQuery({
    queryKey: [
      ...factoryAccountKeys.list({ ...params, page: 0, size: pageSize }),
      "infinite",
    ],
    queryFn: ({ pageParam }) =>
      factoryAccountApi.list({ ...params, page: pageParam, size: pageSize }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.page + 1 < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useFactoryAccountDetail(userId?: string | number) {
  return useQuery({
    queryKey: userId ? factoryAccountKeys.detail(userId) : [],
    queryFn: () => (userId ? factoryAccountApi.getDetail(userId) : null),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: factoryAccountKeys.all });
}

export function useCreateFactoryAccount() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: AdminCreateUserInput) =>
      factoryAccountApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateFactoryAccount() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number;
      payload: AdminUpdateUserInput;
    }) => factoryAccountApi.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useSetFactoryAccountStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string | number;
      status: FactoryAccountStatus;
    }) => factoryAccountApi.setStatus(id, status),
    onSuccess: invalidate,
  });
}
