import {
  getSelectedWorkspaceIdFromStorage,
  workspaceKeys,
} from "@/features/workspace";
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: factoryKeys.lists() });
      qc.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useUpdateFactory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
      submitForReview,
    }: {
      id: string;
      values: FactoryFormValues;
      submitForReview?: boolean;
    }) => factoryApi.update(id, values, submitForReview),
    onSuccess: (factory) => {
      qc.invalidateQueries({ queryKey: factoryKeys.lists() });
      qc.invalidateQueries({ queryKey: workspaceKeys.all });
      qc.setQueryData(factoryKeys.detail(factory.id), factory);
    },
  });
}

export function useReviewFactory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      note,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED";
      note?: string;
    }) => factoryApi.review(id, status, note),
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

/** All factories as select options (+ id → name lookup) */
export function useFactoryOptions() {
  const { data } = useFactories({ page: 0, size: 500 });
  const options = (data?.content ?? []).map((f) => ({
    value: f.id,
    label: f.name,
  }));
  const nameOf = (id?: string) =>
    options.find((o) => o.value === id)?.label ?? "—";
  return { options, nameOf, factories: data?.content ?? [] };
}

/**
 * Factory owned by the signed-in account / selected workspace.
 * Admins switch workspace to manage another factory.
 * TODO: resolve from the auth/workspace API once available — mock picks the workspace's factory or the first one
 */
export function useCurrentFactory() {
  const { factories } = useFactoryOptions();
  const workspaceId = getSelectedWorkspaceIdFromStorage();
  const factory = factories.find((f) => f.id === workspaceId) ?? factories[0];
  return { factory, factoryId: factory?.id };
}
