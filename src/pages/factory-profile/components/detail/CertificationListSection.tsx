import dayjs from "dayjs";
import {
  Award,
  CalendarCheck,
  CalendarX,
  Hash,
  Landmark,
  Layers,
} from "lucide-react";
import {
  CERTIFICATION_ISSUER_LABELS,
  CERTIFICATION_TYPE_LABELS,
  type FactoryProfile,
} from "@/features/factory";

import { DetailCard, DetailField } from "@/components/common/DetailCard";

const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : undefined);

export function CertificationListSection({
  factory,
}: {
  factory: FactoryProfile;
}) {
  const certs = factory.certificates ?? [];

  if (certs.length === 0) {
    return (
      <DetailCard icon={Award} title="Chứng nhận (0)">
        <p className="text-sm text-slate-500">Chưa có chứng nhận.</p>
      </DetailCard>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2 xl:gap-6">
      {certs.map((c, index) => {
        const certType = c.certificateType || "OTHER";
        const certLabel =
          (CERTIFICATION_TYPE_LABELS as Record<string, string>)[certType] ||
          certType;
        const expired =
          !!c.expiryDate && dayjs(c.expiryDate).isBefore(dayjs(), "day");
        const issuerLabel = c.issuer
          ? ((CERTIFICATION_ISSUER_LABELS as Record<string, string>)[
              c.issuer
            ] ?? c.issuer)
          : undefined;
        const certNum = c.certificateNumber;

        return (
          <section
            key={c.id ?? index}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <header className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Award className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">
                  Chứng nhận
                </p>
                <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                  {certLabel}
                </h3>
              </div>
              <span
                className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-semibold ${
                  expired
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {expired ? "Hết hạn" : "Còn hiệu lực"}
              </span>
            </header>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-4 sm:p-5">
              <DetailField
                icon={Hash}
                label="Số chứng nhận"
                iconClassName="text-blue-500"
              >
                {certNum && (
                  <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-sm font-semibold text-blue-700">
                    {certNum}
                  </span>
                )}
              </DetailField>
              <DetailField
                icon={Landmark}
                label="Đơn vị cấp"
                iconClassName="text-amber-500"
              >
                {issuerLabel}
              </DetailField>
              <DetailField
                icon={CalendarCheck}
                label="Ngày cấp"
                iconClassName="text-emerald-500"
              >
                {date(c.issuedDate) && (
                  <span className="tabular-nums">{date(c.issuedDate)}</span>
                )}
              </DetailField>
              <DetailField
                icon={CalendarX}
                label="Ngày hết hạn"
                iconClassName="text-rose-500"
              >
                {date(c.expiryDate) && (
                  <span
                    className={`tabular-nums ${expired ? "text-rose-600" : ""}`}
                  >
                    {date(c.expiryDate)}
                  </span>
                )}
              </DetailField>
              {c.scopeDescription && (
                <div className="col-span-2">
                  <DetailField icon={Layers} label="Phạm vi chứng nhận">
                    <p className="text-sm text-slate-700">
                      {c.scopeDescription}
                    </p>
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
