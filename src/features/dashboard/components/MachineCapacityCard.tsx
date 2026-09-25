import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { MachineCapacity } from "../types";

const STATUS_LABEL: Record<MachineCapacity["status"], string> = {
  ACTIVE: "Đang hoạt động",
  MAINTENANCE: "Bảo trì",
  PAUSED: "Tạm dừng",
};

const fmt = new Intl.NumberFormat("vi-VN");

export function MachineCapacityCard({ machines }: { machines: MachineCapacity[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Công suất máy móc</CardTitle>
        <CardDescription>Phần xanh đậm là công suất có thể nhận cho bên ngoài</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {machines.map((m) => {
          const pct = m.maxCapacity ? (m.availableCapacity / m.maxCapacity) * 100 : 0;
          return (
            <div key={m.id} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium text-slate-800">{m.name}</span>
                {m.status !== "ACTIVE" && (
                  <Badge variant="outline" className="shrink-0 text-amber-700">
                    {STATUS_LABEL[m.status]}
                  </Badge>
                )}
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full rounded-full bg-emerald-600" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs tabular-nums text-slate-500">
                Khả dụng {fmt.format(m.availableCapacity)} / {fmt.format(m.maxCapacity)} {m.unit}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
