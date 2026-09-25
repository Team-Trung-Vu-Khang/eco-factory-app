import dayjs from "dayjs";
import { FormSection } from "@/components/form";
import { CERTIFICATION_ISSUER_LABELS, CERTIFICATION_TYPE_LABELS, type Factory } from "@/features/factory";

const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "—");

export function CertificationListSection({ factory }: { factory: Factory }) {
  return (
    <FormSection title="Chứng nhận">
      {factory.certifications.length === 0 ? (
        <p className="text-sm text-slate-500">Chưa có chứng nhận.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {factory.certifications.map((c) => {
            const expired = !!c.expiryDate && dayjs(c.expiryDate).isBefore(dayjs(), "day");
            return (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="font-medium text-slate-900">
                    {CERTIFICATION_TYPE_LABELS[c.type]}
                    {c.number && <span className="font-normal text-slate-500"> · {c.number}</span>}
                  </p>
                  <p className="text-xs text-slate-500">{c.issuer ? (CERTIFICATION_ISSUER_LABELS[c.issuer] ?? c.issuer) : "—"}</p>
                </div>
                <p className={`text-sm tabular-nums ${expired ? "text-rose-600" : "text-slate-600"}`}>
                  {date(c.issuedDate)} → {date(c.expiryDate)}
                  {expired && " (hết hạn)"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </FormSection>
  );
}
