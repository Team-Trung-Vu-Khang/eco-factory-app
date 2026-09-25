import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { demandApi, demandKeys } from "../api/demand.api";
import type { DemandFormValues } from "../schemas/demand-schema";
import type { DemandListParams } from "../types";

export function useDemands(params: DemandListParams) {
  return useQuery({
    queryKey: demandKeys.list(params),
    queryFn: () => demandApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useDemand(id: string | undefined) {
  return useQuery({
    queryKey: demandKeys.detail(id ?? ""),
    queryFn: () => demandApi.get(id!),
    enabled: !!id,
  });
}

export function useDemandSummary() {
  return useQuery({ queryKey: demandKeys.summary(), queryFn: demandApi.summary });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: demandKeys.all });
}

export function useCreateDemand() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (v: DemandFormValues) => demandApi.create(v), onSuccess: invalidate });
}

export function useUpdateDemand() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: DemandFormValues }) => demandApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteDemand() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => demandApi.remove(id), onSuccess: invalidate });
}
