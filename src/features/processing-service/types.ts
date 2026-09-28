export interface ProcessingServiceItem {
  id: number | string;
  code?: string;
  name: string;
  description?: string | null;
  displayOrder?: number | null;
  status?: "active" | "inactive" | "archived";
  metadataJson?: Record<string, unknown> | null;
  /** Legacy or joined field for UI */
  factoryNames?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProcessingServiceListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
}
