import type { FactorySearchParams } from "@/features/connection";
import type { MaterialCondition } from "@/features/demand/constants";

export interface FilterValues {
  province: string;
  ward: string;
  processingServiceIds: string[];
  crops: string[];
  productGroupIds: string[];
  maxCapacity?: number;
  capacityUnit: "KG_PER_MONTH" | "TONNE_PER_MONTH";
  certificateTypes: string[];
  materialCondition: MaterialCondition | "";
  packagingRequirement: string;
  technicalRequirement: string;
  message: string;
}

export const EMPTY_SEARCH_FILTER_VALUES: FilterValues = {
  province: "",
  ward: "",
  processingServiceIds: [],
  crops: [],
  productGroupIds: [],
  maxCapacity: undefined,
  capacityUnit: "KG_PER_MONTH",
  certificateTypes: [],
  materialCondition: "",
  packagingRequirement: "",
  technicalRequirement: "",
  message: "",
};

/** Form values → GET marketplace/processing-schedules params (empty = no filter) */
export const toSearchParams = (v: FilterValues): FactorySearchParams => ({
  province: v.province || undefined,
  ward: v.ward || undefined,
  processingServiceIds: v.processingServiceIds?.length
    ? v.processingServiceIds.map(Number)
    : undefined,
  crops: v.crops?.length ? v.crops : undefined,
  maxCapacity: v.maxCapacity ?? undefined,
  capacityUnit: v.maxCapacity ? v.capacityUnit : undefined,
  certificateTypes: v.certificateTypes?.length
    ? v.certificateTypes
    : undefined,
  materialCondition: v.materialCondition || undefined,
  packagingRequirement: v.packagingRequirement?.trim() || undefined,
  technicalRequirement: v.technicalRequirement?.trim() || undefined,
  message: v.message?.trim() || undefined,
});
