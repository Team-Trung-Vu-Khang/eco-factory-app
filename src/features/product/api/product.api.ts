import type { PageResponse } from "@/features/factory";
import type { ProductFormValues } from "../schemas/product-schema";
import type { Product, ProductListParams, ProductSummary } from "../types";
import { SEED_PRODUCTS } from "./product.mock";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductListParams) => [...productKeys.lists(), params] as const,
  summary: () => [...productKeys.all, "summary"] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/products", { params })

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const toProduct = (values: ProductFormValues, id: string = crypto.randomUUID()): Product => ({
  ...(values as unknown as Product),
  id,
  packagings: values.packagings.map((p) => ({ ...p, id: p.id ?? crypto.randomUUID() })) as Product["packagings"],
  updatedAt: new Date().toISOString(),
});

let db: Product[] = SEED_PRODUCTS.map((p) => toProduct(p));

export const productApi = {
  async list(params: ProductListParams): Promise<PageResponse<Product>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.filter(
      (p) =>
        (!keyword || [p.name, p.sku ?? "", p.rawMaterials].some((v) => v.toLowerCase().includes(keyword))) &&
        (!params.productGroupId || p.productGroupId === params.productGroupId) &&
        (!params.status || p.status === params.status) &&
        (!params.isNewlyDeveloped || String(p.isNewlyDeveloped) === params.isNewlyDeveloped),
    );
    const start = params.page * params.size;
    return {
      content: filtered.slice(start, start + params.size),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async get(id: string): Promise<Product> {
    await delay();
    const found = db.find((p) => p.id === id);
    if (!found) throw new Error("Không tìm thấy sản phẩm.");
    return found;
  },

  async summary(): Promise<ProductSummary> {
    await delay(200);
    return {
      total: db.length,
      active: db.filter((p) => p.status === "ACTIVE").length,
      newlyDeveloped: db.filter((p) => p.isNewlyDeveloped).length,
      certified: db.filter((p) => p.certificateIds.length > 0).length,
    };
  },

  async create(values: ProductFormValues): Promise<Product> {
    await delay();
    const created = toProduct(values);
    db = [created, ...db];
    return created;
  },

  async update(id: string, values: ProductFormValues): Promise<Product> {
    await delay();
    if (!db.some((p) => p.id === id)) throw new Error("Không tìm thấy sản phẩm.");
    const updated = toProduct(values, id);
    db = db.map((p) => (p.id === id ? updated : p));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((p) => p.id !== id);
  },
};
