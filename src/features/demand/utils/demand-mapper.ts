import { EMPTY_DEMAND, type DemandFormValues } from "../schemas/demand-schema";
import type { Demand } from "../types";

export const toDemandFormValues = (d?: Demand): DemandFormValues =>
  !d
    ? EMPTY_DEMAND
    : {
        requester: { ...d.requester },
        hasDemand: d.hasDemand,
        demandTypeId: d.demandTypeId ?? "",
        productGroupId: d.productGroupId,
        productName: d.productName,
        materialCondition: d.materialCondition ?? "",
        quantity: d.quantity,
        quantityUnit: d.quantityUnit,
        services: d.services,
        technicalRequirements: d.technicalRequirements ?? "",
        packagingRequirements: d.packagingRequirements ?? "",
        requiredCertifications: d.requiredCertifications,
        neededFrom: d.neededFrom,
        neededTo: d.neededTo ?? "",
        materialLocation: { ...d.materialLocation },
        searchScope: d.searchScope,
        materialPhotos: d.materialPhotos,
        note: d.note ?? "",
        status: d.status,
      };
