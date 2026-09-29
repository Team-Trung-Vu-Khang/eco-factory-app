import { useQuery } from "@tanstack/react-query";
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
