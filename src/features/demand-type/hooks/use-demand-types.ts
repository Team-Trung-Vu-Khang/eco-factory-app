import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { demandTypeApi, demandTypeKeys } from "../api/demand-type.api";
import type { DemandTypeFormValues } from "../schema";
import type { DemandTypeListParams } from "../types";

export function useDemandTypes(params: DemandTypeListParams) {
  return useQuery({
    queryKey: demandTypeKeys.list(params),
    queryFn: () => demandTypeApi.list(params),
    placeholderData: keepPreviousData,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: demandTypeKeys.all });
}

export function useCreateDemandType() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (v: DemandTypeFormValues) => demandTypeApi.create(v), onSuccess: invalidate });
}

export function useUpdateDemandType() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: DemandTypeFormValues }) => demandTypeApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteDemandType() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => demandTypeApi.remove(id), onSuccess: invalidate });
}
