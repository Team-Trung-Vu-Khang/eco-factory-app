import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import {
  masterCertificateApi,
  masterCertificateKeys,
} from "../api/master-certificate.api";
import type { MasterCertificateListParams } from "../master-certificate.types";

export function useMasterCertificates(params: MasterCertificateListParams) {
  return useQuery({
    queryKey: masterCertificateKeys.list(params),
    queryFn: () => masterCertificateApi.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/** Disabled until id is set */
export function useMasterCertificate(id?: string | number) {
  return useQuery({
    queryKey: masterCertificateKeys.detail(id ?? ""),
    queryFn: () => masterCertificateApi.get(id!),
    enabled: id != null && id !== "",
    staleTime: 30_000,
  });
}

/** AsyncSelect fetcher (cached 30s) */
export const fetchMasterCertificateOptions = (keyword = "") =>
  queryClient.fetchQuery({
    queryKey: masterCertificateKeys.search(keyword, 20),
    queryFn: () => masterCertificateApi.searchOptions(keyword, 20),
    staleTime: 30_000,
  });
