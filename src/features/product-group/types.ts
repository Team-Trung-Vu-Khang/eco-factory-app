export interface ProductGroup {
  id: string;
  name: string;
  /** "group:<cropGroupId>" | "crop:<cropId>" — see features/crop */
  cropRefs: string[];
  description?: string;
  updatedAt: string;
}

export interface ProductGroupListParams {
  page: number;
  size: number;
  keyword?: string;
}
