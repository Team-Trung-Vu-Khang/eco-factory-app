import { CheckCircle2, Circle } from "lucide-react";
import { FormSection } from "@/components/form";
import {
  DEMAND_FUNNEL,
  DEMAND_STATUS_LABELS,
  type Demand,
} from "@/features/demand";

const KPI_ITEMS: { key: keyof Demand["kpi"]; label: string }[] = [
  { key: "isProfileComplete", label: "Profile đã hoàn thiện" },
  { key: "hasConfirmedDemand", label: "Đã xác nhận có nhu cầu" },
  { key: "hasViewedFactory", label: "Đã xem ≥ 1 cơ sở (tiếp cận)" },
  { key: "hasFactoryResponse", label: "Có ≥ 1 cơ sở phản hồi (kết nối)" },
];

/** Funnel position, factory counters and KPI flags — all system-computed */
export function DemandProgress({ demand: d }: { demand: Demand }) {
  const current = DEMAND_FUNNEL.indexOf(d.status);
  const counters = [
    { label: "Cơ sở đã xem", value: d.viewedFactoryCount },
    { label: "Đã gửi nhu cầu", value: d.sentFactoryCount },
    { label: "Đã phản hồi", value: d.respondedFactoryCount },
  ];

  return (
    <div className="grid gap-x-10 gap-y-8 lg:grid-cols-2">
      <FormSection
        title="Tiến trình"
        description={d.status === "CANCELLED" ? "Nhu cầu đã bị hủy" : undefined}
      >
        <div className="space-y-6">
          <ol className="flex flex-wrap gap-1.5 text-xs">
            {DEMAND_FUNNEL.map((s, i) => {
              const done = d.status !== "CANCELLED" && i <= current;
              return (
                <li
                  key={s}
                  className={`rounded-full border px-2.5 py-1 ${
                    i === current
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : done
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 text-slate-400"
                  }`}
                >
                  {DEMAND_STATUS_LABELS[s]}
                </li>
              );
            })}
          </ol>
          <dl className="grid grid-cols-3 gap-4 rounded-lg border border-slate-200 bg-white p-4">
            {counters.map((c) => (
              <div key={c.label}>
                <dt className="text-xs text-slate-500">{c.label}</dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                  {c.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </FormSection>

      <FormSection title="Điều kiện chỉ số">
        <ul className="space-y-2 text-sm">
          {KPI_ITEMS.map(({ key, label }) => (
            <li
              key={key}
              className={`flex items-center gap-2 ${d.kpi[key] ? "text-emerald-700" : "text-slate-400"}`}
            >
              {d.kpi[key] ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              {label}
            </li>
          ))}
        </ul>
      </FormSection>
    </div>
  );
}
