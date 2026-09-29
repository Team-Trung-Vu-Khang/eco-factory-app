import dayjs from "dayjs";
import {
  Award,
  CalendarCheck,
  CalendarX,
  Factory as FactoryIcon,
  Hash,
  Landmark,
  ScrollText,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";
import { DetailCard, DetailField } from "@/components/common/DetailCard";
import type { Certificate } from "@/features/certificate";
import {
  CERTIFICATION_ISSUER_LABELS,
  CERTIFICATION_TYPE_LABELS,
  useFactoryOptions,
} from "@/features/factory";
import { ValidityBadge } from "./ValidityBadge";

const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : undefined);

/** Detail page: header + info / scope cards */
export function CertificateDetailView({
  certificate: c,
  actions,
}: {
  certificate: Certificate;
  actions?: ReactNode;
}) {
  const { nameOf } = useFactoryOptions();
  const certTitle =
    (CERTIFICATION_TYPE_LABELS as Record<string, string>)[c.certificateType] ??
    c.certificateType;
  const certNum = c.certificateNumber || "—";
  const status = c.status || "ACTIVE";
  const days = c.daysUntilExpiry ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm sm:h-14 sm:w-14">
            <Award className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="line-clamp-2 font-display text-lg font-bold text-slate-900 sm:text-2xl">
              Chứng nhận: {certTitle}
            </h1>
            <p className="text-sm text-slate-500">
              Số hiệu:{" "}
              <span className="font-semibold text-slate-700">{certNum}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <ValidityBadge validity={status} daysToExpiry={days} />
          {actions}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-6">
        <DetailCard icon={FactoryIcon} title="Nhà máy / Cơ sở">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <FactoryIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Nhà máy
              </p>
              <p className="font-semibold text-slate-900">
                {c.profile?.name ??
                  nameOf(String(c.workspaceId ?? c.profileId ?? ""))}
              </p>
              {c.profile?.code && (
                <p className="text-xs text-slate-500">Mã: {c.profile.code}</p>
              )}
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <DetailField icon={ScrollText} label="Mô tả phạm vi">
              <p className="whitespace-pre-line text-sm font-normal text-slate-700">
                {c.scopeDescription || "Chưa có mô tả phạm vi"}
              </p>
            </DetailField>
          </div>
        </DetailCard>

        <DetailCard icon={Award} title="Thông tin chứng nhận">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-3">
            <DetailField
              icon={Tag}
              label="Loại"
              iconClassName="text-violet-500"
            >
              {certTitle}
            </DetailField>
            <DetailField
              icon={Hash}
              label="Số chứng nhận"
              iconClassName="text-blue-500"
            >
              <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-sm font-semibold text-blue-700 shadow-sm">
                {certNum}
              </span>
            </DetailField>
            <DetailField
              icon={Landmark}
              label="Đơn vị cấp"
              iconClassName="text-amber-500"
            >
              {c.issuer
                ? ((CERTIFICATION_ISSUER_LABELS as Record<string, string>)[
                    c.issuer
                  ] ?? c.issuer)
                : "—"}
            </DetailField>
            <DetailField
              icon={CalendarCheck}
              label="Ngày cấp"
              iconClassName="text-emerald-500"
            >
              <span className="tabular-nums">{date(c.issuedDate) ?? "—"}</span>
            </DetailField>
            <DetailField
              icon={CalendarX}
              label="Ngày hết hạn"
              iconClassName="text-rose-500"
            >
              <span
                className={`tabular-nums ${status === "EXPIRED" ? "text-rose-600" : ""}`}
              >
                {date(c.expiryDate) ?? "Không thời hạn"}
              </span>
            </DetailField>
          </div>
        </DetailCard>
      </div>
    </div>
  );
}
