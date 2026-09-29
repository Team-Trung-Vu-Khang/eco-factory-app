import { API_ENDPOINTS } from "@/config/api-endpoints";
import type { PageResponse } from "@/features/factory";
import { apiClient } from "@/lib/axios";
import type {
  FactoryMachineInput,
  FactoryMachineItem,
  FactoryMachineListParams,
} from "../types";

export const machineKeys = {
  all: ["factory-machines"] as const,
  lists: () => [...machineKeys.all, "list"] as const,
  list: (params: FactoryMachineListParams) =>
    [...machineKeys.lists(), params] as const,
  detail: (id: string | number) => [...machineKeys.all, "detail", id] as const,
};

export const adminMachineKeys = {
  all: ["admin-factory-machines"] as const,
  lists: () => [...adminMachineKeys.all, "list"] as const,
  list: (params: FactoryMachineListParams) =>
    [...adminMachineKeys.lists(), params] as const,
  detail: (id: string | number) =>
    [...adminMachineKeys.all, "detail", id] as const,
};

const ep = API_ENDPOINTS.factory.machines;
const adminEp = API_ENDPOINTS.admin.factory.machines;

export const factoryMachineApi = {
  async list(
    params: FactoryMachineListParams,
  ): Promise<PageResponse<FactoryMachineItem>> {
    const { data } = await apiClient.get<PageResponse<FactoryMachineItem>>(
      ep.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          processingServiceId: params.processingServiceId || undefined,
          productGroupId: params.productGroupId || undefined,
        },
      },
    );
    return data;
  },

  async get(id: string | number): Promise<FactoryMachineItem> {
    const { data } = await apiClient.get<FactoryMachineItem>(ep.detail(id));
    return data;
  },

  async create(input: FactoryMachineInput): Promise<FactoryMachineItem> {
    const { data } = await apiClient.post<FactoryMachineItem>(ep.base, input);
    return data;
  },

  async update(
    id: string | number,
    input: FactoryMachineInput,
  ): Promise<FactoryMachineItem> {
    const { data } = await apiClient.put<FactoryMachineItem>(
      ep.detail(id),
      input,
    );
    return data;
  },

  async remove(id: string | number): Promise<void> {
    await apiClient.delete(ep.detail(id));
  },
};

export const adminFactoryMachineApi = {
  async list(
    params: FactoryMachineListParams,
  ): Promise<PageResponse<FactoryMachineItem>> {
    const { data } = await apiClient.get<PageResponse<FactoryMachineItem>>(
      adminEp.base,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
          processingServiceId: params.processingServiceId || undefined,
          productGroupId: params.productGroupId || undefined,
          profileId: params.profileId || undefined,
        },
      },
    );
    return data;
  },

  async get(id: string | number): Promise<FactoryMachineItem> {
    const { data } = await apiClient.get<FactoryMachineItem>(
      adminEp.detail(id),
    );
    return data;
  },

  async remove(id: string | number): Promise<void> {
    await apiClient.delete(adminEp.detail(id));
  },
};
