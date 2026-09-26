export interface ProductGroup {
  id: string;
  /** Crop group name — see features/crop */
  name: string;
  cropGroupId: string;
  /** Crops within the group; empty = the whole group */
  cropIds: string[];
  description?: string;
  updatedAt: string;
}

export interface ProductGroupListParams {
  page: number;
  size: number;
  keyword?: string;
}
