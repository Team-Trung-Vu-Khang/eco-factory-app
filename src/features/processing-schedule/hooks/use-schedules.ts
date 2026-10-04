import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { machineKeys } from "@/features/machine";
import { scheduleApi, scheduleKeys } from "../api/schedule.api";
import type { ProcessingScheduleInput, ScheduleListParams } from "../types";

/** Own schedules page by page for infinite scroll (mobile, member) */
export function useInfiniteSchedules(
  params: Omit<ScheduleListParams, "page" | "size">,
  options?: { admin?: boolean; pageSize?: number },
) {
  const pageSize = options?.pageSize ?? 10;
  const admin = !!options?.admin;
  return useInfiniteQuery({
    queryKey: [
      ...(admin
        ? scheduleKeys.adminList({ ...params, page: 0, size: pageSize })
        : scheduleKeys.list({ ...params, page: 0, size: pageSize })),
      "infinite",
    ],
    // Admin → every factory's posts
    queryFn: ({ pageParam }) =>
      (admin ? scheduleApi.adminList : scheduleApi.list)({
        ...params,
        page: pageParam,
        size: pageSize,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.page + 1 < last.totalPages ? last.page + 1 : undefined,
  });
}

export function useSchedules(
  params: ScheduleListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => scheduleApi.list(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

export function useAdminSchedules(
  params: ScheduleListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: scheduleKeys.adminList(params),
    queryFn: () => scheduleApi.adminList(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

export function useScheduleDetail(
  id: number | string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => scheduleApi.getById(id),
    enabled: options?.enabled ?? !!id,
  });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: scheduleKeys.all });
    qc.invalidateQueries({ queryKey: machineKeys.all });
  };
}

export function useCreateSchedule() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (payload: ProcessingScheduleInput) =>
      scheduleApi.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateSchedule() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number | string;
      values: ProcessingScheduleInput;
    }) => scheduleApi.update(id, values),
    onSuccess: invalidate,
  });
}

export function useCloseSchedule() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: number | string) => scheduleApi.close(id),
    onSuccess: invalidate,
  });
}

export function useAdminDeleteSchedule() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: number | string) => scheduleApi.adminDelete(id),
    onSuccess: invalidate,
  });
}
