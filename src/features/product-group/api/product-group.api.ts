import { API_ENDPOINTS } from "@/config/api-endpoints";
import { PRODUCT_GROUP_LABELS, type PageResponse } from "@/features/factory";
import { apiClient } from "@/lib/axios";
import type { ProductGroupFormValues } from "../schema";
import type { ProductGroup, ProductGroupListParams } from "../types";

export const productGroupKeys = {
  all: ["product-groups"] as const,
  lists: () => [...productGroupKeys.all, "list"] as const,
  list: (params: ProductGroupListParams) =>
    [...productGroupKeys.lists(), params] as const,
  detail: (id: string | number) =>
    [...productGroupKeys.all, "detail", id] as const,
  search: (keyword: string, size = 20) =>
    [...productGroupKeys.all, "search", keyword, size] as const,
};

const syncLabels = (items: ProductGroup[]) => {
  items.forEach((g) => {
    if (g.id && g.name) {
      PRODUCT_GROUP_LABELS[String(g.id)] = g.name;
    }
  });
};

const ep = API_ENDPOINTS.masterData.factoryProductGroups;

export const productGroupApi = {
  async list(
    params: ProductGroupListParams,
  ): Promise<PageResponse<ProductGroup>> {
    const { data } = await apiClient.get<PageResponse<ProductGroup>>(ep.admin, {
      params: {
        page: params.page,
        size: params.size,
        keyword: params.keyword?.trim() || undefined,
        status: params.status || undefined,
      },
    });
    syncLabels(data.content ?? []);
    return data;
  },

  async get(id: string | number): Promise<ProductGroup> {
    const { data } = await apiClient.get<ProductGroup>(ep.adminDetail(id));
    if (data.id && data.name) {
      PRODUCT_GROUP_LABELS[String(data.id)] = data.name;
    }
    return data;
  },

  /** Dynamic search endpoint for select dropdowns (size: 20) */
  async searchOptions(
    keyword = "",
    size = 20,
  ): Promise<Array<{ value: string; label: string }>> {
    const { data } = await apiClient.get<PageResponse<ProductGroup>>(
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
    return items.map((g) => ({
      value: String(g.id),
      label: g.name,
    }));
  },

  /** Public endpoint to get active product groups for select options */
  async all(): Promise<ProductGroup[]> {
    const { data } = await apiClient.get<PageResponse<ProductGroup>>(
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

  async create(values: ProductGroupFormValues): Promise<ProductGroup> {
    const payload = {
      name: values.name.trim(),
      code: values.code?.trim() || undefined,
      crops: values.crops ?? [],
      description: values.description?.trim() || undefined,
      status: values.status || "active",
    };
    const { data } = await apiClient.post<ProductGroup>(ep.admin, payload);
    if (data.id && data.name) {
      PRODUCT_GROUP_LABELS[String(data.id)] = data.name;
    }
    return data;
  },

  async update(
    id: string | number,
    values: ProductGroupFormValues,
  ): Promise<ProductGroup> {
    const payload = {
      name: values.name.trim(),
      code: values.code?.trim() || undefined,
      crops: values.crops ?? [],
      description: values.description?.trim() || undefined,
      status: values.status || "active",
    };
    const { data } = await apiClient.put<ProductGroup>(
      ep.adminDetail(id),
      payload,
    );
    if (data.id && data.name) {
      PRODUCT_GROUP_LABELS[String(data.id)] = data.name;
    }
    return data;
  },

  async remove(id: string | number): Promise<void> {
    await apiClient.delete(ep.adminDetail(id));
    delete PRODUCT_GROUP_LABELS[String(id)];
  },
};
