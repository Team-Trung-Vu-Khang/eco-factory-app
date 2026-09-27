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

const SEED_DESCRIPTIONS: Record<string, string> = {
  PRE_PROCESSING: "Làm sạch, cắt tỉa, loại bỏ phần hư hỏng để chuẩn bị cho các khâu chế biến tiếp theo",
  WASHING: "Rửa nông sản bằng nước sạch hoặc dung dịch chuyên dụng, loại bỏ đất cát và dư lượng thuốc BVTV",
  SORTING: "Phân loại theo kích cỡ, màu sắc, chất lượng để đồng đều sản phẩm và nâng giá trị bán",
  DRYING: "Sấy lạnh, sấy nhiệt hoặc sấy thăng hoa để giảm độ ẩm, kéo dài thời gian bảo quản",
  GRINDING: "Nghiền, xay thành bột mịn hoặc dạng hạt theo yêu cầu",
  PRESSING: "Ép lấy nước hoặc dầu từ trái cây, hạt, củ",
  FERMENTING: "Lên men tự nhiên hoặc bằng men vi sinh (giấm, rượu, đồ uống, thực phẩm lên men)",
  STORAGE: "Lưu kho thường hoặc kho lạnh, kiểm soát nhiệt độ và độ ẩm",
  PACKAGING: "Đóng gói túi, hộp, hút chân không theo quy cách của khách hàng",
  PEELING: "Bóc vỏ, tách hạt, tách múi bằng máy hoặc thủ công",
  FREEZING: "Cấp đông nhanh (IQF) hoặc cấp đông khối, giữ độ tươi cho nông sản xuất khẩu",
  ROASTING: "Rang hạt, rang chè, rang cà phê theo nhiệt độ và thời gian phù hợp",
  EXTRACTING: "Chiết xuất cao, tinh dầu hoặc hoạt chất từ dược liệu và thảo mộc",
  BOTTLING: "Chiết rót chất lỏng (nước ép, mật ong, tinh dầu) vào chai, lọ",
  LABELING: "In, dán nhãn sản phẩm và gắn mã QR truy xuất nguồn gốc",
  OTHER: "Các dịch vụ chế biến khác, trao đổi chi tiết với nhà máy",
};

// Ids match the codes factories / machines / demands already reference
let db: Stored[] = Object.entries(PROCESSING_SERVICE_LABELS).map(([id, name]) => ({ id, name, description: SEED_DESCRIPTIONS[id] ?? "", updatedAt: now() }));

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
