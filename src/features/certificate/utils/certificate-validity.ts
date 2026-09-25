import dayjs from "dayjs";
import { EXPIRING_SOON_DAYS, type CertificateValidity } from "../constants";

export function getCertificateValidity(expiryDate?: string): {
  validity: CertificateValidity;
  daysToExpiry: number | null;
} {
  if (!expiryDate) return { validity: "VALID", daysToExpiry: null };
  const days = dayjs(expiryDate).startOf("day").diff(dayjs().startOf("day"), "day");
  return {
    validity: days < 0 ? "EXPIRED" : days <= EXPIRING_SOON_DAYS ? "EXPIRING_SOON" : "VALID",
    daysToExpiry: days,
  };
}
