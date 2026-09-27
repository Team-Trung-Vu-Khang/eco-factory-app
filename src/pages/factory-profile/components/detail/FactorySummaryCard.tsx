import { Button, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Factory as FactoryIcon, Pencil } from "lucide-react";
import { ORGANIZATION_TYPE_LABELS, type Factory } from "@/features/factory";
import { ApprovalStatusBadge } from "../ApprovalStatusBadge";
import { CompletionBar } from "../CompletionBar";
import { KpiStatusBadge } from "../KpiStatusBadge";

export function FactorySummaryCard({ factory, onEdit }: { factory: Factory; onEdit?: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {factory.avatarUrl ? (
            <img src={factory.avatarUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-16 sm:w-16" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 sm:h-16 sm:w-16">
              <FactoryIcon className="h-7 w-7" />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-0.5">
            <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900 sm:truncate sm:text-lg">
              {factory.name}
            </h2>
            <p className="text-sm text-slate-500">{ORGANIZATION_TYPE_LABELS[factory.organizationType]}</p>
          </div>
          {onEdit && (
            <Button variant="outline" size="icon" className="shrink-0 self-start sm:hidden!" onClick={onEdit} aria-label="Chỉnh sửa hồ sơ" title="Chỉnh sửa hồ sơ">
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4 text-sm sm:flex sm:flex-wrap sm:items-center sm:gap-4 sm:border-0! sm:pt-0!">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Trạng thái duyệt</p>
            <ApprovalStatusBadge status={factory.approvalStatus} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Chỉ số 300 cơ sở</p>
            <KpiStatusBadge eligible={factory.isKpiEligible} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Hoàn thiện hồ sơ</p>
            <CompletionBar percent={factory.completionPercent} />
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
