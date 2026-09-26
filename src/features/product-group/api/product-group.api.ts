import { CROPS, cropGroupName } from "@/features/crop";
import { PRODUCT_GROUP_LABELS, type PageResponse } from "@/features/factory";
import type { ProductGroupFormValues } from "../schema";
import type { ProductGroup, ProductGroupListParams } from "../types";

export const productGroupKeys = {
  all: ["product-groups"] as const,
  lists: () => [...productGroupKeys.all, "list"] as const,
  list: (params: ProductGroupListParams) => [...productGroupKeys.lists(), params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/product-groups", { params })

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

// Ids match the keys factories already reference (PRODUCT_GROUP_LABELS)
type Stored = Omit<ProductGroup, "name">;

let db: Stored[] = [
  { id: "TEA", cropGroupId: "TEA_PLANT", cropIds: [], description: "Chè búp tươi, chè khô", updatedAt: now() },
  { id: "VEGETABLE", cropGroupId: "VEGETABLE_PLANT", cropIds: [], updatedAt: now() },
  { id: "FRUIT", cropGroupId: "FRUIT_TREE", cropIds: [], updatedAt: now() },
  { id: "HERB", cropGroupId: "MEDICINAL_PLANT", cropIds: [], updatedAt: now() },
  { id: "GRAIN", cropGroupId: "FOOD_CROP", cropIds: ["RICE", "CORN"], updatedAt: now() },
  { id: "COFFEE", cropGroupId: "INDUSTRIAL_CROP", cropIds: ["COFFEE"], updatedAt: now() },
  { id: "SPICE", cropGroupId: "SPICE_PLANT", cropIds: [], updatedAt: now() },
];

const withName = (g: Stored): ProductGroup => ({ ...g, name: cropGroupName(g.cropGroupId) });

/** Empty cropIds = every crop in the group */
const coversCrop = (g: Stored, cropId: string) =>
  g.cropIds.length ? g.cropIds.includes(cropId) : CROPS.some((c) => c.id === cropId && c.groupId === g.cropGroupId);

const assertUnique = (cropGroupId: string, exceptId?: string) => {
  if (db.some((g) => g.cropGroupId === cropGroupId && g.id !== exceptId)) throw new Error("Nhóm cây trồng này đã được tạo.");
};

// Keep the shared label map in sync so existing screens show new groups
// TODO: drop once PRODUCT_GROUP_LABELS is loaded from the API
const syncLabel = (g: ProductGroup) => {
  PRODUCT_GROUP_LABELS[g.id] = g.name;
};

export const productGroupApi = {
  async list(params: ProductGroupListParams): Promise<PageResponse<ProductGroup>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.map(withName).filter((g) => !keyword || g.name.toLowerCase().includes(keyword));
    const start = params.page * params.size;
    return {
      content: filtered.slice(start, start + params.size),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async all(): Promise<ProductGroup[]> {
    await delay(150);
    return db.map(withName);
  },

  /** Product groups whose linked crops include this crop (BE does this in search) */
  groupIdsForCrop(cropId: string): string[] {
    return db.filter((g) => coversCrop(g, cropId)).map((g) => g.id);
  },

  async create(values: ProductGroupFormValues): Promise<ProductGroup> {
    await delay();
    assertUnique(values.cropGroupId);
    const created = withName({ ...values, id: crypto.randomUUID(), updatedAt: now() });
    db = [...db, created];
    syncLabel(created);
    return created;
  },

  async update(id: string, values: ProductGroupFormValues): Promise<ProductGroup> {
    await delay();
    const prev = db.find((g) => g.id === id);
    if (!prev) throw new Error("Không tìm thấy nhóm nông sản.");
    assertUnique(values.cropGroupId, id);
    const updated = withName({ ...prev, ...values, updatedAt: now() });
    db = db.map((g) => (g.id === id ? updated : g));
    syncLabel(updated);
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((g) => g.id !== id);
  },
};
