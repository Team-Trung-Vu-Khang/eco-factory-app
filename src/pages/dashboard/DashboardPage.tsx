import PageWrapper from "@/components/common/PageWrapper";
import { useAdminDashboardSummary } from "@/features/dashboard";
import { scheduleApi, scheduleKeys } from "@/features/processing-schedule";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardContent,
  DashboardError,
  DashboardSkeleton,
} from "./components";

export default function DashboardPage() {
  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    refetch: refetchSummary,
  } = useAdminDashboardSummary();

  const {
    data: schedulePage,
    isLoading: isLoadingSchedule,
    refetch: refetchSchedule,
  } = useQuery({
    queryKey: scheduleKeys.adminList({ page: 0, size: 1 }),
    queryFn: () => scheduleApi.adminList({ page: 0, size: 1 }),
  });

  const isLoading = isLoadingSummary || isLoadingSchedule;
  const isError = isErrorSummary;

  const handleRetry = () => {
    refetchSummary();
    refetchSchedule();
  };

  const latestSchedule = schedulePage?.content?.[0] || null;

  return (
    <PageWrapper
      title="Tổng quan nhà máy"
      description="Công suất, nhu cầu chế biến và tình hình kết nối trên MEVI Factories"
    >
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <DashboardError onRetry={handleRetry} />
      ) : (
        <DashboardContent summary={summary} latestSchedule={latestSchedule} />
      )}
    </PageWrapper>
  );
}
