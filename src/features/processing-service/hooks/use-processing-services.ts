import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { processingServiceApi, processingServiceKeys } from "../api/processing-service.api";
import type { ProcessingServiceFormValues } from "../schema";
import type { ProcessingServiceListParams } from "../types";

export function useProcessingServices(params: ProcessingServiceListParams) {
  return useQuery({
    queryKey: processingServiceKeys.list(params),
    queryFn: () => processingServiceApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useProcessingServiceOptions() {
  const { data } = useQuery({ queryKey: [...processingServiceKeys.all, "all"], queryFn: processingServiceApi.all });
  return (data ?? []).map((s) => ({ value: s.id, label: s.name }));
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: processingServiceKeys.all });
}

export function useCreateProcessingService() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (v: ProcessingServiceFormValues) => processingServiceApi.create(v), onSuccess: invalidate });
}

export function useUpdateProcessingService() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProcessingServiceFormValues }) => processingServiceApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteProcessingService() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => processingServiceApi.remove(id), onSuccess: invalidate });
}
