import { Factory as FactoryIcon } from "lucide-react";
import type { ReactNode } from "react";
import { type FactoryProfile } from "@/features/factory";
import { ApprovalStatusBadge } from "../ApprovalStatusBadge";

export function FactoryDetailHeader({
  factory,
  actions,
}: {
  factory: FactoryProfile;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {factory.logoUrl ? (
          <img
            src={factory.logoUrl}
            alt=""
            className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm sm:h-14 sm:w-14"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm sm:h-14 sm:w-14">
            <FactoryIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="line-clamp-2 font-display text-lg font-bold text-slate-900 sm:text-2xl">
            {factory.code ? `[${factory.code}] ` : ""}Hồ sơ nhà máy:{" "}
            {factory.name}
          </h1>
          <p className="text-sm text-slate-500">
            Loại hình:{" "}
            <span className="font-semibold text-slate-700">
              {factory.organizationType?.name ?? "—"}
            </span>
            {factory.taxCode ? ` · MST: ${factory.taxCode}` : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <ApprovalStatusBadge status={factory.reviewStatus} />
        {actions}
      </div>
    </div>
  );
}
