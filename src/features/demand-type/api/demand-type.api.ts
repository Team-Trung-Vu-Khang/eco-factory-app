import type { PageResponse } from "@/features/factory";
import type { DemandTypeFormValues } from "../schema";
import type { DemandType, DemandTypeListParams } from "../types";

export const demandTypeKeys = {
  all: ["demand-types"] as const,
  lists: () => [...demandTypeKeys.all, "list"] as const,
  list: (params: DemandTypeListParams) => [...demandTypeKeys.lists(), params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/demand-types", { params })

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

let db: DemandType[] = [
  { id: "dt1", name: "Sơ chế & phân loại", code: "SO_CHE", processingServices: ["PRE_PROCESSING", "WASHING", "SORTING"], description: "Làm sạch, phân loại nông sản sau thu hoạch", displayOrder: 1, isActive: true, usageCount: 12, updatedAt: now() },
  { id: "dt2", name: "Sấy", code: "SAY", processingServices: ["DRYING"], description: "Sấy nhiệt, sấy lạnh, sấy thăng hoa", displayOrder: 2, isActive: true, usageCount: 8, updatedAt: now() },
  { id: "dt3", name: "Bảo quản lạnh", code: "BAO_QUAN_LANH", processingServices: ["STORAGE"], description: "Thuê kho mát / kho lạnh", displayOrder: 3, isActive: true, usageCount: 5, updatedAt: now() },
  { id: "dt4", name: "Chế biến sâu", code: "CHE_BIEN_SAU", processingServices: ["GRINDING", "PRESSING", "FERMENTING"], description: "Nghiền, ép, lên men thành sản phẩm", displayOrder: 4, isActive: true, usageCount: 0, updatedAt: now() },
  { id: "dt5", name: "Đóng gói", code: "DONG_GOI", processingServices: ["PACKAGING"], description: "", displayOrder: 5, isActive: false, usageCount: 0, updatedAt: now() },
];

const assertUniqueCode = (code: string, exceptId?: string) => {
  if (db.some((t) => t.code === code && t.id !== exceptId)) throw new Error(`Mã "${code}" đã tồn tại.`);
};

export const demandTypeApi = {
  async list(params: DemandTypeListParams): Promise<PageResponse<DemandType>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db
      .filter(
        (t) =>
          (!keyword || [t.name, t.code].some((v) => v.toLowerCase().includes(keyword))) &&
          (!params.isActive || String(t.isActive) === params.isActive),
      )
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    const start = params.page * params.size;
    return {
      content: filtered.slice(start, start + params.size),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async create(values: DemandTypeFormValues): Promise<DemandType> {
    await delay();
    assertUniqueCode(values.code);
    const created = { ...(values as unknown as DemandType), id: crypto.randomUUID(), usageCount: 0, updatedAt: now() };
    db = [...db, created];
    return created;
  },

  async update(id: string, values: DemandTypeFormValues): Promise<DemandType> {
    await delay();
    const prev = db.find((t) => t.id === id);
    if (!prev) throw new Error("Không tìm thấy loại nhu cầu.");
    assertUniqueCode(values.code, id);
    const updated = { ...prev, ...(values as unknown as DemandType), updatedAt: now() };
    db = db.map((t) => (t.id === id ? updated : t));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    const found = db.find((t) => t.id === id);
    if (found && found.usageCount > 0) {
      throw new Error(`Đang có ${found.usageCount} nhu cầu dùng loại này. Hãy ngừng hoạt động thay vì xóa.`);
    }
    db = db.filter((t) => t.id !== id);
  },
};
