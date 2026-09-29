import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  type CertificateStatus,
  type CertificateValidity,
} from "@/features/certificate";

const LABELS: Record<string, string> = {
  ACTIVE: "Còn hiệu lực",
  VALID: "Còn hiệu lực",
  EXPIRING_SOON: "Sắp hết hạn",
  EXPIRED: "Hết hạn",
};

const CLASS: Record<string, string> = {
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  VALID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EXPIRING_SOON: "border-amber-200 bg-amber-50 text-amber-700",
  EXPIRED: "border-rose-200 bg-rose-50 text-rose-700",
};

export function ValidityBadge({
  validity,
  daysToExpiry,
}: {
  validity: CertificateStatus | CertificateValidity;
  daysToExpiry?: number | null;
}) {
  const isExpiringSoon = validity === "EXPIRING_SOON";
  const suffix =
    isExpiringSoon && daysToExpiry !== undefined && daysToExpiry !== null
      ? ` · còn ${daysToExpiry} ngày`
      : "";
  return (
    <Badge
      variant="outline"
      className={`whitespace-nowrap ${CLASS[validity] ?? CLASS.ACTIVE}`}
    >
      {LABELS[validity] ?? "Còn hiệu lực"}
      {suffix}
    </Badge>
  );
}
