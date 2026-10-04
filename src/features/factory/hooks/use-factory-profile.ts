import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  factoryProfileApi,
  factoryProfileKeys,
} from "../api/factory-profile.api";
import type {
  AdminFactoryProfileListParams,
  FactoryProfileSubmitInput,
} from "../types";

export function useMyFactoryProfile() {
  return useQuery({
    queryKey: factoryProfileKeys.myProfile(),
    queryFn: () => factoryProfileApi.getMyProfile(),
  });
}

export function useAdminFactoryProfiles(params: AdminFactoryProfileListParams) {
  return useQuery({
    queryKey: factoryProfileKeys.adminList(params),
    queryFn: () => factoryProfileApi.adminList(params),
    placeholderData: keepPreviousData,
  });
}

/** Admin profile list page by page for infinite scroll (mobile) */
export function useInfiniteAdminFactoryProfiles(
  params: Omit<AdminFactoryProfileListParams, "page" | "size">,
  pageSize = 10,
) {
  return useInfiniteQuery({
    queryKey: [
      ...factoryProfileKeys.adminList({ ...params, page: 0, size: pageSize }),
      "infinite",
    ],
    queryFn: ({ pageParam }) =>
      factoryProfileApi.adminList({
        ...params,
        page: pageParam,
        size: pageSize,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.page + 1 < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useAdminFactoryProfile(
  id: string | number | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: factoryProfileKeys.detail(id ?? ""),
    queryFn: () => factoryProfileApi.adminGet(id!),
    enabled: (options?.enabled ?? true) && id !== undefined && id !== "",
  });
}

export function useSubmitFactoryProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FactoryProfileSubmitInput) =>
      factoryProfileApi.submitProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: factoryProfileKeys.all });
    },
  });
}

export function useAdminApproveProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => factoryProfileApi.adminApprove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: factoryProfileKeys.all });
    },
  });
}

export function useAdminRejectProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string | number; note: string }) =>
      factoryProfileApi.adminReject(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: factoryProfileKeys.all });
    },
  });
}
