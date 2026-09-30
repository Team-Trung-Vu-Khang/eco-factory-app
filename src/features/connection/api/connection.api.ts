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
  marketplaceProfile: (id: number | string) =>
    [...connectionKeys.all, "marketplaceProfile", id] as const,
};

const factoryEp = API_ENDPOINTS.factory.connectionRequests;
const adminEp = API_ENDPOINTS.admin.factory.connectionRequests;
const marketEp = API_ENDPOINTS.factory.marketplace;

export const connectionApi = {
  // ─── Nhà máy (Factory) ──────────────────────────────────────────────────────────
  async getFactoryRequests(
    params: ConnectionListParams,
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
      },
    );
    return data;
  },

  async getFactoryRequestById(
    id: number | string,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.get<ConnectionRequestItem>(
      factoryEp.detail(id),
    );
    return data;
  },

  async acceptRequest(
    id: number | string,
    resultNote?: string,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      factoryEp.accept(id),
      resultNote ? { resultNote: resultNote.trim() } : {},
    );
    return data;
  },

  async rejectRequest(
    id: number | string,
    reason?: string,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      factoryEp.reject(id),
      reason ? { reason: reason.trim() } : {},
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
          farmWorkspaceId: params.farmWorkspaceId || undefined,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
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
          page: params.page ?? 0,
          size: params.size ?? 20,
        },
        paramsSerializer: {
          indexes: null, // crops=A&crops=B
        },
      },
    );
    return data;
  },

  async getMarketplaceProfile(
    id: number | string,
  ): Promise<MarketplaceProfileDetail> {
    const { data } = await apiClient.get<MarketplaceProfileDetail>(
      marketEp.profiles.detail(id),
    );
    return data;
  },

  async createConnectionRequest(
    payload: CreateConnectionRequestInput,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      marketEp.connectionRequests.base,
      payload,
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
      },
    );
    return data;
  },

  async cancelConnectionRequest(
    id: number | string,
  ): Promise<ConnectionRequestItem> {
    const { data } = await apiClient.post<ConnectionRequestItem>(
      marketEp.connectionRequests.cancel(id),
    );
    return data;
  },
};
