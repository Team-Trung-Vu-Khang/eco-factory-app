import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Factory as FactoryIcon } from "lucide-react";
import { ORGANIZATION_TYPE_LABELS, type Factory } from "@/features/factory";
import { CompletionBar } from "../CompletionBar";
import { KpiStatusBadge } from "../KpiStatusBadge";

export function FactorySummaryCard({ factory }: { factory: Factory }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {factory.avatarUrl ? (
          <img src={factory.avatarUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FactoryIcon className="h-7 w-7" />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="truncate text-lg font-semibold text-slate-900">{factory.name}</h2>
          <p className="text-sm text-slate-500">{ORGANIZATION_TYPE_LABELS[factory.organizationType]}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Hoàn thiện hồ sơ</p>
            <CompletionBar percent={factory.completionPercent} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Chỉ số 300 cơ sở</p>
            <KpiStatusBadge eligible={factory.isKpiEligible} />
          </div>
          {factory.kpiEligibleAt && (
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Ngày đạt điều kiện</p>
              <p className="tabular-nums">{dayjs(factory.kpiEligibleAt).format("DD/MM/YYYY")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
