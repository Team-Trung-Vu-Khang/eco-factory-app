import { EMPTY_FACTORY, type FactoryFormValues } from "../schemas/factory-schema";
import type { Factory } from "../types";

/** Factory (API) → form values */
export function toFactoryFormValues(f?: Factory): FactoryFormValues {
  if (!f) return EMPTY_FACTORY;
  return {
    name: f.name,
    organizationType: f.organizationType,
    taxCode: f.taxCode ?? "",
    foundedYear: f.foundedYear,
    representative: { ...f.representative, email: f.representative.email ?? "" },
    location: { ...f.location },
    productGroupIds: f.productGroupIds,
    services: f.services,
    description: f.description,
    offersExternalCapacity: f.offersExternalCapacity,
    machines: f.machines.map((m) => ({
      ...m,
      availableFrom: m.availableFrom ?? "",
      availableTo: m.availableTo ?? "",
    })),
    hasCertification: f.hasCertification,
    certifications: f.certifications.map((c) => ({
      ...c,
      number: c.number ?? "",
      issuedDate: c.issuedDate ?? "",
      expiryDate: c.expiryDate ?? "",
      issuer: c.issuer ?? "",
    })),
    avatarUrl: f.avatarUrl ?? "",
    facilityPhotos: f.facilityPhotos ?? [],
    machinePhotos: f.machinePhotos ?? [],
  };
}
