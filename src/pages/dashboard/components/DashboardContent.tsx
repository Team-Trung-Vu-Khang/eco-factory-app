import {
  DemandTrendChart,
  MachineCapacityCard,
  ProfileStatusCard,
  RecentDemandsCard,
  type FactoryDashboard,
} from "@/features/dashboard";
import { DashboardStats } from "./DashboardStats";

export function DashboardContent({ data }: { data: FactoryDashboard }) {
  return (
    <div className="space-y-6">
      <DashboardStats stats={data.stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="lg:col-span-2">
          <DemandTrendChart data={data.monthlyDemands} />
        </div>
        <ProfileStatusCard profile={data.profile} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="lg:col-span-2">
          <RecentDemandsCard demands={data.recentDemands} />
        </div>
        <MachineCapacityCard machines={data.machines} />
      </div>
    </div>
  );
}
