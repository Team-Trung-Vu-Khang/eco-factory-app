import {
  EMPTY_CERTIFICATE,
  type CertificateFormValues,
} from "../schemas/certificate-schema";
import type { Certificate } from "../types";

export const toCertificateFormValues = (
  c?: Certificate,
): CertificateFormValues =>
  !c
    ? EMPTY_CERTIFICATE
    : {
        certificateType: c.certificateType ?? "",
        certificateNumber: c.certificateNumber ?? "",
        issuer: c.issuer ?? "",
        issuedDate: c.issuedDate ?? "",
        expiryDate: c.expiryDate ?? "",
        scopeDescription: c.scopeDescription ?? "",
        imageUrl: c.imageUrl ?? "",
      };
