import { useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import PageWrapper from "@/components/common/PageWrapper";
import { useAdminDashboardSummary } from "@/features/dashboard";
import { scheduleApi, scheduleKeys } from "@/features/processing-schedule";
import { useQuery } from "@tanstack/react-query";
import {
  DashboardContent,
  DashboardError,
  DashboardSkeleton,
} from "./components";
import { MobileDashboard } from "./components/MobileDashboard";
import { useMobileUiMode } from "@/hooks/useMobileUiMode";

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
  const isMobile = useIsMobile();
  const mobileUiMode = useMobileUiMode();

  if (isMobile && mobileUiMode === "app")
    return (
      <MobileDashboard
        summary={summary}
        latestSchedule={latestSchedule}
        isLoading={isLoading}
        isError={isError}
        onRetry={handleRetry}
      />
    );

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
