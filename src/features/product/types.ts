import type { ProcessingService } from "@/features/factory";
import type { OutputUnit, ProductStatus, ShelfLifeUnit, WeightUnit } from "./constants";

export interface Packaging {
  id: string;
  name: string;
  netWeight: number;
  weightUnit: WeightUnit;
  price?: number;
}

export interface Product {
  id: string;
  images: string[];
  name: string;
  sku?: string;
  productGroupId: string;
  status: ProductStatus;
  description?: string;
  rawMaterials: string;
  processingServices: ProcessingService[];
  packagings: Packaging[];
  shelfLifeValue?: number;
  shelfLifeUnit?: ShelfLifeUnit;
  storageConditions?: string;
  outputCapacity?: number;
  outputUnit?: OutputUnit;
  certificateIds: string[];
  isNewlyDeveloped: boolean;
  launchedAt?: string;
  updatedAt: string;
}

export interface ProductListParams {
  page: number;
  size: number;
  keyword?: string;
  productGroupId?: string;
  status?: string;
  isNewlyDeveloped?: string;
}

export interface ProductSummary {
  total: number;
  active: number;
  newlyDeveloped: number;
  certified: number;
}
