import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CERTIFICATE_VALIDITY_LABELS, type CertificateValidity } from "@/features/certificate";

const CLASS: Record<CertificateValidity, string> = {
  VALID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EXPIRING_SOON: "border-amber-200 bg-amber-50 text-amber-700",
  EXPIRED: "border-rose-200 bg-rose-50 text-rose-700",
};

export function ValidityBadge({ validity, daysToExpiry }: { validity: CertificateValidity; daysToExpiry: number | null }) {
  const suffix =
    validity === "EXPIRING_SOON" && daysToExpiry !== null ? ` · còn ${daysToExpiry} ngày` : "";
  return (
    <Badge variant="outline" className={`whitespace-nowrap ${CLASS[validity]}`}>
      {CERTIFICATE_VALIDITY_LABELS[validity]}
      {suffix}
    </Badge>
  );
}
