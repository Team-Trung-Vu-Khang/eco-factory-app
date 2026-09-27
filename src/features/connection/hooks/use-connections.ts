import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { factoryKeys } from "@/features/factory";
import { scheduleKeys } from "@/features/processing-schedule";
import { connectionApi, connectionKeys } from "../api/connection.api";
import type { ConnectionListParams, ConnectFactoriesInput, FactorySearchParams } from "../types";

/** `params` undefined = not searched yet */
export function useFactorySearch(params: FactorySearchParams | undefined) {
  return useQuery({
    queryKey: connectionKeys.search(params!),
    queryFn: () => connectionApi.search(params!),
    enabled: !!params,
  });
}

export function useConnections(params: ConnectionListParams) {
  return useQuery({
    queryKey: connectionKeys.list(params),
    queryFn: () => connectionApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useConnectFactories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ConnectFactoriesInput) => connectionApi.connect(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: connectionKeys.all }),
  });
}

export function useResolveConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: "SUCCESS" | "FAILED"; note?: string }) =>
      connectionApi.resolve(id, status, note),
    onSuccess: () => {
      // A successful connection closes the schedule → search results change
      qc.invalidateQueries({ queryKey: connectionKeys.all });
      qc.invalidateQueries({ queryKey: scheduleKeys.all });
      qc.invalidateQueries({ queryKey: factoryKeys.all });
    },
  });
}
