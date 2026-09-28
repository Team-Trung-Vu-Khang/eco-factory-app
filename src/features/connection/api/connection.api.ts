import dayjs from "dayjs";
import { factoryApi, type PageResponse } from "@/features/factory";
import { scheduleApi } from "@/features/processing-schedule";
import { activeScheduleFor } from "@/features/processing-schedule/api/schedule.store";
import { CROPS, cropGroupName } from "@/features/crop";
import { getCertificateValidity } from "@/features/certificate/utils/certificate-validity";
import { distanceKm } from "@/lib/distance";
import { PRODUCT_GROUP_LABELS, type CapacityUnit, type Factory } from "@/features/factory";
import type {
  ConnectionListParams,
  ConnectionRequest,
  FactorySearchParams,
  FactorySearchResult,
  ConnectFactoriesInput,
  MatchedMachine,
} from "../types";

export const connectionKeys = {
  all: ["connections"] as const,
  list: (params: ConnectionListParams) =>
    [...connectionKeys.all, "list", params] as const,
  search: (params: FactorySearchParams) =>
    [...connectionKeys.all, "search", params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls — search belongs to the BE (crop → product
// group resolution, distance from the factory address, open schedules only)

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
const at = (offsetDays: number) => dayjs().add(offsetDays, "day").toISOString();

// Farmers (sample) — "me" is the current user in farmer view
const FARMERS = {
  me: { farmerId: "me", farmerName: "Nguyễn Văn Nam", farmerPhone: "0987654321" },
  mai: { farmerId: "u-2", farmerName: "Lò Thị Mai", farmerPhone: "0911222333" },
  duc: { farmerId: "u-3", farmerName: "Hoàng Văn Đức", farmerPhone: "0977000111" },
  hung: { farmerId: "u-4", farmerName: "Đinh Văn Hùng", farmerPhone: "0966555444" },
  hoa: { farmerId: "u-5", farmerName: "Phạm Thị Hoa", farmerPhone: "0933444555" },
  pu: { farmerId: "u-6", farmerName: "Vàng Seo Pử", farmerPhone: "0944777888" },
  lan: { farmerId: "u-7", farmerName: "Nông Thị Lan", farmerPhone: "0955123123" },
  tuan: { farmerId: "u-8", farmerName: "Y Tuấn Êban", farmerPhone: "0905777333" },
  sang: { farmerId: "u-9", farmerName: "Trần Văn Sáng", farmerPhone: "0939456456" },
  thao: { farmerId: "u-10", farmerName: "Lê Thị Thảo", farmerPhone: "0918999000" },
};

// Post each request targets — ids / names match SEED_FACTORIES and schedule.store
const POSTS = {
  "s-1": { factoryId: "f-1", factoryName: "Hợp tác xã Chè Shan tuyết Cao Bồ", machineId: "m-1", machineName: "Máy sấy chè Shan tuyết", scheduleId: "s-1" },
  "s-25": { factoryId: "f-1", factoryName: "Hợp tác xã Chè Shan tuyết Cao Bồ", machineId: "m-1", machineName: "Máy sấy chè Shan tuyết", scheduleId: "s-25" },
  "s-3": { factoryId: "f-2", factoryName: "Công ty Cổ phần Chè Mỹ Lâm", machineId: "m-3", machineName: "Dây chuyền chè đen OTD", scheduleId: "s-3" },
  "s-4": { factoryId: "f-4", factoryName: "Công ty TNHH Một thành viên Chè Phú Bền", machineId: "m-6", machineName: "Dây chuyền chè đen CTC", scheduleId: "s-4" },
  "s-6": { factoryId: "f-5", factoryName: "Công ty TNHH Một thành viên Traphacosapa", machineId: "m-8", machineName: "Lò sấy dược liệu", scheduleId: "s-6" },
  "s-7": { factoryId: "f-6", factoryName: "Công ty Cổ phần Sản xuất và Xuất khẩu Quế Hồi Việt Nam (Vinasamex)", machineId: "m-10", machineName: "Dây chuyền cạo, cắt quế", scheduleId: "s-7" },
  "s-9": { factoryId: "f-7", factoryName: "Công ty Chè Mộc Châu", machineId: "m-12", machineName: "Dây chuyền chè ô long", scheduleId: "s-9" },
  "s-11": { factoryId: "f-9", factoryName: "Công ty Cổ phần Thực phẩm Xuất khẩu Đồng Giao (Doveco)", machineId: "m-15", machineName: "Dây chuyền ép dứa cô đặc", scheduleId: "s-11" },
  "s-27": { factoryId: "f-9", factoryName: "Công ty Cổ phần Thực phẩm Xuất khẩu Đồng Giao (Doveco)", machineId: "m-15", machineName: "Dây chuyền ép dứa cô đặc", scheduleId: "s-27" },
  "s-13": { factoryId: "f-10", factoryName: "Công ty Cổ phần Nafoods Group", machineId: "m-18", machineName: "Dây chuyền puree chanh leo", scheduleId: "s-13" },
  "s-16": { factoryId: "f-12", factoryName: "Chi nhánh Công ty CP Tập đoàn Intimex tại Buôn Ma Thuột", machineId: "m-23", machineName: "Máy phân loại màu (color sorter)", scheduleId: "s-16" },
  "s-20": { factoryId: "f-17", factoryName: "Công ty Cổ phần Chế biến Thực phẩm Đà Lạt Tự Nhiên", machineId: "m-31", machineName: "Máy sấy lạnh heat-pump", scheduleId: "s-20" },
  "s-22": { factoryId: "f-18", factoryName: "Công ty Cổ phần Rau quả Thực phẩm An Giang (Antesco) – Nhà máy Bình Long", machineId: "m-33", machineName: "Hầm đông IQF băng chuyền", scheduleId: "s-22" },
  "s-23": { factoryId: "f-19", factoryName: "Công ty Cổ phần Tập đoàn Lộc Trời", machineId: "m-35", machineName: "Tháp sấy lúa", scheduleId: "s-23" },
  "s-24": { factoryId: "f-20", factoryName: "Công ty Cổ phần Nông nghiệp Công nghệ cao Trung An", machineId: "m-37", machineName: "Dây chuyền xát trắng, tách màu", scheduleId: "s-24" },
};

const ton = { requirements: { quantityUnit: "TON" as const, requiredCertifications: [] } };
const kg = { requirements: { quantityUnit: "KG" as const, requiredCertifications: [] } };

let db: ConnectionRequest[] = [
  { id: "cn-1", ...FARMERS.me, ...POSTS["s-1"], cropIds: ["SHAN_TEA"], quantity: 800, ...kg, note: "Chè búp hái sáng, giao trong ngày", status: "PENDING", createdAt: at(-1) },
  { id: "cn-2", ...FARMERS.lan, ...POSTS["s-1"], cropIds: ["SHAN_TEA"], quantity: 1.5, ...ton, status: "PENDING", createdAt: at(0) },
  { id: "cn-3", ...FARMERS.me, ...POSTS["s-25"], cropIds: ["SHAN_TEA"], status: "SUCCESS", resultNote: "Đã ký hợp đồng sấy 2 tấn", createdAt: at(-90), resolvedAt: at(-80) },
  { id: "cn-4", ...FARMERS.hung, ...POSTS["s-3"], cropIds: ["GREEN_TEA"], quantity: 5, ...ton, status: "FAILED", resultNote: "Chè búp chưa đạt tiêu chuẩn 1 tôm 2 lá", createdAt: at(-8), resolvedAt: at(-5) },
  { id: "cn-5", ...FARMERS.hoa, ...POSTS["s-4"], cropIds: ["GREEN_TEA"], quantity: 12, ...ton, status: "PENDING", createdAt: at(0) },
  { id: "cn-6", ...FARMERS.mai, ...POSTS["s-6"], cropIds: ["ARTICHOKE"], quantity: 600, ...kg, note: "Atiso hái bông, đã phơi héo", status: "PENDING", createdAt: at(-1) },
  { id: "cn-7", ...FARMERS.pu, ...POSTS["s-7"], cropIds: ["CINNAMON"], quantity: 20, ...ton, note: "Quế vỏ 15 năm tuổi, Văn Yên", status: "PENDING", createdAt: at(-3) },
  { id: "cn-8", ...FARMERS.pu, ...POSTS["s-9"], cropIds: ["GREEN_TEA"], quantity: 3, ...ton, status: "SUCCESS", resultNote: "Giao 3 tấn/đợt, thanh toán 15 ngày", createdAt: at(-2), resolvedAt: at(-1) },
  { id: "cn-9", ...FARMERS.duc, ...POSTS["s-11"], cropIds: ["PINEAPPLE"], quantity: 50, ...ton, note: "Dứa Queen, độ Brix ≥ 13", status: "PENDING", createdAt: at(-4) },
  { id: "cn-10", ...FARMERS.hoa, ...POSTS["s-11"], cropIds: ["PINEAPPLE"], quantity: 8, ...ton, status: "FAILED", resultNote: "Sản lượng chưa đủ tối thiểu 20 tấn", createdAt: at(-6), resolvedAt: at(-5) },
  { id: "cn-11", ...FARMERS.duc, ...POSTS["s-27"], cropIds: ["PINEAPPLE"], status: "SUCCESS", resultNote: "Đã ký hợp đồng bao tiêu 120 tấn", createdAt: at(-140), resolvedAt: at(-130) },
  { id: "cn-12", ...FARMERS.hung, ...POSTS["s-13"], cropIds: ["PINEAPPLE"], quantity: 30, ...ton, status: "PENDING", createdAt: at(-2) },
  { id: "cn-13", ...FARMERS.tuan, ...POSTS["s-16"], cropIds: ["COFFEE"], quantity: 40, ...ton, note: "Robusta sàng 16, độ ẩm 12.5%", status: "PENDING", createdAt: at(-1) },
  { id: "cn-14", ...FARMERS.thao, ...POSTS["s-20"], cropIds: ["SWEET_POTATO"], quantity: 2, ...ton, status: "PENDING", createdAt: at(0) },
  { id: "cn-15", ...FARMERS.sang, ...POSTS["s-22"], cropIds: ["MANGO"], quantity: 25, ...ton, note: "Xoài cát Hòa Lộc loại 2", status: "PENDING", createdAt: at(-2) },
  { id: "cn-16", ...FARMERS.sang, ...POSTS["s-23"], cropIds: ["RICE"], quantity: 200, ...ton, note: "Lúa OM18 vụ Thu Đông", status: "SUCCESS", resultNote: "Sấy 200 tấn, nhận trong tuần", createdAt: at(-1), resolvedAt: at(0) },
  { id: "cn-17", ...FARMERS.thao, ...POSTS["s-24"], cropIds: ["RICE"], quantity: 80, ...ton, status: "PENDING", createdAt: at(-3) },
  // Not yet matched to a factory (sent from the search form)
  { id: "cn-18", ...FARMERS.me, cropIds: ["DURIAN"], quantity: 10, ...ton, note: "Tìm nhà máy cấp đông sầu riêng", status: "PENDING", createdAt: at(0) },
];

// Rough kg/day for comparing a requested quantity; BATCH / OTHER can't be compared
const KG_PER_DAY: Partial<Record<CapacityUnit, number>> = {
  KG_PER_HOUR: 8,
  LIT_PER_HOUR: 8,
  KG_PER_DAY: 1,
  LIT_PER_DAY: 1,
  TON_PER_DAY: 1000,
  KG_PER_MONTH: 1 / 30,
  TON_PER_MONTH: 1000 / 30,
};

/** Can the schedule process `quantity` kg between now (or its start) and its end date? */
const coversQuantity = (
  maxCapacity: number,
  unit: CapacityUnit,
  fromDate: string,
  toDate: string,
  quantity: number,
) => {
  const factor = KG_PER_DAY[unit];
  if (!factor) return true;
  const start = dayjs(fromDate).isAfter(dayjs(), "day")
    ? dayjs(fromDate)
    : dayjs();
  const days = dayjs(toDate).diff(start.startOf("day"), "day") + 1;
  return maxCapacity * factor * Math.max(days, 0) >= quantity;
};

/** Machine capacity ≥ requested; compared via kg/day when units differ, BATCH/OTHER only match their own unit */
const meetsCapacity = (
  max: number,
  unit: CapacityUnit,
  min: number,
  wantUnit: CapacityUnit,
) => {
  if (unit === wantUnit) return max >= min;
  const a = KG_PER_DAY[unit];
  const b = KG_PER_DAY[wantUnit];
  return !!a && !!b && max * a >= min * b;
};

const hasCertifications = (factory: Factory, required: string[]) =>
  required.every((type) =>
    factory.certifications.some(
      (c) =>
        c.type === type &&
        getCertificateValidity(c.expiryDate).validity !== "EXPIRED",
    ),
  );

/**
 * Crop → product-group ids, matched by group name ("Cây chè", "Cây ăn quả"…).
 * PRODUCT_GROUP_LABELS holds seed keys plus ids synced from the API.
 */
const groupIdsForCrop = (cropId: string) => {
  const groupId = CROPS.find((c) => c.id === cropId)?.groupId;
  if (!groupId) return [];
  const name = cropGroupName(groupId).trim().toLowerCase();
  return Object.entries(PRODUCT_GROUP_LABELS)
    .filter(([, label]) => label.trim().toLowerCase() === name)
    .map(([id]) => id);
};

export const connectionApi = {
  async search(params: FactorySearchParams): Promise<FactorySearchResult[]> {
    await delay();
    const { content: factories } = await factoryApi.list({
      page: 0,
      size: 100,
    });
    // Crop → product groups via "Nhóm nông sản" links
    const groupIds = new Set(
      params.cropIds.flatMap(groupIdsForCrop),
    );
    const origin = { latitude: params.latitude, longitude: params.longitude };
    const useRadius =
      params.radiusKm !== undefined && params.latitude !== undefined;

    return factories
      .map((factory): FactorySearchResult | null => {
        const { location } = factory;
        if (
          params.provinceCode &&
          location.provinceCode !== params.provinceCode
        )
          return null;
        if (params.wardCode && location.wardCode !== params.wardCode)
          return null;
        if (!hasCertifications(factory, params.requiredCertifications))
          return null;
        const distance = distanceKm(origin, location);
        if (
          useRadius &&
          (distance === undefined || distance > params.radiusKm!)
        )
          return null;

        const machines = factory.machines.flatMap((m): MatchedMachine[] => {
          // Only machines with a posted schedule are available
          const schedule = activeScheduleFor(m.id);
          if (!schedule || m.status !== "ACTIVE") return [];
          if (
            params.functions.length &&
            !m.functions.some((f) => params.functions.includes(f))
          )
            return [];
          if (
            params.cropIds.length &&
            !m.productGroupIds.some((g) => groupIds.has(g))
          )
            return [];
          if (
            params.productGroupIds?.length &&
            !m.productGroupIds.some((g) => params.productGroupIds!.includes(g))
          )
            return [];
          if (
            params.minCapacity &&
            params.capacityUnit &&
            !meetsCapacity(
              m.maxCapacity,
              m.capacityUnit,
              params.minCapacity,
              params.capacityUnit,
            )
          )
            return [];
          if (
            params.quantity &&
            !coversQuantity(
              schedule.maxCapacity,
              schedule.capacityUnit,
              schedule.fromDate,
              schedule.toDate,
              params.quantity * (params.quantityUnit === "TON" ? 1000 : 1),
            )
          )
            return [];
          return [
            {
              ...m,
              factoryId: factory.id,
              factoryName: factory.name,
              scheduleId: schedule.id,
              scheduleFrom: schedule.fromDate,
              scheduleTo: schedule.toDate,
              scheduleCapacity: schedule.maxCapacity,
              scheduleUnit: schedule.capacityUnit,
              schedulePostedAt: schedule.createdAt,
              connectionCount: db.filter((c) => c.scheduleId === schedule.id)
                .length,
            },
          ];
        });
        return machines.length
          ? { factory, distanceKm: distance, machines }
          : null;
      })
      .filter((r): r is FactorySearchResult => !!r)
      .sort(
        (a, b) =>
          (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) ||
          a.factory.name.localeCompare(b.factory.name),
      );
  },

  async list(
    params: ConnectionListParams,
  ): Promise<PageResponse<ConnectionRequest>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const rows = db
      .filter(
        (c) =>
          (!params.farmerId || c.farmerId === params.farmerId) &&
          (!params.scheduleId || c.scheduleId === params.scheduleId) &&
          (!params.status || c.status === params.status) &&
          (!keyword ||
            [c.farmerName, c.factoryName, c.machineName, c.farmerPhone].some(
              (v) => v?.toLowerCase().includes(keyword),
            )),
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

  /** "Kết nối nhà máy" — sends the search criteria; admin matches a factory */
  async connect({
    farmer,
    criteria,
    target,
  }: ConnectFactoriesInput): Promise<ConnectionRequest> {
    await delay();
    const created: ConnectionRequest = {
      id: crypto.randomUUID(),
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerPhone: farmer.phone,
      ...(target && {
        factoryId: target.factory.id,
        factoryName: target.factory.name,
        machineId: target.machine.id,
        machineName: target.machine.name,
        scheduleId: target.machine.scheduleId,
      }),
      cropIds: criteria.cropIds,
      quantity: criteria.quantity,
      requirements: {
        quantityUnit: criteria.quantityUnit,
        requiredCertifications: criteria.requiredCertifications,
        materialCondition: criteria.materialCondition,
        packagingRequirements: criteria.packagingRequirements,
        technicalRequirements: criteria.technicalRequirements,
      },
      criteria,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    db = [created, ...db];
    return created;
  },

  /** Admin confirms the outcome; success closes the schedule so it stops matching */
  async resolve(
    id: string,
    status: "SUCCESS" | "FAILED",
    resultNote?: string,
  ): Promise<ConnectionRequest> {
    await delay();
    const found = db.find((c) => c.id === id);
    if (!found) throw new Error("Không tìm thấy yêu cầu kết nối.");
    if (found.status !== "PENDING") throw new Error("Yêu cầu đã được xử lý.");
    const updated = {
      ...found,
      status,
      resultNote,
      resolvedAt: new Date().toISOString(),
    };
    db = db.map((c) => (c.id === id ? updated : c));
    if (status === "SUCCESS" && found.scheduleId)
      await scheduleApi.close(found.scheduleId, "CONNECTED");
    return updated;
  },
};
