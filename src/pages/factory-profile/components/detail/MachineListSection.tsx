import dayjs from "dayjs";
import { CalendarRange, Gauge, Layers, PackageCheck, Sprout, Wrench } from "lucide-react";
import {
  CAPACITY_UNIT_LABELS,
  MACHINE_STATUS_LABELS,
  PROCESSING_SERVICE_LABELS,
  PRODUCT_GROUP_LABELS,
  type Factory,
} from "@/features/factory";
import { DetailCard, DetailField } from "@/components/common/DetailCard";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "…");

function Chips({ items, className }: { items: string[]; className: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t} className={`rounded-md border px-2 py-0.5 text-xs font-medium ${className}`}>
          {t}
        </span>
      ))}
    </div>
  );
}

export function MachineListSection({ factory }: { factory: Factory }) {
  const title = `Máy móc & công suất (${factory.machines.length} máy)`;

  if (!factory.offersExternalCapacity || factory.machines.length === 0) {
    return (
      <DetailCard icon={Wrench} title={title}>
        <p className="text-sm text-slate-500">Cơ sở chưa cung cấp năng lực chế biến cho bên ngoài.</p>
      </DetailCard>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2 xl:gap-6">
      {factory.machines.map((m) => {
        const active = m.status === "ACTIVE";
        const unit = CAPACITY_UNIT_LABELS[m.capacityUnit];
        return (
          <section key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Máy móc</p>
                <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{m.name}</h3>
              </div>
              <span
                className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                  active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {MACHINE_STATUS_LABELS[m.status]}
              </span>
            </header>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-4 sm:p-5">
              <DetailField icon={Gauge} label="Công suất tối đa" iconClassName="text-blue-500">
                <span className="text-xl font-bold text-slate-900 tabular-nums">{fmt.format(m.maxCapacity)}</span>
                <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>
              </DetailField>
              <DetailField icon={PackageCheck} label="Đang nhận" iconClassName="text-emerald-500">
                {m.availableCapacity > 0 ? (
                  <>
                    <span className="text-xl font-bold text-emerald-600 tabular-nums">{fmt.format(m.availableCapacity)}</span>
                    <span className="ml-1 text-sm font-normal text-slate-500">{CAPACITY_UNIT_LABELS[m.availableUnit ?? m.capacityUnit]}</span>
                  </>
                ) : (
                  <span className="text-sm font-normal text-slate-400">Chưa đăng lịch</span>
                )}
              </DetailField>
              <div className="col-span-2">
                <DetailField icon={Layers} label="Dịch vụ" iconClassName="text-emerald-500">
                  <Chips items={m.functions.map((f) => PROCESSING_SERVICE_LABELS[f])} className="border-emerald-100 bg-emerald-50 text-emerald-700" />
                </DetailField>
              </div>
              <div className="col-span-2">
                <DetailField icon={Sprout} label="Nhóm nông sản" iconClassName="text-lime-600">
                  <Chips items={m.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id)} className="border-lime-100 bg-lime-50 text-lime-700" />
                </DetailField>
              </div>
              {m.availableCapacity > 0 && (
                <div className="col-span-2">
                  <DetailField icon={CalendarRange} label="Lịch nhận chế biến" iconClassName="text-violet-500">
                    <span className="text-sm font-medium tabular-nums">
                      {date(m.availableFrom)} → {date(m.availableTo)}
                    </span>
                  </DetailField>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
