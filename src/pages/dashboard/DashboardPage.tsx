import PageWrapper from "@/components/common/PageWrapper";
import { useFactoryDashboard } from "@/features/dashboard";
import {
  DashboardContent,
  DashboardError,
  DashboardSkeleton,
} from "./components";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useFactoryDashboard();

  return (
    <PageWrapper
      title="Tổng quan nhà máy"
      description="Công suất, nhu cầu chế biến và tình trạng hồ sơ trên MEVI Factories"
    >
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !data ? (
        <DashboardError onRetry={() => refetch()} />
      ) : (
        <DashboardContent data={data} />
      )}
    </PageWrapper>
  );
}
