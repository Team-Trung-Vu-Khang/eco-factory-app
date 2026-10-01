import { API_ENDPOINTS } from "@/config/api-endpoints";
import { apiClient } from "@/lib/axios";
import type {
  AdminFactoryCatalogChartParams,
  AdminFactoryCatalogChartResponse,
  AdminFactoryConnectionChartParams,
  AdminFactoryConnectionChartResponse,
  AdminFactoryDashboardSummaryResponse,
} from "../types";

export const dashboardKeys = {
  all: ["admin-factory-dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  connectionChart: (params?: AdminFactoryConnectionChartParams) =>
    [...dashboardKeys.all, "connection-chart", params] as const,
  processingServiceChart: (params: AdminFactoryCatalogChartParams) =>
    [...dashboardKeys.all, "processing-service-chart", params] as const,
  productGroupChart: (params: AdminFactoryCatalogChartParams) =>
    [...dashboardKeys.all, "product-group-chart", params] as const,
};

const adminDashboardEp = API_ENDPOINTS.admin.factory.dashboard;

export const dashboardApi = {
  async getSummary(): Promise<AdminFactoryDashboardSummaryResponse> {
    const { data } = await apiClient.get<AdminFactoryDashboardSummaryResponse>(
      adminDashboardEp.summary,
    );
    return data;
  },

  async getConnectionChart(
    params?: AdminFactoryConnectionChartParams,
  ): Promise<AdminFactoryConnectionChartResponse> {
    const { data } = await apiClient.get<AdminFactoryConnectionChartResponse>(
      adminDashboardEp.connectionChart,
      {
        params: {
          periodType: params?.periodType || undefined,
          fromDate: params?.fromDate || undefined,
          toDate: params?.toDate || undefined,
        },
      },
    );
    return data;
  },

  async getProcessingServiceChart(
    params: AdminFactoryCatalogChartParams,
  ): Promise<AdminFactoryCatalogChartResponse> {
    const { data } = await apiClient.get<AdminFactoryCatalogChartResponse>(
      adminDashboardEp.processingServiceChart,
      {
        params: {
          fromDate: params.fromDate,
          toDate: params.toDate,
          limit: params.limit ?? 5,
        },
      },
    );
    return data;
  },

  async getProductGroupChart(
    params: AdminFactoryCatalogChartParams,
  ): Promise<AdminFactoryCatalogChartResponse> {
    const { data } = await apiClient.get<AdminFactoryCatalogChartResponse>(
      adminDashboardEp.productGroupChart,
      {
        params: {
          fromDate: params.fromDate,
          toDate: params.toDate,
          limit: params.limit ?? 5,
        },
      },
    );
    return data;
  },
};
