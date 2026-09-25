import type { ProcessingService } from "@/features/factory";

export interface DemandType {
  id: string;
  name: string;
  code: string;
  processingServices: ProcessingService[];
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  /** Demands currently using this type — cannot delete while > 0 */
  usageCount: number;
  updatedAt: string;
}

export interface DemandTypeListParams {
  page: number;
  size: number;
  keyword?: string;
  isActive?: string;
}
