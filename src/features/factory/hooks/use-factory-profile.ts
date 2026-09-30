import {
  keepPreviousData,
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
