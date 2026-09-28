export interface ProductGroup {
  id: number | string;
  code?: string;
  name: string;
  /** Linked crops (text tags); empty = all crops in the group */
  crops: string[];
  description?: string | null;
  displayOrder?: number | null;
  status?: "active" | "inactive" | "archived";
  metadataJson?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductGroupListParams {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
}
