import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { FactoryProfile } from "@/features/factory";
import { apiClient } from "@/lib/axios";
import { queryClient } from "@/lib/query-client";

export interface WorkspaceMetadata {
  source?: string;
  factoryDisplayName?: string;
  farmDisplayName?: string;
  [key: string]: unknown;
}

export interface WorkspaceOwner {
  id?: number;
  fullName?: string;
  phoneNumber?: string;
}

export interface WorkspaceSummary {
  id: number | string;
  code?: string;
  name: string;
  brandName?: string;
  status?: string;
  owner?: WorkspaceOwner;
  featureProfile?: FactoryProfile;
  metadataJson?: WorkspaceMetadata;
}

export function formatWorkspaceDisplayName({
  facilityName,
  ownerName,
  ownerPhoneNumber,
  fallback = "Nhà máy",
}: {
  facilityName?: string | null;
  ownerName?: string | null;
  ownerPhoneNumber?: string | null;
  fallback?: string;
}): string {
  const accountDetails = [
    ownerName?.trim(),
    ownerPhoneNumber?.trim() ? `(${ownerPhoneNumber.trim()})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  if (facilityName && accountDetails) {
    return `${facilityName} - ${accountDetails}`;
  }
  return facilityName || accountDetails || fallback;
}

export interface WorkspaceOption {
  value: string;
  label: string;
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
  search: (keyword: string) =>
    [...workspaceKeys.all, "search", keyword] as const,
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
          size: params?.size ?? 20,
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

  async searchOptions(keyword = ""): Promise<WorkspaceOption[]> {
    try {
      const { data } = await apiClient.get<{ content?: WorkspaceSummary[] }>(
        "/api/center/workspaces",
        {
          params: {
            feature: "factory",
            keyword: keyword.trim() || undefined,
            page: 0,
            size: 20,
          },
        },
      );
      const items = Array.isArray(data) ? data : (data.content ?? []);
      return items.map((w) => {
        const facilityName =
          w.metadataJson?.factoryDisplayName ||
          w.brandName ||
          w.name ||
          w.featureProfile?.name ||
          (w.code ? `${w.code} - #${w.id}` : `Nhà máy #${w.id}`);

        return {
          value: String(w.id),
          label: formatWorkspaceDisplayName({
            facilityName,
            ownerName: w.owner?.fullName,
            ownerPhoneNumber: w.owner?.phoneNumber,
          }),
        };
      });
    } catch (err) {
      console.error("Failed to fetch workspace options", err);
      return [];
    }
  },

  async getCurrent(feature = "factory"): Promise<WorkspaceSummary> {
    const { data } = await apiClient.get<WorkspaceSummary>(
      "/api/center/workspaces/current",
      { params: { feature } },
    );
    return data;
  },
};

/** Lấy danh sách workspace cho dropdown với cache 30s qua TanStack Query */
export async function fetchWorkspaceOptions(
  keyword = "",
): Promise<WorkspaceOption[]> {
  return queryClient.fetchQuery({
    queryKey: workspaceKeys.search(keyword),
    queryFn: () => workspaceApi.searchOptions(keyword),
    staleTime: 30_000,
  });
}

/** Same list eco-shared-ui's workspace switcher uses */
export function useWorkspaces(params?: WorkspaceListParams) {
  return useQuery({
    queryKey: workspaceKeys.list(params),
    queryFn: () => workspaceApi.list(params),
    staleTime: 5 * 60_000,
  });
}

/** Danh sách lựa chọn Workspace (Nhà máy) dùng cho Select / Combobox */
export function useWorkspaceOptions(params?: WorkspaceListParams) {
  const { data: workspaces = [], isLoading } = useWorkspaces(params);

  const options = useMemo(
    () =>
      workspaces.map((w) => {
        const facilityName =
          w.metadataJson?.factoryDisplayName ||
          w.brandName ||
          w.name ||
          w.featureProfile?.name ||
          (w.code ? `${w.code} - #${w.id}` : `Nhà máy #${w.id}`);

        return {
          value: String(w.id),
          label: formatWorkspaceDisplayName({
            facilityName,
            ownerName: w.owner?.fullName,
            ownerPhoneNumber: w.owner?.phoneNumber,
          }),
        };
      }),
    [workspaces],
  );

  const nameOf = (id?: number | string) =>
    options.find((o) => o.value === String(id))?.label ?? "—";

  return { options, workspaces, nameOf, isLoading };
}

export function useCurrentWorkspace(feature = "factory") {
  return useQuery({
    queryKey: workspaceKeys.current(feature),
    queryFn: () => workspaceApi.getCurrent(feature),
    staleTime: 5 * 60_000,
  });
}
