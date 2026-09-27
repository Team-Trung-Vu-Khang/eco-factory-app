import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  FACTORY_ROUTES,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { useState } from "react";
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

const CONNECTED_STATUSES: DemandStatus[] = ["CONNECTED", "COMPLETED"];

const TABS = [
  { key: "requests", label: "Yêu cầu gần nhất" },
  { key: "connections", label: "Kết nối gần nhất" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function RecentDemandsCard({ demands }: { demands: RecentDemand[] }) {
  const [tab, setTab] = useState<TabKey>("requests");
  const items = demands.filter((d) =>
    tab === "connections"
      ? CONNECTED_STATUSES.includes(d.status)
      : !CONNECTED_STATUSES.includes(d.status),
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={FACTORY_ROUTES.demands}>Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100">
          {items.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-slate-500">
              {tab === "connections" ? "Chưa có kết nối nào." : "Chưa có yêu cầu nào."}
            </li>
          )}
          {items.map((d) => (
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
