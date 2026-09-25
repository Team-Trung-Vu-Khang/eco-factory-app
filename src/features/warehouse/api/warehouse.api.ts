import type { PageResponse } from "@/features/factory";
import type { WarehouseFormValues } from "../schemas/warehouse-schema";
import type { Warehouse, WarehouseListParams, WarehouseSummary } from "../types";
import { SEED_WAREHOUSES } from "./warehouse.mock";

export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  list: (params: WarehouseListParams) => [...warehouseKeys.lists(), params] as const,
  summary: () => [...warehouseKeys.all, "summary"] as const,
  detail: (id: string) => [...warehouseKeys.all, "detail", id] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/warehouses", { params })

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

function toWarehouse(values: WarehouseFormValues, id: string = crypto.randomUUID()): Warehouse {
  return {
    ...(values as unknown as Warehouse),
    id,
    availableCapacity: Math.max(0, values.capacity - values.usedCapacity),
    utilizationPercent: values.capacity ? Math.round((values.usedCapacity / values.capacity) * 100) : 0,
    updatedAt: new Date().toISOString(),
  };
}

let db: Warehouse[] = SEED_WAREHOUSES.map((w) => toWarehouse(w));

export const warehouseApi = {
  async list(params: WarehouseListParams): Promise<PageResponse<Warehouse>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.filter(
      (w) =>
        (!keyword || [w.name, w.code ?? "", w.managerName ?? ""].some((v) => v.toLowerCase().includes(keyword))) &&
        (!params.type || w.type === params.type) &&
        (!params.status || w.status === params.status),
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

  async get(id: string): Promise<Warehouse> {
    await delay();
    const found = db.find((w) => w.id === id);
    if (!found) throw new Error("Không tìm thấy kho.");
    return found;
  },

  async summary(): Promise<WarehouseSummary> {
    await delay(200);
    const active = db.filter((w) => w.status === "ACTIVE");
    return {
      total: db.length,
      active: active.length,
      avgUtilizationPercent: active.length
        ? Math.round(active.reduce((sum, w) => sum + w.utilizationPercent, 0) / active.length)
        : 0,
      acceptingExternal: active.filter((w) => w.acceptsExternalStorage && w.availableCapacity > 0).length,
    };
  },

  async create(values: WarehouseFormValues): Promise<Warehouse> {
    await delay();
    const created = toWarehouse(values);
    db = [created, ...db];
    return created;
  },

  async update(id: string, values: WarehouseFormValues): Promise<Warehouse> {
    await delay();
    if (!db.some((w) => w.id === id)) throw new Error("Không tìm thấy kho.");
    const updated = toWarehouse(values, id);
    db = db.map((w) => (w.id === id ? updated : w));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((w) => w.id !== id);
  },
};
