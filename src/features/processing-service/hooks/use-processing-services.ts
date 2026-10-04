import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import {
  processingServiceApi,
  processingServiceKeys,
} from "../api/processing-service.api";
import type { ProcessingServiceFormValues } from "../schema";
import type { ProcessingServiceListParams } from "../types";

export function useProcessingServices(params: ProcessingServiceListParams) {
  return useQuery({
    queryKey: processingServiceKeys.list(params),
    queryFn: () => processingServiceApi.list(params),
    placeholderData: keepPreviousData,
  });
}

/** Public paged list (farm/marketplace side) */
export function usePublicProcessingServices(
  params: ProcessingServiceListParams,
) {
  return useQuery({
    queryKey: processingServiceKeys.publicList(params),
    queryFn: () => processingServiceApi.listPublic(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/** Public service detail; disabled until id is set */
export function usePublicProcessingService(id?: string | number) {
  return useQuery({
    queryKey: processingServiceKeys.publicDetail(id ?? ""),
    queryFn: () => processingServiceApi.getPublic(id!),
    enabled: id != null && id !== "",
    staleTime: 30_000,
  });
}

/** Function to fetch dynamic options for AsyncSelect components (cached 30s via TanStack Query) */
export const fetchProcessingServiceOptions = (keyword = "") =>
  queryClient.fetchQuery({
    queryKey: processingServiceKeys.search(keyword, 20),
    queryFn: () => processingServiceApi.searchOptions(keyword, 20),
    staleTime: 30_000,
  });

/** Active services (public, with imageUrl), cached 30s */
export function useActiveProcessingServices() {
  return useQuery({
    queryKey: [...processingServiceKeys.all, "all"],
    queryFn: processingServiceApi.all,
    staleTime: 30_000,
  });
}

export function useProcessingServiceOptions() {
  const { data } = useActiveProcessingServices();
  return (data ?? []).map((s) => ({ value: String(s.id), label: s.name }));
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: processingServiceKeys.all });
}

export function useCreateProcessingService() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (v: ProcessingServiceFormValues) =>
      processingServiceApi.create(v),
    onSuccess: invalidate,
  });
}

export function useUpdateProcessingService() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string | number;
      values: ProcessingServiceFormValues;
    }) => processingServiceApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteProcessingService() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string | number) => processingServiceApi.remove(id),
    onSuccess: invalidate,
  });
}
