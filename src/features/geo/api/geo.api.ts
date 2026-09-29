import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiClient } from "@/lib/axios";
import type { PageResponse } from "@/features/factory";
import type {
  GeoProvince,
  GeoProvinceListParams,
  GeoWard,
  GeoWardListParams,
} from "../types";

export const geoKeys = {
  all: ["geo"] as const,
  provinces: (params?: GeoProvinceListParams) =>
    [...geoKeys.all, "provinces", params] as const,
  provinceDetail: (code: string) =>
    [...geoKeys.all, "province", code] as const,
  wards: (params: GeoWardListParams) =>
    [...geoKeys.all, "wards", params] as const,
  wardDetail: (code: string) => [...geoKeys.all, "ward", code] as const,
};

export const geoApi = {
  async getProvinces(
    params: GeoProvinceListParams = { size: 100, status: "active" },
  ): Promise<PageResponse<GeoProvince>> {
    const { data } = await apiClient.get<PageResponse<GeoProvince>>(
      API_ENDPOINTS.masterData.geo.provinces,
      { params },
    );
    return data;
  },

  async getWards(params: GeoWardListParams): Promise<PageResponse<GeoWard>> {
    const { data } = await apiClient.get<PageResponse<GeoWard>>(
      API_ENDPOINTS.masterData.geo.wards,
      { params: { size: 100, status: "active", ...params } },
    );
    return data;
  },

  async getProvince(code: string): Promise<GeoProvince> {
    const { data } = await apiClient.get<GeoProvince>(
      API_ENDPOINTS.masterData.geo.provinceDetail(code),
    );
    return data;
  },

  async getWard(code: string): Promise<GeoWard> {
    const { data } = await apiClient.get<GeoWard>(
      API_ENDPOINTS.masterData.geo.wardDetail(code),
    );
    return data;
  },
};
