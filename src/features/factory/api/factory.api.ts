import { activeScheduleFor } from "@/features/processing-schedule/api/schedule.store";
import type {
  FactoryFormValues,
  MachineFormValues,
} from "../schemas/factory-schema";
import type { FactoryApprovalStatus } from "../constants";
import type {
  Factory,
  FactoryListParams,
  Machine,
  MachineListParams,
  MachineRow,
  PageResponse,
} from "../types";
import {
  computeFactoryStatus,
  type FactorySeedValues,
} from "../utils/factory-status";
import { SEED_FACTORIES } from "./factory.mock";

export const factoryKeys = {
  all: ["factories"] as const,
  lists: () => [...factoryKeys.all, "list"] as const,
  list: (params: FactoryListParams) =>
    [...factoryKeys.lists(), params] as const,
  detail: (id: string) => [...factoryKeys.all, "detail", id] as const,
  machines: (params: MachineListParams) =>
    [...factoryKeys.all, "machines", params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace each method body with apiClient calls when the API is ready,
// e.g. `apiClient.get<PageResponse<Factory>>("/api/factory/factories", { params })`.

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const newId = () => crypto.randomUUID();

function toFactory(
  values: FactoryFormValues | FactorySeedValues,
  prev?: Factory,
  id?: string,
  approvalStatus: FactoryApprovalStatus = "APPROVED",
): Factory {
  const now = new Date().toISOString();
  const status = computeFactoryStatus(values);

  const machines: Machine[] =
    "machines" in values && Array.isArray(values.machines)
      ? values.machines.map((m) => ({
          id: "id" in m && m.id ? m.id : newId(),
          name: m.name ?? "",
          functions: ("functions" in m && Array.isArray(m.functions)
            ? m.functions
            : []) as Machine["functions"],
          productGroupIds: ("productGroupIds" in m &&
          Array.isArray(m.productGroupIds)
            ? m.productGroupIds
            : []) as string[],
          maxCapacity: m.maxCapacity ?? 0,
          capacityUnit: ("capacityUnit" in m && m.capacityUnit
            ? m.capacityUnit
            : "KG_PER_DAY") as Machine["capacityUnit"],
          status: ("status" in m && m.status
            ? m.status
            : "ACTIVE") as Machine["status"],
          certificateIds:
            "certificateIds" in m && Array.isArray(m.certificateIds)
              ? m.certificateIds
              : [],
          availableCapacity: 0,
        }))
      : (prev?.machines ?? []);

  const certifications: Factory["certifications"] =
    "certifications" in values && Array.isArray(values.certifications)
      ? values.certifications.map((c) => ({
          id: c.id ?? newId(),
          type: (c.type ??
            "OTHER") as Factory["certifications"][number]["type"],
          number: c.number,
          issuedDate: c.issuedDate,
          expiryDate: c.expiryDate,
          issuer: c.issuer,
        }))
      : (prev?.certifications ?? []);

  const representative =
    "representative" in values && values.representative
      ? {
          fullName: values.representative.fullName ?? "",
          gender: (values.representative.gender ??
            "MALE") as Factory["representative"]["gender"],
          phone: values.representative.phone ?? "",
          email: values.representative.email,
        }
      : {
          fullName:
            "representativeName" in values && values.representativeName
              ? values.representativeName
              : "",
          gender: ("representativeGender" in values &&
          values.representativeGender
            ? values.representativeGender
            : "MALE") as Factory["representative"]["gender"],
          phone:
            "representativePhone" in values && values.representativePhone
              ? values.representativePhone
              : "",
          email:
            "representativeEmail" in values && values.representativeEmail
              ? values.representativeEmail
              : undefined,
        };

  const location =
    "location" in values && values.location
      ? {
          provinceCode: values.location.provinceCode ?? "",
          wardCode: values.location.wardCode ?? "",
          address: values.location.address ?? "",
          latitude: values.location.latitude,
          longitude: values.location.longitude,
        }
      : {
          provinceCode:
            "province" in values && values.province ? values.province : "",
          wardCode: "ward" in values && values.ward ? values.ward : "",
          address: "address" in values && values.address ? values.address : "",
          latitude: "latitude" in values ? values.latitude : undefined,
          longitude: "longitude" in values ? values.longitude : undefined,
        };

  const productGroupIds =
    "productGroupIds" in values && Array.isArray(values.productGroupIds)
      ? values.productGroupIds.map(String)
      : [];

  const services = (
    "services" in values && Array.isArray(values.services)
      ? values.services
      : "processingServiceIds" in values &&
          Array.isArray(values.processingServiceIds)
        ? values.processingServiceIds.map(String)
        : []
  ) as Factory["services"];

  return {
    id: prev?.id ?? id ?? newId(),
    name: values.name ?? "",
    organizationType: ("organizationType" in values && values.organizationType
      ? values.organizationType
      : "ENTERPRISE") as Factory["organizationType"],
    taxCode: values.taxCode,
    foundedYear: values.foundedYear,
    representative,
    location,
    productGroupIds,
    services,
    description: values.description ?? "",
    offersExternalCapacity:
      "offersExternalCapacity" in values
        ? Boolean(values.offersExternalCapacity)
        : false,
    machines,
    hasCertification:
      "hasCertification" in values
        ? Boolean(values.hasCertification)
        : "hasCertificates" in values
          ? Boolean(values.hasCertificates)
          : false,
    certifications,
    avatarUrl:
      "avatarUrl" in values
        ? values.avatarUrl
        : "logoUrl" in values
          ? values.logoUrl
          : undefined,
    facilityPhotos:
      "facilityPhotos" in values && Array.isArray(values.facilityPhotos)
        ? values.facilityPhotos
        : [],
    machinePhotos:
      "machinePhotos" in values && Array.isArray(values.machinePhotos)
        ? values.machinePhotos
        : [],
    ...status,
    approvalStatus,
    reviewNote: undefined,
    kpiEligibleAt: status.isKpiEligible
      ? (prev?.kpiEligibleAt ?? now)
      : (prev?.kpiEligibleAt ?? null),
    createdAt: prev?.createdAt ?? now,
    updatedAt: now,
  };
}

// Stable seed ids so other mocks (certificates, schedules) can reference them
let db: Factory[] = SEED_FACTORIES.map((f, i) =>
  toFactory(f, undefined, `f-${i + 1}`),
);

/** Machine availability comes from its active processing schedule (BE computes this) */
const withAvailability = (m: Machine): Machine => {
  const s = activeScheduleFor(m.id);
  return s
    ? {
        ...m,
        availableCapacity: s.maxCapacity,
        availableUnit: s.capacityUnit,
        availableFrom: s.fromDate,
        availableTo: s.toDate,
      }
    : {
        ...m,
        availableCapacity: 0,
        availableUnit: undefined,
        availableFrom: undefined,
        availableTo: undefined,
      };
};
const fresh = (f: Factory): Factory => ({
  ...f,
  machines: f.machines.map(withAvailability),
});

const toMachine = (values: MachineFormValues, id: string): Machine =>
  ({
    ...values,
    id,
    certificateIds: values.certificateIds ?? [],
    availableCapacity: 0,
  }) as Machine;

const saveFactory = (f: Factory) => {
  db = db.map((x) =>
    x.id === f.id ? { ...f, updatedAt: new Date().toISOString() } : x,
  );
};

const notFound = () => Promise.reject(new Error("Không tìm thấy nhà máy."));

export const factoryApi = {
  async list(params: FactoryListParams): Promise<PageResponse<Factory>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const filtered = db.map(fresh).filter((f) => {
      if (
        keyword &&
        ![f.name, f.representative.fullName, f.taxCode ?? ""].some((v) =>
          v.toLowerCase().includes(keyword),
        )
      )
        return false;
      if (
        params.organizationType &&
        f.organizationType !== params.organizationType
      )
        return false;
      if (
        params.provinceCode &&
        f.location.provinceCode !== params.provinceCode
      )
        return false;
      if (params.approvalStatus && f.approvalStatus !== params.approvalStatus)
        return false;
      if (
        params.kpiStatus &&
        f.isKpiEligible !== (params.kpiStatus === "ELIGIBLE")
      )
        return false;
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

  /** `submitForReview`: factory-member edits go back to "Đang chờ duyệt" */
  async update(
    id: string,
    values: FactoryFormValues,
    submitForReview = false,
  ): Promise<Factory> {
    await delay();
    const prev = db.find((f) => f.id === id);
    if (!prev) return notFound();
    const updated = toFactory(
      values,
      prev,
      undefined,
      submitForReview ? "PENDING" : "APPROVED",
    );
    db = db.map((f) => (f.id === id ? updated : f));
    return fresh(updated);
  },

  /** Admin approves / rejects a pending profile */
  async review(
    id: string,
    status: "APPROVED" | "REJECTED",
    note?: string,
  ): Promise<Factory> {
    await delay();
    const prev = db.find((f) => f.id === id);
    if (!prev) return notFound();
    const updated: Factory = {
      ...prev,
      approvalStatus: status,
      reviewNote: note,
      updatedAt: new Date().toISOString(),
    };
    db = db.map((f) => (f.id === id ? updated : f));
    return fresh(updated);
  },

  async remove(id: string): Promise<void> {
    await delay();
    db = db.filter((f) => f.id !== id);
  },

  // ─── Máy & Dây chuyền (machines live inside the factory profile) ─────────

  async listMachines(
    params: MachineListParams = {},
  ): Promise<PageResponse<MachineRow>> {
    await delay(300);
    const page = params.page ?? 0;
    const size = params.size ?? 20;
    const keyword = params.keyword?.trim().toLowerCase();
    const rows = db
      .map(fresh)
      .flatMap((f) =>
        f.machines.map((m) => ({ ...m, factoryId: f.id, factoryName: f.name })),
      )
      .filter(
        (m) =>
          (!params.factoryId || m.factoryId === params.factoryId) &&
          (!params.status || m.status === params.status) &&
          (!params.function ||
            m.functions.includes(
              params.function as Machine["functions"][number],
            )) &&
          (!keyword ||
            [m.name, m.factoryName].some((v) =>
              v.toLowerCase().includes(keyword),
            )),
      );
    const start = page * size;
    return {
      content: rows.slice(start, start + size),
      totalElements: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / size)),
      page,
      size,
    };
  },

  async saveMachine(
    factoryId: string,
    values: MachineFormValues,
    machineId?: string,
  ): Promise<Machine> {
    await delay();
    const f = db.find((x) => x.id === factoryId);
    if (!f) return notFound();
    const machine = toMachine(values, machineId ?? newId());
    const machines = machineId
      ? f.machines.map((m) => (m.id === machineId ? machine : m))
      : [...f.machines, machine];
    saveFactory({ ...f, offersExternalCapacity: true, machines });
    return machine;
  },

  async removeMachine(factoryId: string, machineId: string): Promise<void> {
    await delay();
    const f = db.find((x) => x.id === factoryId);
    if (!f) return notFound();
    if (activeScheduleFor(machineId))
      throw new Error(
        "Máy đang có lịch nhận chế biến mở. Hãy đóng lịch trước khi xóa.",
      );
    saveFactory({
      ...f,
      machines: f.machines.filter((m) => m.id !== machineId),
    });
  },
};
