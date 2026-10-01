import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dashboardApi, dashboardKeys } from "../api/dashboard.api";
import type {
  AdminFactoryCatalogChartParams,
  AdminFactoryConnectionChartParams,
} from "../types";

export function useAdminDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardApi.getSummary(),
  });
}

export function useAdminConnectionChart(
  params?: AdminFactoryConnectionChartParams,
) {
  return useQuery({
    queryKey: dashboardKeys.connectionChart(params),
    queryFn: () => dashboardApi.getConnectionChart(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminProcessingServiceChart(
  params: AdminFactoryCatalogChartParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: dashboardKeys.processingServiceChart(params),
    queryFn: () => dashboardApi.getProcessingServiceChart(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? (!!params.fromDate && !!params.toDate),
  });
}

export function useAdminProductGroupChart(
  params: AdminFactoryCatalogChartParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: dashboardKeys.productGroupChart(params),
    queryFn: () => dashboardApi.getProductGroupChart(params),
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? (!!params.fromDate && !!params.toDate),
  });
}
