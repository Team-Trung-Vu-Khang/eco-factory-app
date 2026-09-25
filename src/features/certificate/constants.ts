export type CertificateValidity = "VALID" | "EXPIRING_SOON" | "EXPIRED";

export const CERTIFICATE_VALIDITY_LABELS: Record<CertificateValidity, string> = {
  VALID: "Còn hiệu lực",
  EXPIRING_SOON: "Sắp hết hạn",
  EXPIRED: "Hết hạn",
};

/** "Sắp hết hạn" window */
export const EXPIRING_SOON_DAYS = 60;

export const CERTIFICATE_VALIDITY_OPTIONS = (
  Object.entries(CERTIFICATE_VALIDITY_LABELS) as [CertificateValidity, string][]
).map(([value, label]) => ({ value, label }));
