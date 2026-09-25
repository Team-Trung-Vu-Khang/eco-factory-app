import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, Gauge, Share2, Warehouse } from "lucide-react";
import { useWarehouseSummary } from "@/features/warehouse";

export function WarehouseStats() {
  const { data } = useWarehouseSummary();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Tổng số kho" value={data?.total ?? "—"} icon={Warehouse} />
      <StatsCard title="Đang hoạt động" value={data?.active ?? "—"} icon={Activity} />
      <StatsCard title="Mức sử dụng trung bình" value={data ? `${data.avgUtilizationPercent}%` : "—"} icon={Gauge} />
      <StatsCard title="Nhận bảo quản bên ngoài" value={data?.acceptingExternal ?? "—"} change="kho còn chỗ trống" changeType="neutral" icon={Share2} />
    </div>
  );
}
