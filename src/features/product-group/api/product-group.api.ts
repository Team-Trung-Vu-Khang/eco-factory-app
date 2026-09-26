import { refsCoverCrop } from "@/features/crop";
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
let db: ProductGroup[] = [
  { id: "TEA", name: "Chè", cropRefs: ["group:TEA_PLANT"], description: "Chè búp tươi, chè khô", updatedAt: now() },
  { id: "VEGETABLE", name: "Rau củ", cropRefs: ["group:VEGETABLE_PLANT"], updatedAt: now() },
  { id: "FRUIT", name: "Trái cây", cropRefs: ["group:FRUIT_TREE"], updatedAt: now() },
  { id: "HERB", name: "Dược liệu", cropRefs: ["group:MEDICINAL_PLANT"], updatedAt: now() },
  { id: "GRAIN", name: "Ngũ cốc", cropRefs: ["crop:RICE", "crop:CORN"], updatedAt: now() },
  { id: "COFFEE", name: "Cà phê", cropRefs: ["crop:COFFEE"], updatedAt: now() },
  { id: "SPICE", name: "Gia vị", cropRefs: ["group:SPICE_PLANT"], updatedAt: now() },
];

// Keep the shared label map in sync so existing screens show new groups
// TODO: drop once PRODUCT_GROUP_LABELS is loaded from the API
const syncLabel = (g: ProductGroup) => {
  PRODUCT_GROUP_LABELS[g.id] = g.name;
};

export const productGroupApi = {
  async list(params: ProductGroupListParams): Promise<PageResponse<ProductGroup>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.filter((g) => !keyword || g.name.toLowerCase().includes(keyword));
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
    return db;
  },

  /** Product groups whose linked crops include this crop (BE does this in search) */
  groupIdsForCrop(cropId: string): string[] {
    return db.filter((g) => refsCoverCrop(g.cropRefs, cropId)).map((g) => g.id);
  },

  async create(values: ProductGroupFormValues): Promise<ProductGroup> {
    await delay();
    const created: ProductGroup = { ...values, id: crypto.randomUUID(), updatedAt: now() };
    db = [...db, created];
    syncLabel(created);
    return created;
  },

  async update(id: string, values: ProductGroupFormValues): Promise<ProductGroup> {
    await delay();
    const prev = db.find((g) => g.id === id);
    if (!prev) throw new Error("Không tìm thấy nhóm nông sản.");
    const updated = { ...prev, ...values, updatedAt: now() };
    db = db.map((g) => (g.id === id ? updated : g));
    syncLabel(updated);
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((g) => g.id !== id);
  },
};
