import { PROCESSING_SERVICE_LABELS, factoryApi, type PageResponse } from "@/features/factory";
import type { ProcessingServiceFormValues } from "../schema";
import type { ProcessingServiceItem, ProcessingServiceListParams } from "../types";

export const processingServiceKeys = {
  all: ["processing-services"] as const,
  list: (params: ProcessingServiceListParams) => [...processingServiceKeys.all, "list", params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/processing-services", { params })

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

type Stored = Omit<ProcessingServiceItem, "factoryNames">;

// Ids match the codes factories / machines / demands already reference
let db: Stored[] = Object.entries(PROCESSING_SERVICE_LABELS).map(([id, name]) => ({ id, name, description: "", updatedAt: now() }));

// Keep the shared label map in sync so existing screens show new services
// TODO: drop once PROCESSING_SERVICE_LABELS is loaded from the API
const syncLabel = (s: Stored) => {
  PROCESSING_SERVICE_LABELS[s.id] = s.name;
};

async function withCounts(items: Stored[]): Promise<ProcessingServiceItem[]> {
  const { content } = await factoryApi.list({ page: 0, size: 1000 });
  return items.map((s) => ({ ...s, factoryNames: content.filter((f) => f.services.includes(s.id)).map((f) => f.name) }));
}

const assertUnique = (name: string, exceptId?: string) => {
  if (db.some((s) => s.name.toLowerCase() === name.trim().toLowerCase() && s.id !== exceptId)) throw new Error("Dịch vụ này đã tồn tại.");
};

export const processingServiceApi = {
  async list(params: ProcessingServiceListParams): Promise<PageResponse<ProcessingServiceItem>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.filter((s) => !keyword || s.name.toLowerCase().includes(keyword));
    const start = params.page * params.size;
    return {
      content: await withCounts(filtered.slice(start, start + params.size)),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async all(): Promise<Stored[]> {
    await delay(150);
    return db;
  },

  async create(values: ProcessingServiceFormValues): Promise<void> {
    await delay();
    assertUnique(values.name);
    const created = { ...values, id: crypto.randomUUID(), updatedAt: now() };
    db = [...db, created];
    syncLabel(created);
  },

  async update(id: string, values: ProcessingServiceFormValues): Promise<void> {
    await delay();
    const prev = db.find((s) => s.id === id);
    if (!prev) throw new Error("Không tìm thấy dịch vụ.");
    assertUnique(values.name, id);
    const updated = { ...prev, ...values, updatedAt: now() };
    db = db.map((s) => (s.id === id ? updated : s));
    syncLabel(updated);
  },

  async remove(id: string): Promise<void> {
    await delay();
    const { content } = await factoryApi.list({ page: 0, size: 1000 });
    if (content.some((f) => f.services.includes(id))) throw new Error("Dịch vụ đang được nhà máy sử dụng, không thể xóa.");
    db = db.filter((s) => s.id !== id);
  },
};
