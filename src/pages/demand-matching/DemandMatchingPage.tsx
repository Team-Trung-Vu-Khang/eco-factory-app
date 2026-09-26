import { AutoCompleteSelect } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SearchX } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation, useSearch } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { rankDemands, useDemands } from "@/features/demand";
import { CAPACITY_UNIT_LABELS, PROCESSING_SERVICE_LABELS, getProvinceName, useFactories } from "@/features/factory";
import { DemandMatchCard } from "./components/DemandMatchCard";

const CLOSED = ["COMPLETED", "CANCELLED"];
const fmt = new Intl.NumberFormat("vi-VN");

export default function DemandMatchingPage() {
  const [, navigate] = useLocation();
  const factoryId = new URLSearchParams(useSearch()).get("factoryId") ?? undefined;

  const { data: factories } = useFactories({ page: 0, size: 500 });
  // TODO: replace with a backend matching endpoint
  const { data: demands, isLoading } = useDemands({ page: 0, size: 500 });

  const factory = factories?.content.find((f) => f.id === factoryId);
  const factoryOptions = (factories?.content ?? []).map((f) => ({ value: f.id, label: f.name }));

  const result = useMemo(
    () => (factory && demands ? rankDemands(factory, demands.content.filter((d) => d.hasDemand && !CLOSED.includes(d.status))) : undefined),
    [factory, demands],
  );

  return (
    <PageWrapper title="Tìm nhu cầu phù hợp" description="Nhu cầu đang mở mà nhà máy có thể đáp ứng">
      <div className="space-y-6">
        <div className="max-w-md">
          <AutoCompleteSelect
            options={factoryOptions}
            value={factoryId}
            onChange={(id) => navigate(id ? `${ROUTES.demandMatching}?factoryId=${id}` : ROUTES.demandMatching)}
            placeholder="Chọn nhà máy..."
            searchPlaceholder="Tìm nhà máy..."
            emptyText="Chưa có nhà máy"
          />
        </div>

        {!factoryId ? (
          <p className="py-16 text-center text-sm text-slate-500">Chọn một nhà máy để xem các nhu cầu phù hợp.</p>
        ) : !factory || !result || isLoading ? (
          <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <p className="text-sm text-slate-500">
                  {getProvinceName(factory.location.provinceCode)} · {factory.services.map((s) => PROCESSING_SERVICE_LABELS[s]).join(", ")}
                </p>
                <Link href={ROUTES.profileDetail(factory.id)} className="text-sm text-emerald-700 hover:underline">
                  Xem hồ sơ
                </Link>
              </div>
              {factory.hasAvailableCapacity ? (
                <ul className="space-y-1 text-sm">
                  {factory.machines
                    .filter((m) => m.status === "ACTIVE" && m.availableCapacity > 0)
                    .map((m) => (
                      <li key={m.id} className="flex flex-wrap justify-between gap-x-4 text-slate-700">
                        <span>{m.name}</span>
                        <span className="text-slate-500 tabular-nums">
                          rảnh {fmt.format(m.availableCapacity)} {CAPACITY_UNIT_LABELS[m.availableUnit ?? m.capacityUnit]}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-amber-700">
                  Nhà máy chưa khai báo công suất cho bên ngoài — cập nhật máy móc trong hồ sơ để nhận nhu cầu.
                </p>
              )}
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">{result.suggested.length} nhu cầu phù hợp</h2>
              {result.suggested.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-200 py-10 text-sm text-slate-500">
                  <SearchX className="h-5 w-5" />
                  Chưa có nhu cầu đang mở phù hợp với năng lực nhà máy.
                </div>
              ) : (
                result.suggested.map((m, i) => <DemandMatchCard key={m.demand.id} match={m} rank={i + 1} />)
              )}
            </section>

            {result.excluded.length > 0 && (
              <details className="rounded-lg border border-slate-200 bg-white">
                <summary className="cursor-pointer px-4 py-3 text-sm text-slate-600">
                  {result.excluded.length} nhu cầu chưa phù hợp
                </summary>
                <ul className="divide-y divide-slate-100 border-t border-slate-100 text-sm">
                  {result.excluded.map((m) => (
                    <li key={m.demand.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-4 py-2.5">
                      <Link href={ROUTES.demandDetail(m.demand.id)} className="text-slate-800 hover:underline">
                        {m.demand.productName} — {m.demand.requester.fullName}
                      </Link>
                      <span className="text-slate-500">{m.reasons.join(" · ")}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
