import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiClient } from "@/lib/axios";
import { queryClient } from "@/lib/query-client";

export interface OrganizationTypeItem {
  id: number;
  code: string;
  name: string;
  description?: string;
  status?: string;
}

export interface OrganizationTypeOption {
  value: string;
  label: string;
}

export const organizationTypeKeys = {
  all: ["organization-types"] as const,
  lists: () => [...organizationTypeKeys.all, "list"] as const,
  search: (keyword: string) =>
    [...organizationTypeKeys.all, "search", keyword] as const,
};

export const organizationTypeApi = {
  async list(): Promise<OrganizationTypeItem[]> {
    const { data } = await apiClient.get<
      { content: OrganizationTypeItem[] } | OrganizationTypeItem[]
    >(API_ENDPOINTS.masterData.organizationTypes.public, {
      params: { size: 100, status: "active" },
    });
    if (Array.isArray(data)) return data;
    return data.content ?? [];
  },

  async searchOptions(keyword = ""): Promise<OrganizationTypeOption[]> {
    try {
      const { data } = await apiClient.get<
        { content: OrganizationTypeItem[] } | OrganizationTypeItem[]
      >(API_ENDPOINTS.masterData.organizationTypes.public, {
        params: {
          keyword: keyword.trim() || undefined,
          status: "active",
          page: 0,
          size: 20,
        },
      });
      const items = Array.isArray(data) ? data : (data.content ?? []);
      return items.map((item) => ({
        value: String(item.id),
        label: item.name,
      }));
    } catch (err) {
      console.error("Failed to fetch organization types", err);
      return [];
    }
  },
};

export async function fetchOrganizationTypeOptions(
  keyword = "",
): Promise<OrganizationTypeOption[]> {
  return queryClient.fetchQuery({
    queryKey: organizationTypeKeys.search(keyword),
    queryFn: () => organizationTypeApi.searchOptions(keyword),
    staleTime: 30_000,
  });
}
