import {
  DemandTrendChart,
  GroupConnectionChart,
  RecentDemandsCard,
  type FactoryDashboard,
} from "@/features/dashboard";
import { DashboardStats } from "./DashboardStats";

export function DashboardContent({ data }: { data: FactoryDashboard }) {
  return (
    <div className="space-y-6">
      <DashboardStats stats={data.stats} />

      <DemandTrendChart data={data.monthlyDemands} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="lg:col-span-3">
          <RecentDemandsCard demands={data.recentDemands} />
        </div>
        {/* <MachineCapacityCard machines={data.machines} /> */}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <GroupConnectionChart
          title="Theo nhóm dịch vụ"
          data={data.serviceGroupStats}
        />
        <GroupConnectionChart
          title="Theo nhóm nông sản"
          data={data.productGroupStats}
        />
      </div>
    </div>
  );
}
