import { CalendarCheck, CalendarX, Gauge, MapPin, Phone } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import { QUANTITY_UNIT_LABELS, type Demand, type FactoryMatch } from "@/features/demand";
import { PROCESSING_SERVICE_LABELS, PRODUCT_GROUP_LABELS, getProvinceName } from "@/features/factory";
import { DemandStatusBadge } from "@/pages/demand/components/DemandStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (v?: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "");

export function DemandMatchCard({ match: m, rank }: { match: FactoryMatch & { demand: Demand }; rank: number }) {
  const d = m.demand;
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700 tabular-nums">
          {rank}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link href={ROUTES.demandDetail(d.id)} className="font-medium text-slate-900 hover:text-emerald-700 hover:underline">
                {d.productName}
              </Link>
              <span className="text-sm text-slate-500 tabular-nums">
                {" "}· {PRODUCT_GROUP_LABELS[d.productGroupId]} · {fmt.format(d.quantity)} {QUANTITY_UNIT_LABELS[d.quantityUnit]}
              </span>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {getProvinceName(d.materialLocation.provinceCode)}
                  {m.distanceKm !== undefined && <span className="tabular-nums"> · ~{fmt.format(Math.round(m.distanceKm))} km</span>}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {d.requester.fullName} · {d.requester.organizationName} · {d.requester.phone}
                </span>
              </p>
            </div>
            <DemandStatusBadge status={d.status} />
          </div>

          <p className="text-sm text-slate-700">
            {d.services.map((s) => PROCESSING_SERVICE_LABELS[s]).join(", ")}
            <span className="text-slate-500 tabular-nums"> · {[date(d.neededFrom), date(d.neededTo)].filter(Boolean).join(" – ")}</span>
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className={`flex items-center gap-1 ${m.timeFits ? "text-emerald-700" : "text-amber-700"}`}>
              {m.timeFits ? <CalendarCheck className="h-3.5 w-3.5" /> : <CalendarX className="h-3.5 w-3.5" />}
              {m.timeFits ? "Lịch máy trùng thời gian cần" : "Lịch máy chưa trùng thời gian cần"}
            </span>
            {m.estimatedDays !== undefined && (
              <span className="flex items-center gap-1 text-slate-600 tabular-nums">
                <Gauge className="h-3.5 w-3.5" />
                ~{m.estimatedDays} ngày để xử lý hết
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
