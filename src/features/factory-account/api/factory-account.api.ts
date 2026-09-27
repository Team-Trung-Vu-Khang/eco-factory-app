import type { PageResponse } from "@/features/factory";
import type { FactoryAccountFormValues } from "../schema";
import type { FactoryAccount, FactoryAccountListParams, FactoryAccountStatus } from "../types";

export const factoryAccountKeys = {
  all: ["factory-accounts"] as const,
  lists: () => [...factoryAccountKeys.all, "list"] as const,
  list: (params: FactoryAccountListParams) => [...factoryAccountKeys.lists(), params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/accounts", { params })

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
const now = () => new Date().toISOString();

let db: FactoryAccount[] = [
  { id: "a1", name: "Nguyễn Văn An", username: "an.nguyen", phone: "0912000111", email: "an@mevi.vn", factoryId: "f-1", role: "OWNER", status: "ACTIVE", createdAt: now() },
  { id: "a2", name: "Lê Thị Bình", username: "binh.le", phone: "0987222333", factoryId: "f-1", role: "MANAGER", status: "ACTIVE", createdAt: now() },
  { id: "a3", name: "Trần Văn Cường", username: "cuong.tran", phone: "0903444555", factoryId: "f-2", role: "STAFF", status: "SUSPENDED", createdAt: now() },
];

const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();

const assertUniqueUsername = (username: string, exceptId?: string) => {
  if (db.some((a) => a.username.toLowerCase() === username.toLowerCase() && a.id !== exceptId))
    throw new Error("Tên đăng nhập đã tồn tại.");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const toStored = ({ password: _pw, email, ...rest }: FactoryAccountFormValues) => ({ ...rest, email: email || undefined });

export const factoryAccountApi = {
  async list(params: FactoryAccountListParams): Promise<PageResponse<FactoryAccount>> {
    await delay();
    const q = normalize(params.keyword?.trim() ?? "");
    const filtered = db.filter(
      (a) =>
        (!q || normalize(`${a.name} ${a.username} ${a.phone}`).includes(q)) &&
        (!params.status || a.status === params.status) &&
        (!params.factoryId || a.factoryId === params.factoryId),
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

  async create(values: FactoryAccountFormValues): Promise<FactoryAccount> {
    await delay();
    if (!values.password) throw new Error("Vui lòng nhập mật khẩu.");
    assertUniqueUsername(values.username);
    const created: FactoryAccount = { ...toStored(values), id: crypto.randomUUID(), status: "ACTIVE", createdAt: now() };
    db = [created, ...db];
    return created;
  },

  async update(id: string, values: FactoryAccountFormValues): Promise<FactoryAccount> {
    await delay();
    const prev = db.find((a) => a.id === id);
    if (!prev) throw new Error("Không tìm thấy tài khoản.");
    assertUniqueUsername(values.username, id);
    const updated = { ...prev, ...toStored(values) };
    db = db.map((a) => (a.id === id ? updated : a));
    return updated;
  },

  async setStatus(id: string, status: FactoryAccountStatus): Promise<void> {
    await delay(200);
    db = db.map((a) => (a.id === id ? { ...a, status } : a));
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((a) => a.id !== id);
  },
};
