import type { Factory, FactoryProfile } from "../types";
import type {
  FactoryProfileFormValues,
  MachineFormValues,
} from "../schemas/factory-schema";

export type FactorySeedValues = {
  name: string;
  organizationType?: string;
  organizationTypeId?: string | number;
  taxCode?: string;
  foundedYear?: number;
  representative?: {
    fullName?: string;
    gender?: string;
    phone?: string;
    email?: string;
  };
  representativeName?: string;
  representativeGender?: string;
  representativePhone?: string;
  representativeEmail?: string;
  location?: {
    provinceCode?: string;
    wardCode?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  province?: string;
  ward?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  productGroupIds?: (string | number)[];
  services?: string[];
  processingServiceIds?: (string | number)[];
  description?: string;
  offersExternalCapacity?: boolean;
  machines?: Array<
    | MachineFormValues
    | {
        id?: string;
        name?: string;
        status?: string;
        maxCapacity?: number;
        capacityUnit?: string;
        functions?: string[];
        productGroupIds?: string[];
      }
  >;
  hasCertification?: boolean;
  hasCertificates?: boolean;
  avatarUrl?: string;
  logoUrl?: string;
  facilityPhotos?: string[];
  machinePhotos?: string[];
  images?: Array<{ fileUrl: string }>;
  certifications?: Array<{
    id?: string;
    type?: string;
    number?: string;
    issuedDate?: string;
    expiryDate?: string;
    issuer?: string;
  }>;
};

export type FactoryStatusInput =
  | Factory
  | FactoryProfile
  | FactoryProfileFormValues
  | FactorySeedValues;

export function computeFactoryStatus(f: FactoryStatusInput) {
  const name = f.name ?? "";
  const orgType =
    ("organizationType" in f && typeof f.organizationType === "string"
      ? f.organizationType
      : undefined) ||
    ("organizationTypeId" in f ? f.organizationTypeId : undefined);

  const repName =
    ("representative" in f && f.representative?.fullName
      ? f.representative.fullName
      : undefined) ||
    ("representativeName" in f ? f.representativeName : "") ||
    "";

  const repGender =
    ("representative" in f ? f.representative?.gender : undefined) ||
    ("representativeGender" in f ? f.representativeGender : undefined);

  const repPhone =
    ("representative" in f ? f.representative?.phone : undefined) ||
    ("representativePhone" in f ? f.representativePhone : undefined);

  const province =
    ("location" in f ? f.location?.provinceCode : undefined) ||
    ("province" in f ? f.province : undefined);

  const ward =
    ("location" in f ? f.location?.wardCode : undefined) ||
    ("ward" in f ? f.ward : undefined);

  const address =
    ("location" in f ? f.location?.address : undefined) ||
    ("address" in f ? f.address : undefined);

  const pGroups = f.productGroupIds ?? [];
  const services =
    ("services" in f && Array.isArray(f.services) ? f.services : undefined) ||
    ("processingServiceIds" in f && Array.isArray(f.processingServiceIds)
      ? f.processingServiceIds
      : []) ||
    [];

  const desc = f.description ?? "";
  const machines =
    "machines" in f && Array.isArray(f.machines) ? f.machines : [];
  const offersExternalCapacity =
    "offersExternalCapacity" in f ? Boolean(f.offersExternalCapacity) : false;

  const required = [
    name,
    orgType,
    repName,
    repGender,
    repPhone,
    province,
    ward,
    address,
    pGroups.length > 0,
    services.length > 0,
    desc,
    !offersExternalCapacity || machines.length > 0,
  ];

  const latitude =
    "location" in f
      ? f.location?.latitude
      : "latitude" in f
        ? f.latitude
        : undefined;
  const longitude =
    "location" in f
      ? f.location?.longitude
      : "longitude" in f
        ? f.longitude
        : undefined;
  const avatarUrl =
    "avatarUrl" in f ? f.avatarUrl : "logoUrl" in f ? f.logoUrl : undefined;
  const photosCount =
    ("machinePhotos" in f && Array.isArray(f.machinePhotos)
      ? f.machinePhotos.length
      : 0) || ("images" in f && Array.isArray(f.images) ? f.images.length : 0);

  const recommended = [
    latitude !== undefined && longitude !== undefined,
    avatarUrl,
    photosCount > 0,
  ];
  const all = [...required, ...recommended];

  const isProfileComplete = required.every(Boolean);
  const completionPercent = Math.round(
    (all.filter(Boolean).length / all.length) * 100,
  );
  const hasAvailableCapacity =
    offersExternalCapacity &&
    machines.some((m) => m.status === "ACTIVE" && (m.maxCapacity ?? 0) > 0);

  return {
    completionPercent,
    isProfileComplete,
    hasAvailableCapacity,
    isKpiEligible: isProfileComplete && hasAvailableCapacity,
  };
}
