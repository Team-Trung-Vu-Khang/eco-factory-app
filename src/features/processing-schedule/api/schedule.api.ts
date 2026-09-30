import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiClient } from "@/lib/axios";
import type { PageResponse } from "@/features/factory";
import type {
  ProcessingScheduleItem,
  ProcessingScheduleInput,
  ScheduleListParams,
} from "../types";

export const scheduleKeys = {
  all: ["processing-schedules"] as const,
  list: (params: ScheduleListParams) =>
    [...scheduleKeys.all, "list", params] as const,
  adminList: (params: ScheduleListParams) =>
    [...scheduleKeys.all, "adminList", params] as const,
  detail: (id: number | string) => [...scheduleKeys.all, "detail", id] as const,
};

const ep = API_ENDPOINTS.factory.processingSchedules;
const adminEp = API_ENDPOINTS.admin.factory.processingSchedules;

export const scheduleApi = {
  async list(
    params: ScheduleListParams,
  ): Promise<PageResponse<ProcessingScheduleItem>> {
    const { data } = await apiClient.get<PageResponse<ProcessingScheduleItem>>(
      ep.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          machineId: params.machineId || undefined,
        },
      },
    );
    return data;
  },

  async getById(id: number | string): Promise<ProcessingScheduleItem> {
    const { data } = await apiClient.get<ProcessingScheduleItem>(ep.detail(id));
    return data;
  },

  async create(
    payload: ProcessingScheduleInput,
  ): Promise<ProcessingScheduleItem> {
    const { data } = await apiClient.post<ProcessingScheduleItem>(
      ep.base,
      payload,
    );
    return data;
  },

  async update(
    id: number | string,
    payload: ProcessingScheduleInput,
  ): Promise<ProcessingScheduleItem> {
    const { data } = await apiClient.put<ProcessingScheduleItem>(
      ep.detail(id),
      payload,
    );
    return data;
  },

  async close(id: number | string): Promise<ProcessingScheduleItem> {
    const { data } = await apiClient.post<ProcessingScheduleItem>(ep.close(id));
    return data;
  },

  // Admin APIs
  async adminList(
    params: ScheduleListParams,
  ): Promise<PageResponse<ProcessingScheduleItem>> {
    const { data } = await apiClient.get<PageResponse<ProcessingScheduleItem>>(
      adminEp.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          machineId: params.machineId || undefined,
          profileId: params.profileId || params.factoryId || undefined,
        },
      },
    );
    return data;
  },

  async adminGetById(id: number | string): Promise<ProcessingScheduleItem> {
    const { data } = await apiClient.get<ProcessingScheduleItem>(
      adminEp.detail(id),
    );
    return data;
  },

  async adminDelete(id: number | string): Promise<void> {
    await apiClient.delete(adminEp.detail(id));
  },
};
