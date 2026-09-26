import { PROCESSING_SERVICE_LABELS, type PageResponse, type ProcessingService } from "@/features/factory";
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

const DESCRIPTIONS: Partial<Record<ProcessingService, string>> = {
  PRE_PROCESSING: "Làm sạch, cắt tỉa, sơ chế sau thu hoạch",
  DRYING: "Sấy nhiệt, sấy lạnh, sấy thăng hoa",
  STORAGE: "Kho mát / kho lạnh",
};
const FACTORY_COUNTS: Partial<Record<ProcessingService, number>> = { DRYING: 3, PACKAGING: 2, PRE_PROCESSING: 2, STORAGE: 1, GRINDING: 1, PRESSING: 1, WASHING: 1 };

let db: ProcessingServiceItem[] = (Object.entries(PROCESSING_SERVICE_LABELS) as [ProcessingService, string][]).map(([id, name]) => ({
  id,
  name,
  description: DESCRIPTIONS[id] ?? "",
  isActive: true,
  factoryCount: FACTORY_COUNTS[id] ?? 0,
  updatedAt: now(),
}));

export const processingServiceApi = {
  async list(params: ProcessingServiceListParams): Promise<PageResponse<ProcessingServiceItem>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.filter((s) => !keyword || s.name.toLowerCase().includes(keyword));
    const start = params.page * params.size;
    return {
      content: filtered.slice(start, start + params.size),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async create(values: ProcessingServiceFormValues): Promise<ProcessingServiceItem> {
    await delay();
    const created = { ...values, id: crypto.randomUUID(), factoryCount: 0, updatedAt: now() };
    db = [...db, created];
    return created;
  },

  async update(id: string, values: ProcessingServiceFormValues): Promise<ProcessingServiceItem> {
    await delay();
    const prev = db.find((s) => s.id === id);
    if (!prev) throw new Error("Không tìm thấy dịch vụ.");
    const updated = { ...prev, ...values, updatedAt: now() };
    db = db.map((s) => (s.id === id ? updated : s));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    const found = db.find((s) => s.id === id);
    if (found && found.factoryCount > 0) {
      throw new Error(`Đang có ${found.factoryCount} nhà máy cung cấp dịch vụ này. Hãy ngừng hoạt động thay vì xóa.`);
    }
    db = db.filter((s) => s.id !== id);
  },
};
