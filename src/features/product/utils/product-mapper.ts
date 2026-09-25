import { EMPTY_PRODUCT, type ProductFormValues } from "../schemas/product-schema";
import type { Product } from "../types";

export const toProductFormValues = (p?: Product): ProductFormValues =>
  !p
    ? EMPTY_PRODUCT
    : {
        images: p.images,
        name: p.name,
        sku: p.sku ?? "",
        productGroupId: p.productGroupId,
        status: p.status,
        description: p.description ?? "",
        rawMaterials: p.rawMaterials,
        processingServices: p.processingServices,
        packagings: p.packagings.map((pk) => ({ ...pk })),
        shelfLifeValue: p.shelfLifeValue,
        shelfLifeUnit: p.shelfLifeUnit ?? "",
        storageConditions: p.storageConditions ?? "",
        outputCapacity: p.outputCapacity,
        outputUnit: p.outputUnit ?? "",
        certificateIds: p.certificateIds,
        isNewlyDeveloped: p.isNewlyDeveloped,
        launchedAt: p.launchedAt ?? "",
      };
