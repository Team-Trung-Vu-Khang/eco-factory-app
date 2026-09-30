import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { machineKeys } from "@/features/machine";
import { scheduleApi, scheduleKeys } from "../api/schedule.api";
import type { ProcessingScheduleInput, ScheduleListParams } from "../types";

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
