import { activeScheduleFor } from "@/features/processing-schedule/api/schedule.store";
import type { FactoryFormValues, MachineFormValues } from "../schemas/factory-schema";
import type { Factory, FactoryListParams, Machine, MachineListParams, MachineRow, PageResponse } from "../types";
import { computeFactoryStatus } from "../utils/factory-status";
import { SEED_FACTORIES } from "./factory.mock";

export const factoryKeys = {
  all: ["factories"] as const,
  lists: () => [...factoryKeys.all, "list"] as const,
  list: (params: FactoryListParams) => [...factoryKeys.lists(), params] as const,
  detail: (id: string) => [...factoryKeys.all, "detail", id] as const,
  machines: (params: MachineListParams) => [...factoryKeys.all, "machines", params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace each method body with apiClient calls when the API is ready,
// e.g. `apiClient.get<PageResponse<Factory>>("/api/factory/factories", { params })`.

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const newId = () => crypto.randomUUID();

function toFactory(values: FactoryFormValues, prev?: Factory, id?: string): Factory {
  const now = new Date().toISOString();
  const status = computeFactoryStatus(values);
  return {
    ...(values as unknown as Omit<Factory, "id">),
    id: prev?.id ?? id ?? newId(),
    machines: values.machines.map((m) => ({ ...m, id: m.id ?? newId(), availableCapacity: 0 })) as Factory["machines"],
    certifications: values.certifications.map((c) => ({ ...c, id: c.id ?? newId() })) as Factory["certifications"],
    ...status,
    kpiEligibleAt: status.isKpiEligible ? (prev?.kpiEligibleAt ?? now) : (prev?.kpiEligibleAt ?? null),
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
}

// Stable seed ids so other mocks (certificates, schedules) can reference them
let db: Factory[] = SEED_FACTORIES.map((f, i) => toFactory(f, undefined, `f-${i + 1}`));

/** Machine availability comes from its active processing schedule (BE computes this) */
const withAvailability = (m: Machine): Machine => {
  const s = activeScheduleFor(m.id);
  return s
    ? { ...m, availableCapacity: s.maxCapacity, availableFrom: s.fromDate, availableTo: s.toDate }
    : { ...m, availableCapacity: 0, availableFrom: undefined, availableTo: undefined };
};
const fresh = (f: Factory): Factory => ({ ...f, machines: f.machines.map(withAvailability) });

const toMachine = (values: MachineFormValues, id: string): Machine =>
  ({ ...values, id, certificateIds: values.certificateIds ?? [], availableCapacity: 0 }) as Machine;

const saveFactory = (f: Factory) => {
  db = db.map((x) => (x.id === f.id ? { ...f, updatedAt: new Date().toISOString() } : x));
};

const notFound = () => Promise.reject(new Error("Không tìm thấy nhà máy."));

export const factoryApi = {
  async list(params: FactoryListParams): Promise<PageResponse<Factory>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.map(fresh).filter((f) => {
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
    const found = db.find((f) => f.id === id);
    return found ? fresh(found) : notFound();
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
    return fresh(updated);
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((f) => f.id !== id);
  },

  // ─── Máy & Dây chuyền (machines live inside the factory profile) ─────────

  async listMachines(params: MachineListParams): Promise<PageResponse<MachineRow>> {
    await delay(300);
    const keyword = params.keyword?.trim().toLowerCase();
    const rows = db
      .map(fresh)
      .flatMap((f) => f.machines.map((m) => ({ ...m, factoryId: f.id, factoryName: f.name })))
      .filter(
        (m) =>
          (!params.factoryId || m.factoryId === params.factoryId) &&
          (!params.status || m.status === params.status) &&
          (!params.function || m.functions.includes(params.function as Machine["functions"][number])) &&
          (!keyword || [m.name, m.factoryName].some((v) => v.toLowerCase().includes(keyword))),
      );
    const start = params.page * params.size;
    return {
      content: rows.slice(start, start + params.size),
      totalElements: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  async saveMachine(factoryId: string, values: MachineFormValues, machineId?: string): Promise<Machine> {
    await delay();
    const f = db.find((x) => x.id === factoryId);
    if (!f) return notFound();
    const machine = toMachine(values, machineId ?? newId());
    const machines = machineId ? f.machines.map((m) => (m.id === machineId ? machine : m)) : [...f.machines, machine];
    saveFactory({ ...f, offersExternalCapacity: true, machines });
    return machine;
  },

  async removeMachine(factoryId: string, machineId: string): Promise<void> {
    await delay();
    const f = db.find((x) => x.id === factoryId);
    if (!f) return notFound();
    if (activeScheduleFor(machineId)) throw new Error("Máy đang có lịch nhận chế biến mở. Hãy đóng lịch trước khi xóa.");
    saveFactory({ ...f, machines: f.machines.filter((m) => m.id !== machineId) });
  },
};
