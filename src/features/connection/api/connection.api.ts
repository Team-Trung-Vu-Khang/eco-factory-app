import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiClient } from "@/lib/axios";
import type { PageResponse } from "@/features/factory";
import type {
  ConnectionListParams,
  ConnectionRequestItem,
  CreateConnectionRequestInput,
  FactorySearchParams,
  MarketplaceProfileDetail,
  MarketplaceScheduleItem,
} from "../types";

export const connectionKeys = {
  all: ["connections"] as const,
  list: (params: ConnectionListParams) =>
    [...connectionKeys.all, "list", params] as const,
  adminList: (params: ConnectionListParams) =>
    [...connectionKeys.all, "adminList", params] as const,
  myList: (params: ConnectionListParams) =>
    [...connectionKeys.all, "myList", params] as const,
  search: (params: FactorySearchParams) =>
    [...connectionKeys.all, "search", params] as const,
  detail: (id: number | string) =>
    [...connectionKeys.all, "detail", id] as const,
  marketplaceProfile: (id: number | string, scheduleId?: number | string) =>
    [...connectionKeys.all, "marketplaceProfile", id, scheduleId] as const,
};

const factoryEp = API_ENDPOINTS.factory.connectionRequests;
const adminEp = API_ENDPOINTS.admin.factory.connectionRequests;
const marketEp = API_ENDPOINTS.factory.marketplace;

/** Marketplace APIs are user-scoped: no X-Workspace-Id, no role check */
const noWorkspace = { skipWorkspaceHeader: true };

export const connectionApi = {
  // ─── Nhà máy (Factory) ──────────────────────────────────────────────────────────
  async getFactoryRequests(
    params: ConnectionListParams,
    options?: { workspaceId?: number | string },
  ): Promise<PageResponse<ConnectionRequestItem>> {
    const { data } = await apiClient.get<PageResponse<ConnectionRequestItem>>(
      factoryEp.base,
      {
        params: {
          scheduleId: params.scheduleId || undefined,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          page: params.page,
          size: params.size,
        },
        headers: options?.workspaceId
          ? { "X-Workspace-Id": String(options.workspaceId) }
          : undefined,
      },
    );
    return data;
  },

  async getFactoryRequestById(
    id: number | string,
    options?: { workspaceId?: number | string },
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.get<ConnectionRequestItem>(
      factoryEp.detail(id),
      {
        headers: options?.workspaceId
          ? { "X-Workspace-Id": String(options.workspaceId) }
          : undefined,
      },
    );
    return data;
  },

  async acceptRequest(
    id: number | string,
    resultNote?: string,
    options?: { workspaceId?: number | string },
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      factoryEp.accept(id),
      resultNote ? { resultNote: resultNote.trim() } : {},
      {
        headers: options?.workspaceId
          ? { "X-Workspace-Id": String(options.workspaceId) }
          : undefined,
      },
    );
    return data;
  },

  async rejectRequest(
    id: number | string,
    reason?: string,
    options?: { workspaceId?: number | string },
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      factoryEp.reject(id),
      reason ? { reason: reason.trim() } : {},
      {
        headers: options?.workspaceId
          ? { "X-Workspace-Id": String(options.workspaceId) }
          : undefined,
      },
    );
    return data;
  },

  // ─── Admin ───────────────────────────────────────────────────────────────────
  async getAdminRequests(
    params: ConnectionListParams,
  ): Promise<PageResponse<ConnectionRequestItem>> {
    const { data } = await apiClient.get<PageResponse<ConnectionRequestItem>>(
      adminEp.base,
      {
        params: {
          profileId: params.profileId || undefined,
          scheduleId: params.scheduleId || undefined,
          requestedByUserId: params.requestedByUserId || undefined,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          sort: params.sort || undefined,
          page: params.page,
          size: params.size,
        },
      },
    );
    return data;
  },

  async getAdminRequestById(
    id: number | string,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.get<ConnectionRequestItem>(
      adminEp.detail(id),
    );
    return data;
  },

  // ─── Nông hộ (Marketplace / Farm) ───────────────────────────────────────────
  async searchMarketplaceSchedules(
    params: FactorySearchParams,
  ): Promise<PageResponse<MarketplaceScheduleItem>> {
    const { data } = await apiClient.get<PageResponse<MarketplaceScheduleItem>>(
      marketEp.processingSchedules,
      {
        params: {
          profileId: params.profileId || undefined,
          keyword: params.keyword?.trim() || undefined,
          province: params.province || undefined,
          ward: params.ward || undefined,
          processingServiceIds: params.processingServiceIds?.length
            ? params.processingServiceIds.join(",")
            : undefined,
          crops: params.crops?.length ? params.crops : undefined,
          maxCapacity: params.maxCapacity || undefined,
          capacityUnit: params.capacityUnit || undefined,
          certificateTypes: params.certificateTypes?.length
            ? params.certificateTypes
            : undefined,
          materialCondition: params.materialCondition?.trim() || undefined,
          packagingRequirement:
            params.packagingRequirement?.trim() || undefined,
          technicalRequirement:
            params.technicalRequirement?.trim() || undefined,
          page: params.page ?? 0,
          size: params.size ?? 20,
        },
        paramsSerializer: {
          indexes: null, // crops=A&crops=B
        },
        headers: noWorkspace,
      },
    );
    return data;
  },

  async getMarketplaceProfile(
    id: number | string,
    scheduleId?: number | string,
  ): Promise<MarketplaceProfileDetail> {
    const { data } = await apiClient.get<MarketplaceProfileDetail>(
      marketEp.profiles.detail(id),
      {
        params: {
          scheduleId: scheduleId || undefined,
        },
        headers: noWorkspace,
      },
    );
    return data;
  },

  async createConnectionRequest(
    payload: CreateConnectionRequestInput,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      marketEp.connectionRequests.base,
      payload,
      { headers: noWorkspace },
    );
    return data;
  },

  async getMyConnectionRequests(
    params: ConnectionListParams,
  ): Promise<PageResponse<ConnectionRequestItem>> {
    const { data } = await apiClient.get<PageResponse<ConnectionRequestItem>>(
      marketEp.connectionRequests.base,
      {
        params: {
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          page: params.page,
          size: params.size,
        },
        headers: noWorkspace,
      },
    );
    return data;
  },

  async cancelConnectionRequest(
    id: number | string,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      marketEp.connectionRequests.cancel(id),
      undefined,
      { headers: noWorkspace },
    );
    return data;
  },
};
