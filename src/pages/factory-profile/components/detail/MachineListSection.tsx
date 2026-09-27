import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { FormSection } from "@/components/form";
import {
  CAPACITY_UNIT_LABELS,
  MACHINE_STATUS_LABELS,
  PROCESSING_SERVICE_LABELS,
  PRODUCT_GROUP_LABELS,
  type Factory,
} from "@/features/factory";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "…");

export function MachineListSection({ factory }: { factory: Factory }) {
  return (
    <FormSection title="Máy móc & công suất">
      {!factory.offersExternalCapacity ? (
        <p className="text-sm text-slate-500">Cơ sở chưa cung cấp năng lực chế biến cho bên ngoài.</p>
      ) : (
        <ul className="space-y-2 sm:space-y-3">
          {factory.machines.map((m) => {
            const unit = CAPACITY_UNIT_LABELS[m.capacityUnit];
            return (
              <li key={m.id} className="rounded-lg border border-slate-200 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 text-sm font-medium text-slate-900 sm:text-base">{m.name}</p>
                  <Badge variant="outline" className={`shrink-0 px-1.5 py-0 text-[11px] sm:px-2.5 sm:py-0.5 sm:text-xs ${m.status === "ACTIVE" ? "text-emerald-700" : "text-amber-700"}`}>
                    {MACHINE_STATUS_LABELS[m.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm sm:text-slate-600">
                  {m.functions.map((f) => PROCESSING_SERVICE_LABELS[f]).join(", ")} ·{" "}
                  {m.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id).join(", ")}
                </p>
                {/* Phones: one fact per line; wider screens: a single sentence */}
                <div className="mt-1.5 text-xs tabular-nums text-slate-600 sm:mt-1 sm:text-sm">
                  <span className="block sm:inline!">Tối đa {fmt.format(m.maxCapacity)} {unit}</span>
                  {m.availableCapacity > 0 ? (
                    <span className="block sm:inline!">
                      <span className="hidden sm:inline!"> · </span>
                      Đang nhận <span className="font-medium text-emerald-700">{fmt.format(m.availableCapacity)} {CAPACITY_UNIT_LABELS[m.availableUnit ?? m.capacityUnit]}</span> · {date(m.availableFrom)} → {date(m.availableTo)}
                    </span>
                  ) : (
                    <span className="block text-slate-400 sm:inline!">
                      <span className="hidden sm:inline!"> · </span>Chưa đăng lịch nhận chế biến
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </FormSection>
  );
}
