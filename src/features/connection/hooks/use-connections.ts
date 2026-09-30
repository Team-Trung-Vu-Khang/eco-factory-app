import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { scheduleKeys } from "@/features/processing-schedule";
import { connectionApi, connectionKeys } from "../api/connection.api";
import type {
  ConnectionListParams,
  CreateConnectionRequestInput,
  FactorySearchParams,
} from "../types";

/** Search schedules in marketplace (Farmer / Admin) */
export function useFactorySearch(params: FactorySearchParams | undefined) {
  return useQuery({
    queryKey: connectionKeys.search(params!),
    queryFn: () => connectionApi.searchMarketplaceSchedules(params!),
    enabled: !!params,
    placeholderData: keepPreviousData,
  });
}

/** Factory view: requests received on its schedules */
export function useConnections(
  params: ConnectionListParams,
  options?: { enabled?: boolean; workspaceId?: number | string },
) {
  return useQuery({
    queryKey: options?.workspaceId
      ? ([...connectionKeys.list(params), options.workspaceId] as const)
      : connectionKeys.list(params),
    queryFn: () =>
      connectionApi.getFactoryRequests(params, {
        workspaceId: options?.workspaceId,
      }),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

/** Admin view: all connection requests */
export function useAdminConnections(
  params: ConnectionListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: connectionKeys.adminList(params),
    queryFn: () => connectionApi.getAdminRequests(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

/** Farm view: my sent connection requests */
export function useMyConnectionRequests(
  params: ConnectionListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: connectionKeys.myList(params),
    queryFn: () => connectionApi.getMyConnectionRequests(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled,
  });
}

/** Marketplace profile detail */
export function useMarketplaceProfile(
  id?: number | string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: connectionKeys.marketplaceProfile(id!),
    queryFn: () => connectionApi.getMarketplaceProfile(id!),
    enabled: options?.enabled ?? !!id,
  });
}

/** Invalidation helper */
function useInvalidateConnections() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: connectionKeys.all });
    qc.invalidateQueries({ queryKey: scheduleKeys.all });
  };
}

/** Farm: Create connection request */
export function useCreateConnectionRequest() {
  const invalidate = useInvalidateConnections();
  return useMutation({
    mutationFn: (payload: CreateConnectionRequestInput) =>
      connectionApi.createConnectionRequest(payload),
    onSuccess: invalidate,
  });
}

/** Farm: Cancel connection request */
export function useCancelConnectionRequest() {
  const invalidate = useInvalidateConnections();
  return useMutation({
    mutationFn: (id: number | string) =>
      connectionApi.cancelConnectionRequest(id),
    onSuccess: invalidate,
  });
}

/** Factory: Accept connection request */
export function useAcceptConnectionRequest() {
  const invalidate = useInvalidateConnections();
  return useMutation({
    mutationFn: ({
      id,
      resultNote,
      workspaceId,
    }: {
      id: number | string;
      resultNote?: string;
      workspaceId?: number | string;
    }) => connectionApi.acceptRequest(id, resultNote, { workspaceId }),
    onSuccess: invalidate,
  });
}

/** Factory: Reject connection request */
export function useRejectConnectionRequest() {
  const invalidate = useInvalidateConnections();
  return useMutation({
    mutationFn: ({
      id,
      reason,
      workspaceId,
    }: {
      id: number | string;
      reason?: string;
      workspaceId?: number | string;
    }) => connectionApi.rejectRequest(id, reason, { workspaceId }),
    onSuccess: invalidate,
  });
}

// Backward compatibility alias
export const useConnectFactories = useCreateConnectionRequest;
export const useResolveConnection = () => {
  const accept = useAcceptConnectionRequest();
  const reject = useRejectConnectionRequest();
  return {
    isPending: accept.isPending || reject.isPending,
    mutateAsync: async ({
      id,
      status,
      note,
      workspaceId,
    }: {
      id: number | string;
      status: "SUCCESS" | "FAILED" | "ACCEPTED" | "REJECTED";
      note?: string;
      workspaceId?: number | string;
    }) => {
      if (status === "SUCCESS" || status === "ACCEPTED") {
        return accept.mutateAsync({ id, resultNote: note, workspaceId });
      } else {
        return reject.mutateAsync({ id, reason: note, workspaceId });
      }
    },
  };
};
