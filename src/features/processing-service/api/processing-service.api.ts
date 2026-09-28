import { API_ENDPOINTS } from "@/config/api-endpoints";
import {
  PROCESSING_SERVICE_LABELS,
  type PageResponse,
} from "@/features/factory";
import { apiClient } from "@/lib/axios";
import type { ProcessingServiceFormValues } from "../schema";
import type {
  ProcessingServiceItem,
  ProcessingServiceListParams,
} from "../types";

export const processingServiceKeys = {
  all: ["processing-services"] as const,
  lists: () => [...processingServiceKeys.all, "list"] as const,
  list: (params: ProcessingServiceListParams) =>
    [...processingServiceKeys.lists(), params] as const,
  detail: (id: string | number) =>
    [...processingServiceKeys.all, "detail", id] as const,
  search: (keyword: string) =>
    [...processingServiceKeys.all, "search", keyword] as const,
};

const syncLabels = (items: ProcessingServiceItem[]) => {
  items.forEach((s) => {
    if (s.id && s.name) {
      PROCESSING_SERVICE_LABELS[String(s.id)] = s.name;
    }
  });
};

const ep = API_ENDPOINTS.masterData.factoryProcessingServices;

export const processingServiceApi = {
  async list(
    params: ProcessingServiceListParams,
  ): Promise<PageResponse<ProcessingServiceItem>> {
    const { data } = await apiClient.get<PageResponse<ProcessingServiceItem>>(
      ep.admin,
      {
        params: {
          page: params.page,
          size: params.size,
          keyword: params.keyword?.trim() || undefined,
          status: params.status || undefined,
        },
      },
    );
    syncLabels(data.content ?? []);
    return data;
  },

  async get(id: string | number): Promise<ProcessingServiceItem> {
    const { data } = await apiClient.get<ProcessingServiceItem>(
      ep.adminDetail(id),
    );
    if (data.id && data.name) {
      PROCESSING_SERVICE_LABELS[String(data.id)] = data.name;
    }
    return data;
  },

  /** Dynamic search endpoint for select dropdowns (size: 20) */
  async searchOptions(
    keyword = "",
    size = 20,
  ): Promise<Array<{ value: string; label: string }>> {
    const { data } = await apiClient.get<PageResponse<ProcessingServiceItem>>(
      ep.public,
      {
        params: {
          status: "active",
          page: 0,
          size,
          keyword: keyword.trim() || undefined,
        },
      },
    );
    const items = data.content ?? [];
    syncLabels(items);
    return items.map((s) => ({
      value: String(s.id),
      label: s.name,
    }));
  },

  /** Public endpoint to get active services for select options */
  async all(): Promise<ProcessingServiceItem[]> {
    const { data } = await apiClient.get<PageResponse<ProcessingServiceItem>>(
      ep.public,
      {
        params: {
          status: "active",
          page: 0,
          size: 100,
        },
      },
    );
    const items = data.content ?? [];
    syncLabels(items);
    return items;
  },

  async create(
    values: ProcessingServiceFormValues,
  ): Promise<ProcessingServiceItem> {
    const payload = {
      name: values.name.trim(),
      code: values.code?.trim() || undefined,
      description: values.description?.trim() || undefined,
      status: values.status || "active",
    };
    const { data } = await apiClient.post<ProcessingServiceItem>(
      ep.admin,
      payload,
    );
    if (data.id && data.name) {
      PROCESSING_SERVICE_LABELS[String(data.id)] = data.name;
    }
    return data;
  },

  async update(
    id: string | number,
    values: ProcessingServiceFormValues,
  ): Promise<ProcessingServiceItem> {
    const payload = {
      name: values.name.trim(),
      code: values.code?.trim() || undefined,
      description: values.description?.trim() || undefined,
      status: values.status || "active",
    };
    const { data } = await apiClient.put<ProcessingServiceItem>(
      ep.adminDetail(id),
      payload,
    );
    if (data.id && data.name) {
      PROCESSING_SERVICE_LABELS[String(data.id)] = data.name;
    }
    return data;
  },

  async remove(id: string | number): Promise<void> {
    await apiClient.delete(ep.adminDetail(id));
    delete PROCESSING_SERVICE_LABELS[String(id)];
  },
};
