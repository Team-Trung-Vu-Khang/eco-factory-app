import { PROCESSING_SERVICE_LABELS, factoryApi, type PageResponse, type ProcessingService } from "@/features/factory";
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

type Stored = Omit<ProcessingServiceItem, "factoryName" | "name">;

// Seeded lazily from the services declared in each factory profile
let db: Stored[] | null = null;
async function load(): Promise<Stored[]> {
  if (!db) {
    const { content } = await factoryApi.list({ page: 0, size: 1000 });
    db = content.flatMap((f) =>
      f.services.map((service) => ({ id: `${f.id}-${service}`, factoryId: f.id, service, description: "", isActive: true, updatedAt: now() })),
    );
  }
  return db;
}

async function withNames(items: Stored[]): Promise<ProcessingServiceItem[]> {
  const { content } = await factoryApi.list({ page: 0, size: 1000 });
  const names = new Map(content.map((f) => [f.id, f.name]));
  return items.map((s) => ({ ...s, factoryName: names.get(s.factoryId) ?? "—", name: PROCESSING_SERVICE_LABELS[s.service] }));
}

const assertUnique = (rows: Stored[], values: ProcessingServiceFormValues, exceptId?: string) => {
  if (rows.some((s) => s.factoryId === values.factoryId && s.service === values.service && s.id !== exceptId)) {
    throw new Error("Nhà máy đã có dịch vụ này.");
  }
};

export const processingServiceApi = {
  async list(params: ProcessingServiceListParams): Promise<PageResponse<ProcessingServiceItem>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = (await withNames(await load())).filter(
      (s) =>
        (!params.factoryId || s.factoryId === params.factoryId) &&
        (!keyword || [s.name, s.factoryName].some((v) => v.toLowerCase().includes(keyword))),
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

  async create(values: ProcessingServiceFormValues): Promise<void> {
    await delay();
    const rows = await load();
    assertUnique(rows, values);
    db = [...rows, { ...values, service: values.service as ProcessingService, id: crypto.randomUUID(), updatedAt: now() }];
  },

  async update(id: string, values: ProcessingServiceFormValues): Promise<void> {
    await delay();
    const rows = await load();
    if (!rows.some((s) => s.id === id)) throw new Error("Không tìm thấy dịch vụ.");
    assertUnique(rows, values, id);
    db = rows.map((s) => (s.id === id ? { ...s, ...values, service: values.service as ProcessingService, updatedAt: now() } : s));
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = (await load()).filter((s) => s.id !== id);
  },
};
