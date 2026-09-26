import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CalendarCheck, CalendarX, Gauge, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import type { FactoryMatch } from "@/features/demand";
import { CAPACITY_UNIT_LABELS, CERTIFICATION_TYPE_LABELS, getProvinceName } from "@/features/factory";

const fmt = new Intl.NumberFormat("vi-VN");

export function FactoryMatchCard({ match: m, rank }: { match: FactoryMatch; rank: number }) {
  const f = m.factory;
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700 tabular-nums">
          {rank}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link href={ROUTES.profileDetail(f.id)} className="font-medium text-slate-900 hover:text-emerald-700 hover:underline">
                {f.name}
              </Link>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {getProvinceName(f.location.provinceCode)}
                  {m.distanceKm !== undefined && <span className="tabular-nums"> · ~{fmt.format(Math.round(m.distanceKm))} km</span>}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {f.representative.fullName} · {f.representative.phone}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {f.certifications.map((c) => (
                <Badge key={c.id} variant="outline" className="border-slate-200 text-slate-600">
                  {CERTIFICATION_TYPE_LABELS[c.type]}
                </Badge>
              ))}
            </div>
          </div>

          <ul className="space-y-1 text-sm">
            {m.machines.map((mc) => (
              <li key={mc.id} className="flex flex-wrap justify-between gap-x-4 text-slate-700">
                <span>{mc.name}</span>
                <span className="text-slate-500 tabular-nums">
                  rảnh {fmt.format(mc.availableCapacity)} {CAPACITY_UNIT_LABELS[mc.availableUnit ?? mc.capacityUnit]}
                </span>
              </li>
            ))}
          </ul>

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
