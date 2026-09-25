import type { PageResponse } from "@/features/factory";
import type { DemandFormValues } from "../schemas/demand-schema";
import type { Demand, DemandListParams, DemandSummary } from "../types";
import { SEED_DEMANDS } from "./demand.mock";

export const demandKeys = {
  all: ["demands"] as const,
  lists: () => [...demandKeys.all, "list"] as const,
  list: (params: DemandListParams) => [...demandKeys.lists(), params] as const,
  summary: () => [...demandKeys.all, "summary"] as const,
  detail: (id: string) => [...demandKeys.all, "detail", id] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.get("/api/factory/demands", { params })

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

type Counters = Pick<Demand, "viewedFactoryCount" | "sentFactoryCount" | "respondedFactoryCount">;
const NO_COUNTERS: Counters = { viewedFactoryCount: 0, sentFactoryCount: 0, respondedFactoryCount: 0 };

/** Spec §4.4 — computed server-side in the real API */
const toDemand = (values: DemandFormValues, counters: Counters, id: string = crypto.randomUUID(), createdAt?: string): Demand => {
  const r = values.requester;
  const now = new Date().toISOString();
  return {
    ...(values as unknown as Demand),
    ...counters,
    id,
    kpi: {
      isProfileComplete: [r.fullName, r.gender, r.organizationName, r.phone, r.provinceCode].every(Boolean),
      hasConfirmedDemand: values.hasDemand,
      hasViewedFactory: counters.viewedFactoryCount >= 1,
      hasFactoryResponse: counters.respondedFactoryCount >= 1,
    },
    createdAt: createdAt ?? now,
    updatedAt: now,
  };
};

let db: Demand[] = SEED_DEMANDS.map(({ viewedFactoryCount, sentFactoryCount, respondedFactoryCount, ...values }) =>
  toDemand(values, { viewedFactoryCount, sentFactoryCount, respondedFactoryCount }),
);

const find = (id: string) => {
  const found = db.find((d) => d.id === id);
  if (!found) throw new Error("Không tìm thấy nhu cầu.");
  return found;
};

export const demandApi = {
  async list(params: DemandListParams): Promise<PageResponse<Demand>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.filter(
      (d) =>
        (!keyword ||
          [d.productName, d.requester.fullName, d.requester.organizationName, d.requester.phone].some((v) =>
            v.toLowerCase().includes(keyword),
          )) &&
        (!params.status || d.status === params.status) &&
        (!params.productGroupId || d.productGroupId === params.productGroupId) &&
        (!params.provinceCode || d.materialLocation.provinceCode === params.provinceCode),
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

  async get(id: string): Promise<Demand> {
    await delay();
    return find(id);
  },

  async summary(): Promise<DemandSummary> {
    await delay(200);
    return {
      total: db.length,
      open: db.filter((d) => !["COMPLETED", "CANCELLED"].includes(d.status)).length,
      connected: db.filter((d) => d.kpi.hasFactoryResponse).length,
      femaleReached: new Set(
        db.filter((d) => d.requester.gender === "FEMALE" && d.kpi.hasViewedFactory).map((d) => d.requester.phone),
      ).size,
    };
  },

  async create(values: DemandFormValues): Promise<Demand> {
    await delay();
    const created = toDemand(values, NO_COUNTERS);
    db = [created, ...db];
    return created;
  },

  async update(id: string, values: DemandFormValues): Promise<Demand> {
    await delay();
    const current = find(id);
    const updated = toDemand(values, current, id, current.createdAt);
    db = db.map((d) => (d.id === id ? updated : d));
    return updated;
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((d) => d.id !== id);
  },
};
