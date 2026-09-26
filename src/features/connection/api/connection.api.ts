import dayjs from "dayjs";
import { factoryApi, type PageResponse } from "@/features/factory";
import { scheduleApi } from "@/features/processing-schedule";
import { activeScheduleFor } from "@/features/processing-schedule/api/schedule.store";
import { productGroupApi } from "@/features/product-group";
import { getCertificateValidity } from "@/features/certificate/utils/certificate-validity";
import { distanceKm } from "@/lib/distance";
import type { CapacityUnit, Factory } from "@/features/factory";
import type {
  ConnectionListParams,
  ConnectionRequest,
  FactorySearchParams,
  FactorySearchResult,
  MatchedMachine,
  RegisterConnectionInput,
} from "../types";

export const connectionKeys = {
  all: ["connections"] as const,
  list: (params: ConnectionListParams) => [...connectionKeys.all, "list", params] as const,
  search: (params: FactorySearchParams) => [...connectionKeys.all, "search", params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls — search belongs to the BE (crop → product
// group resolution, distance from the factory address, open schedules only)

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const at = (offsetDays: number) => dayjs().add(offsetDays, "day").toISOString();

let db: ConnectionRequest[] = [
  { id: "cn-1", farmerId: "me", farmerName: "Nguyễn Văn Nam", farmerPhone: "0987654321", factoryId: "f-1", factoryName: "HTX Chè Shan tuyết Vị Xuyên", machineId: "m-1", machineName: "Máy sấy chè", scheduleId: "s-1", cropIds: ["SHAN_TEA"], quantity: 200, capacityUnit: "KG_PER_DAY", note: "Chè búp hái sáng", status: "PENDING", createdAt: at(-1) },
  { id: "cn-2", farmerId: "u-2", farmerName: "Lò Thị Mai", farmerPhone: "0911222333", factoryId: "f-5", factoryName: "Kho lạnh Việt Trì", machineId: "m-5", machineName: "Kho lạnh số 1", scheduleId: "s-4", cropIds: ["ORANGE"], quantity: 3, capacityUnit: "TON_PER_DAY", status: "PENDING", createdAt: at(-2) },
  { id: "cn-3", farmerId: "me", farmerName: "Nguyễn Văn Nam", farmerPhone: "0987654321", factoryId: "f-1", factoryName: "HTX Chè Shan tuyết Vị Xuyên", machineId: "m-1", machineName: "Máy sấy chè", scheduleId: "s-6", cropIds: ["GREEN_TEA"], status: "SUCCESS", resultNote: "Đã ký hợp đồng sấy 2 tấn", createdAt: at(-90), resolvedAt: at(-80) },
  { id: "cn-4", farmerId: "u-3", farmerName: "Hoàng Văn Đức", farmerPhone: "0977000111", factoryId: "f-4", factoryName: "Công ty CP Thực phẩm Tam Điệp", machineId: "m-4", machineName: "Máy chiết rót đóng chai", scheduleId: "s-3", cropIds: ["PINEAPPLE"], status: "FAILED", resultNote: "Sản lượng chưa đủ tối thiểu", createdAt: at(-8), resolvedAt: at(-5) },
];

// Rough kg/day for comparing a requested quantity; BATCH / OTHER can't be compared
const KG_PER_DAY: Partial<Record<CapacityUnit, number>> = { KG_PER_HOUR: 8, LIT_PER_HOUR: 8, KG_PER_DAY: 1, LIT_PER_DAY: 1, TON_PER_DAY: 1000 };

/** Can the schedule process `quantity` kg between now (or its start) and its end date? */
const coversQuantity = (maxCapacity: number, unit: CapacityUnit, fromDate: string, toDate: string, quantity: number) => {
  const factor = KG_PER_DAY[unit];
  if (!factor) return true;
  const start = dayjs(fromDate).isAfter(dayjs(), "day") ? dayjs(fromDate) : dayjs();
  const days = dayjs(toDate).diff(start.startOf("day"), "day") + 1;
  return maxCapacity * factor * Math.max(days, 0) >= quantity;
};

const hasCertifications = (factory: Factory, required: string[]) =>
  required.every((type) =>
    factory.certifications.some((c) => c.type === type && getCertificateValidity(c.expiryDate).validity !== "EXPIRED"),
  );

export const connectionApi = {
  async search(params: FactorySearchParams): Promise<FactorySearchResult[]> {
    await delay();
    const { content: factories } = await factoryApi.list({ page: 0, size: 1000 });
    // Crop → product groups via "Nhóm nông sản" links
    const groupIds = new Set(params.cropIds.flatMap((c) => productGroupApi.groupIdsForCrop(c)));
    const origin = { latitude: params.latitude, longitude: params.longitude };
    const useRadius = params.radiusKm !== undefined && params.latitude !== undefined;

    return factories
      .map((factory): FactorySearchResult | null => {
        const { location } = factory;
        if (params.provinceCode && location.provinceCode !== params.provinceCode) return null;
        if (params.wardCode && location.wardCode !== params.wardCode) return null;
        if (!hasCertifications(factory, params.requiredCertifications)) return null;
        const distance = distanceKm(origin, location);
        if (useRadius && (distance === undefined || distance > params.radiusKm!)) return null;

        const machines = factory.machines.flatMap((m): MatchedMachine[] => {
          // Only machines with a posted schedule are available
          const schedule = activeScheduleFor(m.id);
          if (!schedule || m.status !== "ACTIVE") return [];
          if (params.functions.length && !m.functions.some((f) => params.functions.includes(f))) return [];
          if (params.cropIds.length && !m.productGroupIds.some((g) => groupIds.has(g))) return [];
          if (params.quantity && !coversQuantity(schedule.maxCapacity, schedule.capacityUnit, schedule.fromDate, schedule.toDate, params.quantity)) return [];
          return [
            {
              ...m,
              factoryId: factory.id,
              factoryName: factory.name,
              scheduleId: schedule.id,
              scheduleFrom: schedule.fromDate,
              scheduleTo: schedule.toDate,
            },
          ];
        });
        return machines.length ? { factory, distanceKm: distance, machines } : null;
      })
      .filter((r): r is FactorySearchResult => !!r)
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) || a.factory.name.localeCompare(b.factory.name));
  },

  async list(params: ConnectionListParams): Promise<PageResponse<ConnectionRequest>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const rows = db
      .filter(
        (c) =>
          (!params.farmerId || c.farmerId === params.farmerId) &&
          (!params.status || c.status === params.status) &&
          (!keyword || [c.farmerName, c.factoryName, c.machineName, c.farmerPhone].some((v) => v.toLowerCase().includes(keyword))),
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const start = params.page * params.size;
    return {
      content: rows.slice(start, start + params.size),
      totalElements: rows.length,
      totalPages: Math.max(1, Math.ceil(rows.length / params.size)),
      page: params.page,
      size: params.size,
    };
  },

  /** "Đăng ký chờ kết nối" */
  async register({ farmer, factory, machine, cropIds, quantity, requirements, note }: RegisterConnectionInput): Promise<ConnectionRequest> {
    await delay();
    if (db.some((c) => c.farmerId === farmer.id && c.scheduleId === machine.scheduleId && c.status === "PENDING")) {
      throw new Error("Bạn đã đăng ký lịch này và đang chờ kết nối.");
    }
    const created: ConnectionRequest = {
      id: crypto.randomUUID(),
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      factoryId: factory.id,
      factoryName: factory.name,
      machineId: machine.id,
      machineName: machine.name,
      scheduleId: machine.scheduleId,
      cropIds,
      quantity,
      capacityUnit: machine.capacityUnit,
      requirements,
      note,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    db = [created, ...db];
    return created;
  },

  /** Admin confirms the outcome; success closes the schedule so it stops matching */
  async resolve(id: string, status: "SUCCESS" | "FAILED", resultNote?: string): Promise<ConnectionRequest> {
    await delay();
    const found = db.find((c) => c.id === id);
    if (!found) throw new Error("Không tìm thấy yêu cầu kết nối.");
    if (found.status !== "PENDING") throw new Error("Yêu cầu đã được xử lý.");
    const updated = { ...found, status, resultNote, resolvedAt: new Date().toISOString() };
    db = db.map((c) => (c.id === id ? updated : c));
    if (status === "SUCCESS") await scheduleApi.close(found.scheduleId, "CONNECTED");
    return updated;
  },
};
