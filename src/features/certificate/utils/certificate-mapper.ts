import { EMPTY_CERTIFICATE, type CertificateFormValues } from "../schemas/certificate-schema";
import type { Certificate } from "../types";

export const toCertificateFormValues = (c?: Certificate): CertificateFormValues =>
  !c
    ? EMPTY_CERTIFICATE
    : {
        type: c.type,
        standardName: c.standardName ?? "",
        number: c.number,
        issuer: c.issuer,
        issuedDate: c.issuedDate,
        expiryDate: c.expiryDate ?? "",
        productGroupIds: c.productGroupIds,
        scopeDescription: c.scopeDescription ?? "",
        files: c.files,
        note: c.note ?? "",
      };
