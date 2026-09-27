import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { CalendarRange, MapPin, Phone } from "lucide-react";
import type { FactorySearchResult } from "@/features/connection";
import {
  CAPACITY_UNIT_LABELS,
  PROCESSING_SERVICE_LABELS,
  getProvinceName,
  getWardName,
} from "@/features/factory";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d: string) => dayjs(d).format("DD/MM/YYYY");

/** Read-only — connecting is done once for the whole search */
export function FactoryResultCard({ result }: { result: FactorySearchResult }) {
  const { factory: f, distanceKm, machines } = result;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {f.avatarUrl ? (
          <img
            src={f.avatarUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-lg bg-emerald-50" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">{f.name}</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {[
                f.location.address,
                getWardName(f.location.provinceCode, f.location.wardCode),
                getProvinceName(f.location.provinceCode),
              ].join(", ")}
              {distanceKm !== undefined && (
                <span className="font-medium text-emerald-700 tabular-nums">
                  {" "}
                  · ~{fmt.format(Math.round(distanceKm))} km
                </span>
              )}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {f.representative.fullName} · {f.representative.phone}
            </span>
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {machines.map((m) => (
          <li key={m.id} className="rounded-xl bg-slate-50 p-3">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-slate-800">{m.name}</p>
              <div className="flex flex-wrap gap-1">
                {m.functions.map((fn) => (
                  <Badge key={fn} variant="secondary" className="font-normal">
                    {PROCESSING_SERVICE_LABELS[fn]}
                  </Badge>
                ))}
              </div>
              <p className="flex items-center gap-1 text-xs tabular-nums text-slate-600">
                <CalendarRange className="h-3.5 w-3.5" />
                {date(m.scheduleFrom)} – {date(m.scheduleTo)} · nhận tối đa{" "}
                <span className="font-medium text-emerald-700">
                  {fmt.format(m.availableCapacity)}{" "}
                  {CAPACITY_UNIT_LABELS[m.availableUnit ?? m.capacityUnit]}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
