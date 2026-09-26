import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { factoryKeys } from "@/features/factory";
import { scheduleApi, scheduleKeys } from "../api/schedule.api";
import type { ScheduleFormValues } from "../schema";
import type { ScheduleListParams } from "../types";

export function useSchedules(params: ScheduleListParams) {
  return useQuery({
    queryKey: scheduleKeys.list(params),
    queryFn: () => scheduleApi.list(params),
    placeholderData: keepPreviousData,
  });
}

/** Schedules drive machine availability, so factory data is stale too */
function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: scheduleKeys.all });
    qc.invalidateQueries({ queryKey: factoryKeys.all });
  };
}

export function useCreateSchedule() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (v: ScheduleFormValues) => scheduleApi.create(v), onSuccess: invalidate });
}

export function useCloseSchedule() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: (id: string) => scheduleApi.close(id), onSuccess: invalidate });
}
