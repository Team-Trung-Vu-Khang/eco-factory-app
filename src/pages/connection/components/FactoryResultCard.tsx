import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { CalendarRange, Handshake, MapPin, Phone } from "lucide-react";
import type { FactorySearchResult, MatchedMachine } from "@/features/connection";
import { CAPACITY_UNIT_LABELS, PROCESSING_SERVICE_LABELS, getProvinceName, getWardName } from "@/features/factory";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d: string) => dayjs(d).format("DD/MM/YYYY");

interface FactoryResultCardProps {
  result: FactorySearchResult;
  /** Schedule ids the farmer already has a pending request for */
  pendingScheduleIds: Set<string>;
  onRegister: (machine: MatchedMachine) => void;
}

export function FactoryResultCard({ result, pendingScheduleIds, onRegister }: FactoryResultCardProps) {
  const { factory: f, distanceKm, machines } = result;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {f.avatarUrl ? (
          <img src={f.avatarUrl} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-lg bg-emerald-50" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">{f.name}</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {[f.location.address, getWardName(f.location.provinceCode, f.location.wardCode), getProvinceName(f.location.provinceCode)].join(", ")}
              {distanceKm !== undefined && <span className="font-medium text-emerald-700 tabular-nums"> · ~{fmt.format(Math.round(distanceKm))} km</span>}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {f.representative.fullName} · {f.representative.phone}
            </span>
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {machines.map((m) => {
          const pending = pendingScheduleIds.has(m.scheduleId);
          return (
            <li key={m.id} className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
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
                    {fmt.format(m.availableCapacity)} {CAPACITY_UNIT_LABELS[m.capacityUnit]}
                  </span>
                </p>
              </div>
              <Button size="sm" variant={pending ? "outline" : "default"} disabled={pending} onClick={() => onRegister(m)} className="shrink-0">
                <Handshake className="mr-1.5 h-4 w-4" />
                {pending ? "Đang chờ kết nối" : "Đăng ký kết nối"}
              </Button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
