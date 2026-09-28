import dayjs from "dayjs";
import type { ProcessingSchedule } from "../types";

// ─── Shared in-memory store ─────────────────────────────────────────────────
// Kept free of factory imports so factory.api can derive machine availability
// from it without a circular dependency. TODO: gone once the BE owns this.

const d = (offsetDays: number) => dayjs().add(offsetDays, "day").format("YYYY-MM-DD");
const at = (offsetDays: number, hour = 9, minute = 0) => dayjs().add(offsetDays, "day").hour(hour).minute(minute).second(0).toISOString();

// Machine / factory ids match SEED_FACTORIES (features/factory/api/factory.mock.ts)
let db: ProcessingSchedule[] = [
  // Open posts
  { id: "s-1", factoryId: "f-1", machineId: "m-1", fromDate: d(-5), toDate: d(40), maxCapacity: 20, capacityUnit: "TON_PER_MONTH", note: "Nhận sấy chè Shan tuyết búp tươi vụ thu", status: "OPEN", createdAt: at(-6, 8, 15) },
  { id: "s-2", factoryId: "f-1", machineId: "m-2", fromDate: d(3), toDate: d(60), maxCapacity: 6, capacityUnit: "TON_PER_MONTH", note: "Sao chè xanh, hồng trà theo đơn", status: "OPEN", createdAt: at(-2, 14, 30) },
  { id: "s-3", factoryId: "f-2", machineId: "m-3", fromDate: d(-10), toDate: d(50), maxCapacity: 80, capacityUnit: "TON_PER_MONTH", note: "Nhận gia công chè đen OTD", status: "OPEN", createdAt: at(-11, 10, 5) },
  { id: "s-4", factoryId: "f-4", machineId: "m-6", fromDate: d(0), toDate: d(75), maxCapacity: 200, capacityUnit: "TON_PER_MONTH", note: "Chè búp tươi Trung du, LDP1", status: "OPEN", createdAt: at(-1, 16, 45) },
  { id: "s-5", factoryId: "f-4", machineId: "m-7", fromDate: d(-20), toDate: d(100), maxCapacity: 300, capacityUnit: "TON_PER_MONTH", note: "Cho thuê kho chè thành phẩm", status: "OPEN", createdAt: at(-21, 9, 0) },
  { id: "s-6", factoryId: "f-5", machineId: "m-8", fromDate: d(2), toDate: d(45), maxCapacity: 10, capacityUnit: "TON_PER_MONTH", note: "Sấy atiso, đương quy", status: "OPEN", createdAt: at(-3, 7, 20) },
  { id: "s-7", factoryId: "f-6", machineId: "m-10", fromDate: d(-15), toDate: d(30), maxCapacity: 800, capacityUnit: "TON_PER_MONTH", note: "Thu mua, cạo quế vỏ tươi", status: "OPEN", createdAt: at(-16, 8, 0) },
  { id: "s-8", factoryId: "f-6", machineId: "m-11", fromDate: d(5), toDate: d(90), maxCapacity: 5, capacityUnit: "TON_PER_MONTH", note: "Chưng cất tinh dầu quế, hồi", status: "OPEN", createdAt: at(-1, 10, 10) },
  { id: "s-9", factoryId: "f-7", machineId: "m-12", fromDate: d(-3), toDate: d(55), maxCapacity: 20, capacityUnit: "TON_PER_MONTH", note: "Nhận chè ô long búp Kim Tuyên", status: "OPEN", createdAt: at(-4, 15, 0) },
  { id: "s-10", factoryId: "f-8", machineId: "m-14", fromDate: d(1), toDate: d(40), maxCapacity: 15, capacityUnit: "TON_PER_MONTH", note: "", status: "OPEN", createdAt: at(0, 8, 30) },
  { id: "s-11", factoryId: "f-9", machineId: "m-15", fromDate: d(-7), toDate: d(80), maxCapacity: 1000, capacityUnit: "TON_PER_MONTH", note: "Dứa Queen chính vụ, nhận ép cô đặc", status: "OPEN", createdAt: at(-8, 9, 45) },
  { id: "s-12", factoryId: "f-9", machineId: "m-16", fromDate: d(0), toDate: d(120), maxCapacity: 400, capacityUnit: "TON_PER_MONTH", note: "Cấp đông IQF rau quả", status: "OPEN", createdAt: at(-1, 11, 0) },
  { id: "s-13", factoryId: "f-10", machineId: "m-18", fromDate: d(-12), toDate: d(45), maxCapacity: 500, capacityUnit: "TON_PER_MONTH", note: "Chanh leo tím, nhận puree", status: "OPEN", createdAt: at(-13, 14, 0) },
  { id: "s-14", factoryId: "f-10", machineId: "m-19", fromDate: d(0), toDate: d(180), maxCapacity: 1200, capacityUnit: "TON_PER_MONTH", note: "Cho thuê kho âm sâu", status: "OPEN", createdAt: at(-2, 9, 30) },
  { id: "s-15", factoryId: "f-11", machineId: "m-21", fromDate: d(10), toDate: d(120), maxCapacity: 1500, capacityUnit: "TON_PER_MONTH", note: "Vụ cà phê 2026–2027", status: "OPEN", createdAt: at(-1, 8, 0) },
  { id: "s-16", factoryId: "f-12", machineId: "m-23", fromDate: d(-5), toDate: d(60), maxCapacity: 2000, capacityUnit: "TON_PER_MONTH", note: "Phân loại màu cà phê nhân", status: "OPEN", createdAt: at(-6, 13, 15) },
  { id: "s-17", factoryId: "f-15", machineId: "m-27", fromDate: d(-2), toDate: d(70), maxCapacity: 100, capacityUnit: "TON_PER_MONTH", note: "Lên men dâu tằm, sim", status: "OPEN", createdAt: at(-3, 10, 0) },
  { id: "s-18", factoryId: "f-16", machineId: "m-29", fromDate: d(-4), toDate: d(35), maxCapacity: 60, capacityUnit: "TON_PER_MONTH", note: "Sơ chế rau ăn lá cho siêu thị", status: "OPEN", createdAt: at(-5, 6, 45) },
  { id: "s-19", factoryId: "f-16", machineId: "m-30", fromDate: d(0), toDate: d(90), maxCapacity: 100, capacityUnit: "TON_PER_MONTH", note: "Kho mát rau, dâu tây", status: "OPEN", createdAt: at(0, 9, 0) },
  { id: "s-20", factoryId: "f-17", machineId: "m-31", fromDate: d(-8), toDate: d(40), maxCapacity: 12, capacityUnit: "TON_PER_MONTH", note: "Sấy lạnh hồng, khoai lang", status: "OPEN", createdAt: at(-9, 16, 20) },
  { id: "s-21", factoryId: "f-17", machineId: "m-32", fromDate: d(3), toDate: d(60), maxCapacity: 2000, capacityUnit: "KG_PER_MONTH", note: "Sấy thăng hoa dâu tây, xoài", status: "OPEN", createdAt: at(-1, 8, 40) },
  { id: "s-22", factoryId: "f-18", machineId: "m-33", fromDate: d(-6), toDate: d(90), maxCapacity: 600, capacityUnit: "TON_PER_MONTH", note: "Cấp đông xoài, khóm, bắp non", status: "OPEN", createdAt: at(-7, 10, 30) },
  { id: "s-23", factoryId: "f-19", machineId: "m-35", fromDate: d(-1), toDate: d(50), maxCapacity: 8000, capacityUnit: "TON_PER_MONTH", note: "Sấy lúa vụ Thu Đông", status: "OPEN", createdAt: at(-2, 7, 0) },
  { id: "s-24", factoryId: "f-20", machineId: "m-37", fromDate: d(-9), toDate: d(65), maxCapacity: 4000, capacityUnit: "TON_PER_MONTH", note: "Xát trắng gạo ST25, Jasmine", status: "OPEN", createdAt: at(-10, 14, 20) },
  // History: expired or closed
  { id: "s-25", factoryId: "f-1", machineId: "m-1", fromDate: d(-120), toDate: d(-70), maxCapacity: 25, capacityUnit: "TON_PER_MONTH", note: "Vụ chè xuân", status: "CLOSED", closedReason: "CONNECTED", closedAt: at(-80), createdAt: at(-125) },
  { id: "s-26", factoryId: "f-7", machineId: "m-13", fromDate: d(-90), toDate: d(-30), maxCapacity: 60, capacityUnit: "TON_PER_MONTH", note: "", status: "OPEN", createdAt: at(-92) },
  { id: "s-27", factoryId: "f-9", machineId: "m-15", fromDate: d(-150), toDate: d(-60), maxCapacity: 1200, capacityUnit: "TON_PER_MONTH", note: "Dứa vụ xuân", status: "CLOSED", closedReason: "CONNECTED", closedAt: at(-70), createdAt: at(-152) },
  { id: "s-28", factoryId: "f-19", machineId: "m-36", fromDate: d(-100), toDate: d(-40), maxCapacity: 6000, capacityUnit: "TON_PER_MONTH", note: "", status: "CLOSED", closedReason: "MANUAL", closedAt: at(-45), createdAt: at(-101) },
  { id: "s-29", factoryId: "f-3", machineId: "m-5", fromDate: d(-60), toDate: d(-10), maxCapacity: 30, capacityUnit: "TON_PER_MONTH", note: "Sấy chè vụ hè", status: "OPEN", createdAt: at(-61) },
];

export const scheduleStore = {
  all: () => db,
  set: (next: ProcessingSchedule[]) => {
    db = next;
  },
};

export const today = () => dayjs().format("YYYY-MM-DD");

/** Open and not yet past its end date */
export const isActiveSchedule = (s: ProcessingSchedule, on = today()) => s.status === "OPEN" && s.toDate >= on;

/** The machine's current (or next upcoming) open schedule */
export const activeScheduleFor = (machineId: string) =>
  db
    .filter((s) => s.machineId === machineId && isActiveSchedule(s))
    .sort((a, b) => a.fromDate.localeCompare(b.fromDate))[0];
