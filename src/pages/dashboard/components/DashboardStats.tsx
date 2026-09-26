import { Gauge, Handshake, Inbox, MessagesSquare } from "lucide-react";
import { StatCard, type DashboardStats as Stats } from "@/features/dashboard";

export function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 [&>*]:min-w-0">
      <StatCard
        icon={Gauge}
        label="Công suất khả dụng"
        value={`${stats.availableCapacityTonPerDay} tấn/ngày`}
        hint={`trên tổng ${stats.maxCapacityTonPerDay} tấn/ngày`}
      />
      <StatCard
        icon={Inbox}
        label="Nhu cầu phù hợp mới"
        value={stats.newMatchingDemands}
        hint="trong 7 ngày qua"
      />
      <StatCard
        icon={MessagesSquare}
        label="Đang trao đổi"
        value={stats.activeDemands}
        hint="nhu cầu chưa chốt"
      />
      <StatCard
        icon={Handshake}
        label="Đã kết nối"
        value={stats.connectedDemands}
        hint="từ trước đến nay"
      />
    </div>
  );
}
