import {
  DemandTrendChart,
  GroupConnectionChart,
  RecentDemandsCard,
  useAdminProcessingServiceChart,
  useAdminProductGroupChart,
  type AdminFactoryDashboardSummaryResponse,
} from "@/features/dashboard";
import type { ProcessingScheduleItem } from "@/features/processing-schedule";
import { DashboardStats } from "./DashboardStats";
import dayjs from "dayjs";

interface DashboardContentProps {
  summary?: AdminFactoryDashboardSummaryResponse;
  latestSchedule?: ProcessingScheduleItem | null;
}

export function DashboardContent({
  summary,
  latestSchedule,
}: DashboardContentProps) {
  const currentYearStart = dayjs().startOf("year").format("YYYY-MM-DD");
  const currentYearEnd = dayjs().endOf("year").format("YYYY-MM-DD");

  const { data: serviceData, isLoading: isLoadingServices } =
    useAdminProcessingServiceChart({
      fromDate: currentYearStart,
      toDate: currentYearEnd,
      limit: 5,
    });

  const { data: productGroupData, isLoading: isLoadingProductGroups } =
    useAdminProductGroupChart({
      fromDate: currentYearStart,
      toDate: currentYearEnd,
      limit: 5,
    });

  return (
    <div className="space-y-6">
      <DashboardStats summary={summary} latestSchedule={latestSchedule} />

      <DemandTrendChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="lg:col-span-3">
          <RecentDemandsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <GroupConnectionChart
          title="Theo nhóm dịch vụ chế biến"
          items={serviceData?.items}
          isLoading={isLoadingServices}
        />
        <GroupConnectionChart
          title="Theo nhóm nông sản"
          items={productGroupData?.items}
          isLoading={isLoadingProductGroups}
        />
      </div>
    </div>
  );
}
