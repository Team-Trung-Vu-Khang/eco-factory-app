import type { ProcessingService } from "@/features/factory";

/** A processing service offered at one factory */
export interface ProcessingServiceItem {
  id: string;
  factoryId: string;
  factoryName: string;
  service: ProcessingService;
  /** Service label, used in toasts / dialogs */
  name: string;
  description?: string;
  updatedAt: string;
}

export interface ProcessingServiceListParams {
  page: number;
  size: number;
  keyword?: string;
  factoryId?: string;
}
