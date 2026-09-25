import { AutoCompleteSelect } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SearchX } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import PageWrapper from "@/components/common/PageWrapper";
import { ROUTES } from "@/config/routes";
import { rankFactories, useDemand, useDemands } from "@/features/demand";
import { useFactories } from "@/features/factory";
import { DemandSummary } from "./components/DemandSummary";
import { FactoryMatchCard } from "./components/FactoryMatchCard";

const CLOSED = ["COMPLETED", "CANCELLED"];

export default function DemandSuggestionPage() {
  const [, navigate] = useLocation();
  const demandId = new URLSearchParams(useSearch()).get("demandId") ?? undefined;

  const { data: demands } = useDemands({ page: 0, size: 200 });
  const { data: demand } = useDemand(demandId);
  // TODO: replace with a backend matching endpoint
  const { data: factories, isLoading } = useFactories({ page: 0, size: 500 });

  const demandOptions = (demands?.content ?? [])
    .filter((d) => !CLOSED.includes(d.status))
    .map((d) => ({ value: d.id, label: `${d.productName} — ${d.requester.fullName}` }));

  const result = useMemo(
    () => (demand && factories ? rankFactories(demand, factories.content) : undefined),
    [demand, factories],
  );

  return (
    <PageWrapper title="Gợi ý nhà máy phù hợp" description="Theo dịch vụ, nông sản, chứng nhận, phạm vi, khoảng cách và lịch máy">
      <div className="space-y-6">
        <div className="max-w-md">
          <AutoCompleteSelect
            options={demandOptions}
            value={demandId}
            onChange={(id) => navigate(id ? `${ROUTES.demandSuggestions}?demandId=${id}` : ROUTES.demandSuggestions)}
            placeholder="Chọn nhu cầu cần gợi ý..."
            searchPlaceholder="Tìm nhu cầu..."
            emptyText="Không có nhu cầu đang mở"
          />
        </div>

        {!demandId ? (
          <p className="py-16 text-center text-sm text-slate-500">Chọn một nhu cầu để xem các nhà máy phù hợp.</p>
        ) : !demand || !result || isLoading ? (
          <div className="h-40 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <>
            <DemandSummary demand={demand} />

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                {result.suggested.length} nhà máy phù hợp
              </h2>
              {result.suggested.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-200 py-10 text-sm text-slate-500">
                  <SearchX className="h-5 w-5" />
                  Chưa có nhà máy đáp ứng — thử mở rộng phạm vi tìm hoặc bớt yêu cầu chứng nhận.
                </div>
              ) : (
                result.suggested.map((m, i) => <FactoryMatchCard key={m.factory.id} match={m} rank={i + 1} />)
              )}
            </section>

            {result.excluded.length > 0 && (
              <details className="rounded-lg border border-slate-200 bg-white">
                <summary className="cursor-pointer px-4 py-3 text-sm text-slate-600">
                  {result.excluded.length} nhà máy chưa phù hợp
                </summary>
                <ul className="divide-y divide-slate-100 border-t border-slate-100 text-sm">
                  {result.excluded.map((m) => (
                    <li key={m.factory.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-4 py-2.5">
                      <span className="text-slate-800">{m.factory.name}</span>
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
