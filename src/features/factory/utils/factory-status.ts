import type { FactoryFormValues } from "../schemas/factory-schema";

/**
 * Mirrors the system fields in the spec (section 3.8). The backend should own
 * this; it lives here only so the mock API and form preview agree.
 */
export function computeFactoryStatus(f: FactoryFormValues) {
  const required = [
    f.name,
    f.organizationType,
    f.representative.fullName,
    f.representative.gender,
    f.representative.phone,
    f.location.provinceCode,
    f.location.wardCode,
    f.location.address,
    f.productGroupIds.length > 0,
    f.services.length > 0,
    f.description,
    !f.offersExternalCapacity || f.machines.length > 0,
  ];
  const recommended = [
    f.location.latitude !== undefined && f.location.longitude !== undefined,
    f.avatarUrl,
    f.facilityPhotos.length > 0,
  ];
  const all = [...required, ...recommended];

  const isProfileComplete = required.every(Boolean);
  const completionPercent = Math.round((all.filter(Boolean).length / all.length) * 100);
  const hasAvailableCapacity =
    f.offersExternalCapacity &&
    f.machines.some((m) => m.status === "ACTIVE" && m.availableCapacity > 0);

  return {
    completionPercent,
    isProfileComplete,
    hasAvailableCapacity,
    // Proposed rule — pending confirmation (spec section 6, question 2)
    isKpiEligible: isProfileComplete && hasAvailableCapacity,
  };
}
