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
        <ul className="space-y-3">
          {factory.machines.map((m) => {
            const unit = CAPACITY_UNIT_LABELS[m.capacityUnit];
            return (
              <li key={m.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <Badge variant="outline" className={m.status === "ACTIVE" ? "text-emerald-700" : "text-amber-700"}>
                    {MACHINE_STATUS_LABELS[m.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {m.functions.map((f) => PROCESSING_SERVICE_LABELS[f]).join(", ")} ·{" "}
                  {m.productGroupIds.map((id) => PRODUCT_GROUP_LABELS[id] ?? id).join(", ")}
                </p>
                <p className="mt-1 text-sm tabular-nums text-slate-600">
                  Công suất tối đa {fmt.format(m.maxCapacity)} {unit}
                  {m.availableCapacity > 0 ? (
                    <>
                      {" "}· Đang nhận <span className="font-medium text-emerald-700">{fmt.format(m.availableCapacity)} {CAPACITY_UNIT_LABELS[m.availableUnit ?? m.capacityUnit]}</span> từ{" "}
                      {date(m.availableFrom)} đến {date(m.availableTo)}
                    </>
                  ) : (
                    " · Chưa đăng lịch nhận chế biến"
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </FormSection>
  );
}
