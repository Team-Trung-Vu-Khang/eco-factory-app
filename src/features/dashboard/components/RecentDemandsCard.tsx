import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FACTORY_ROUTES,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { MapPin } from "lucide-react";
import { Link } from "wouter";
import { PROCESSING_SERVICE_LABELS } from "@/features/factory/constants";
import type { DemandStatus, RecentDemand } from "../types";

const STATUS: Record<DemandStatus, { label: string; className: string }> = {
  SENT: { label: "Mới gửi", className: "bg-sky-50 text-sky-700 border-sky-200" },
  RESPONDED: { label: "Đã phản hồi", className: "bg-violet-50 text-violet-700 border-violet-200" },
  NEGOTIATING: { label: "Đang trao đổi", className: "bg-amber-50 text-amber-700 border-amber-200" },
  CONNECTED: { label: "Đã kết nối", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  COMPLETED: { label: "Hoàn thành", className: "bg-slate-100 text-slate-700 border-slate-200" },
  CANCELLED: { label: "Đã hủy", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

export function RecentDemandsCard({ demands }: { demands: RecentDemand[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="space-y-1.5">
          <CardTitle className="text-base">Nhu cầu gần đây</CardTitle>
          <CardDescription>Nhu cầu gửi tới hoặc phù hợp với nhà máy</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={FACTORY_ROUTES.demands}>Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100">
          {demands.map((d) => (
            <li key={d.id} className="flex flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {d.productName} · {d.quantity} {d.unit}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {d.requesterName} · {d.services.map((s) => PROCESSING_SERVICE_LABELS[s]).join(", ")}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {d.provinceName}
                  {d.distanceKm !== null && ` · ${d.distanceKm} km`}
                  {` · ${dayjs(d.createdAt).format("DD/MM/YYYY")}`}
                </p>
              </div>
              <Badge variant="outline" className={`w-fit shrink-0 ${STATUS[d.status].className}`}>
                {STATUS[d.status].label}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
