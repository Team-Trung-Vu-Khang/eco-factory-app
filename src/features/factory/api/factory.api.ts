import type { FactoryFormValues } from "../schemas/factory-schema";
import type { Factory, FactoryListParams, PageResponse } from "../types";
import { computeFactoryStatus } from "../utils/factory-status";
import { SEED_FACTORIES } from "./factory.mock";

export const factoryKeys = {
  all: ["factories"] as const,
  lists: () => [...factoryKeys.all, "list"] as const,
  list: (params: FactoryListParams) => [...factoryKeys.lists(), params] as const,
  detail: (id: string) => [...factoryKeys.all, "detail", id] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace each method body with apiClient calls when the API is ready,
// e.g. `apiClient.get<PageResponse<Factory>>("/api/factory/factories", { params })`.

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const newId = () => crypto.randomUUID();

function toFactory(values: FactoryFormValues, prev?: Factory): Factory {
  const now = new Date().toISOString();
  const status = computeFactoryStatus(values);
  return {
    ...(values as unknown as Omit<Factory, "id">),
    id: prev?.id ?? newId(),
    machines: values.machines.map((m) => ({ ...m, id: m.id ?? newId() })) as Factory["machines"],
    certifications: values.certifications.map((c) => ({ ...c, id: c.id ?? newId() })) as Factory["certifications"],
    ...status,
    kpiEligibleAt: status.isKpiEligible ? (prev?.kpiEligibleAt ?? now) : (prev?.kpiEligibleAt ?? null),
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
}

let db: Factory[] = SEED_FACTORIES.map((f) => toFactory(f));

const notFound = () => Promise.reject(new Error("Không tìm thấy nhà máy."));

export const factoryApi = {
  async list(params: FactoryListParams): Promise<PageResponse<Factory>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.filter((f) => {
      if (keyword && ![f.name, f.representative.fullName, f.taxCode ?? ""].some((v) => v.toLowerCase().includes(keyword))) return false;
      if (params.organizationType && f.organizationType !== params.organizationType) return false;
      if (params.provinceCode && f.location.provinceCode !== params.provinceCode) return false;
      if (params.kpiStatus && f.isKpiEligible !== (params.kpiStatus === "ELIGIBLE")) return false;
      return true;
    });
    const start = params.page * params.size;
    return {
      content: filtered.slice(start, start + params.size),
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async get(id: string): Promise<Factory> {
    await delay();
    return db.find((f) => f.id === id) ?? notFound();
  },

  async create(values: FactoryFormValues): Promise<Factory> {
    await delay();
    const created = toFactory(values);
    db = [created, ...db];
    return created;
  },

  async update(id: string, values: FactoryFormValues): Promise<Factory> {
    await delay();
    const prev = db.find((f) => f.id === id);
    if (!prev) return notFound();
    const updated = toFactory(values, prev);
    db = db.map((f) => (f.id === id ? updated : f));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((f) => f.id !== id);
  },
};
