export interface ProfileCalculable {
  name?: string;
  organizationTypeId?: number | string;
  representativeName?: string;
  representativeGender?: string;
  representativePhone?: string;
  taxCode?: string;
  foundedYear?: number;
  province?: string;
  ward?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  productGroupIds?: (number | string)[];
  processingServiceIds?: (number | string)[];
  description?: string;
  hasCertificates?: boolean;
  certificates?: unknown[];
  images?: unknown[];
}

/**
 * Calculates profile completeness percent (0 - 100) based on filled fields
 */
export function calculateCompletenessPercent(
  data?: ProfileCalculable | null,
): number {
  if (!data) return 0;
  let score = 0;
  const totalWeight = 100;

  // Step 1: Basic & Representative (30 pts)
  if (data.name?.trim()) score += 8;
  if (data.organizationTypeId) score += 6;
  if (data.representativeName?.trim()) score += 6;
  if (data.representativeGender) score += 3;
  if (data.representativePhone?.trim()) score += 5;
  if (data.taxCode?.trim()) score += 1;
  if (data.foundedYear) score += 1;

  // Step 2: Location (20 pts)
  if (data.province?.trim()) score += 7;
  if (data.ward?.trim()) score += 7;
  if (data.address?.trim()) score += 4;
  if (data.latitude && data.longitude) score += 2;

  // Step 3: Activity (25 pts)
  if (data.productGroupIds && data.productGroupIds.length > 0) score += 10;
  if (data.processingServiceIds && data.processingServiceIds.length > 0)
    score += 10;
  if (data.description?.trim()) score += 5;

  // Step 4: Certifications & Images (25 pts)
  if (data.hasCertificates) {
    if (data.certificates && data.certificates.length > 0) score += 15;
  } else {
    // If no certificates declared, give base 10 pts for answering
    score += 10;
  }
  if (data.images && data.images.length > 0) score += 10;

  return Math.min(totalWeight, Math.max(0, score));
}

/**
 * Checks if factory is eligible for Program 300 (Chỉ số 300 cơ sở)
 * Requirements:
 * - Has valid basic info & location
 * - Has at least 1 product group & 1 processing service
 * - Has certificate
 */
export function calculateProgram300Eligible(
  data?: ProfileCalculable | null,
): boolean {
  if (!data) return false;

  const hasBasic = !!(
    data.name?.trim() &&
    data.organizationTypeId &&
    data.representativeName?.trim() &&
    data.representativePhone?.trim()
  );

  const hasLocation = !!(
    data.province?.trim() &&
    data.ward?.trim() &&
    data.address?.trim()
  );

  const hasActivity = !!(
    data.productGroupIds &&
    data.productGroupIds.length > 0 &&
    data.processingServiceIds &&
    data.processingServiceIds.length > 0
  );

  const hasCert = !!(
    data.hasCertificates &&
    data.certificates &&
    data.certificates.length > 0
  );

  return hasBasic && hasLocation && hasActivity && hasCert;
}
