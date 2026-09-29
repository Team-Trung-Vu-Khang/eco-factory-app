import { useQuery } from "@tanstack/react-query";
import type { FactoryProfile } from "@/features/factory";
import { apiClient } from "@/lib/axios";

export interface WorkspaceSummary {
  id: number | string;
  code?: string;
  name: string;
  brandName?: string;
  status?: string;
  featureProfile?: FactoryProfile;
}

export interface WorkspaceListParams {
  feature?: string;
  keyword?: string;
  status?: string;
  businessLine?: string;
  organizationTypeId?: number | string;
  ownerUserId?: number | string;
  page?: number;
  size?: number;
}

export const workspaceKeys = {
  all: ["workspaces"] as const,
  list: (params?: WorkspaceListParams) =>
    [...workspaceKeys.all, "list", params] as const,
  current: (feature?: string) =>
    [...workspaceKeys.all, "current", feature] as const,
};

export const workspaceApi = {
  async list(params?: WorkspaceListParams): Promise<WorkspaceSummary[]> {
    const { data } = await apiClient.get<{ content?: WorkspaceSummary[] }>(
      "/api/center/workspaces",
      {
        params: {
          feature: params?.feature ?? "factory",
          page: params?.page ?? 0,
          size: params?.size ?? 100,
          keyword: params?.keyword,
          status: params?.status,
          businessLine: params?.businessLine,
          organizationTypeId: params?.organizationTypeId,
          ownerUserId: params?.ownerUserId,
        },
      },
    );
    return data.content ?? [];
  },

  async getCurrent(feature = "factory"): Promise<WorkspaceSummary> {
    const { data } = await apiClient.get<WorkspaceSummary>(
      "/api/center/workspaces/current",
      { params: { feature } },
    );
    return data;
  },
};

/** Same list eco-shared-ui's workspace switcher uses */
export function useWorkspaces(params?: WorkspaceListParams) {
  return useQuery({
    queryKey: workspaceKeys.list(params),
    queryFn: () => workspaceApi.list(params),
    staleTime: 5 * 60_000,
  });
}

export function useCurrentWorkspace(feature = "factory") {
  return useQuery({
    queryKey: workspaceKeys.current(feature),
    queryFn: () => workspaceApi.getCurrent(feature),
    staleTime: 5 * 60_000,
  });
}
