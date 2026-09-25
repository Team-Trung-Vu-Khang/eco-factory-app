import { useQuery } from "@tanstack/react-query";
import { dashboardApi, dashboardKeys } from "../api/dashboard.api";

export function useFactoryDashboard() {
  return useQuery({ queryKey: dashboardKeys.all, queryFn: dashboardApi.get });
}
