import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { useMemo } from "react";
import { geoApi, geoKeys } from "../api/geo.api";
import type { GeoProvinceListParams, GeoWardListParams } from "../types";

export function useProvinces(params?: GeoProvinceListParams) {
  return useQuery({
    queryKey: geoKeys.provinces(params),
    queryFn: () => geoApi.getProvinces(params),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useWards(params: {
  provinceCode?: string;
  keyword?: string;
  status?: string;
}) {
  const provinceCode = params.provinceCode;
  return useQuery({
    queryKey: geoKeys.wards(params as GeoWardListParams),
    queryFn: () =>
      provinceCode
        ? geoApi.getWards({ provinceCode, ...params })
        : Promise.resolve({
            content: [],
            totalElements: 0,
            totalPages: 0,
            page: 0,
            size: 0,
          }),
    enabled: !!provinceCode,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useProvinceOptions(params?: GeoProvinceListParams) {
  const { data, ...rest } = useProvinces(params);
  const options = useMemo(() => {
    const list = data?.content ?? [];
    return list.map((p) => ({
      value: p.name,
      label: p.fullName || p.name,
      code: p.code,
    }));
  }, [data]);

  return { options, provinces: data?.content ?? [], ...rest };
}

export function useWardOptions(provinceCode?: string) {
  const { data, ...rest } = useWards({ provinceCode });
  const options = useMemo(() => {
    const list = data?.content ?? [];
    return list.map((w) => ({
      value: w.name,
      label: w.fullName || w.name,
      code: w.code,
    }));
  }, [data]);

  return { options, wards: data?.content ?? [], ...rest };
}

const GEO_STALE = 1000 * 60 * 60 * 24;

/** AsyncSelect fetcher — tìm tỉnh/thành qua API theo keyword (value = tên) */
export const fetchProvinceOptions = async (keyword = "") => {
  const params = {
    keyword: keyword.trim() || undefined,
    status: "active",
    size: 50,
  };
  const data = await queryClient.fetchQuery({
    queryKey: geoKeys.provinces(params),
    queryFn: () => geoApi.getProvinces(params),
    staleTime: GEO_STALE,
  });
  return (data.content ?? []).map((p) => ({
    value: p.name,
    label: p.fullName || p.name,
  }));
};

/** AsyncSelect fetcher theo tỉnh — tìm xã/phường qua API (value = tên) */
export const fetchWardOptions = async (provinceCode: string, keyword = "") => {
  const params = {
    provinceCode,
    keyword: keyword.trim() || undefined,
    size: 50,
  };
  const data = await queryClient.fetchQuery({
    queryKey: geoKeys.wards(params),
    queryFn: () => geoApi.getWards(params),
    staleTime: GEO_STALE,
  });
  return (data.content ?? []).map((w) => ({
    value: w.name,
    label: w.fullName || w.name,
  }));
};
