import dayjs from "dayjs";
import type { ProcessingSchedule } from "../types";

// ─── Shared in-memory store ─────────────────────────────────────────────────
// Kept free of factory imports so factory.api can derive machine availability
// from it without a circular dependency. TODO: gone once the BE owns this.

const d = (offsetDays: number) => dayjs().add(offsetDays, "day").format("YYYY-MM-DD");
const at = (offsetDays: number, hour = 9, minute = 0) => dayjs().add(offsetDays, "day").hour(hour).minute(minute).second(0).toISOString();

let db: ProcessingSchedule[] = [
  { id: "s-1", factoryId: "f-1", machineId: "m-1", fromDate: d(-5), toDate: d(40), maxCapacity: 300, capacityUnit: "KG_PER_DAY", note: "Nhận sấy chè búp tươi", status: "OPEN", createdAt: at(-6, 8, 15) },
  { id: "s-2", factoryId: "f-4", machineId: "m-3", fromDate: d(3), toDate: d(90), maxCapacity: 1, capacityUnit: "TON_PER_DAY", note: "", status: "OPEN", createdAt: at(-2, 14, 30) },
  { id: "s-3", factoryId: "f-4", machineId: "m-4", fromDate: d(-10), toDate: d(20), maxCapacity: 200, capacityUnit: "KG_PER_HOUR", note: "", status: "OPEN", createdAt: at(-11, 10, 5) },
  { id: "s-4", factoryId: "f-5", machineId: "m-5", fromDate: d(0), toDate: d(60), maxCapacity: 8, capacityUnit: "TON_PER_DAY", note: "Kho lạnh trái cây, rau củ", status: "OPEN", createdAt: at(-1, 16, 45) },
  { id: "s-5", factoryId: "f-6", machineId: "m-6", fromDate: d(-60), toDate: d(-15), maxCapacity: 150, capacityUnit: "KG_PER_DAY", note: "", status: "OPEN", createdAt: at(-61) },
  { id: "s-7", factoryId: "f-6", machineId: "m-6", fromDate: d(2), toDate: d(45), maxCapacity: 4, capacityUnit: "TON_PER_MONTH", note: "Sấy lạnh chè, dược liệu", status: "OPEN", createdAt: at(-3, 7, 20) },
  { id: "s-6", factoryId: "f-1", machineId: "m-1", fromDate: d(-120), toDate: d(-70), maxCapacity: 400, capacityUnit: "KG_PER_DAY", note: "Vụ chè xuân", status: "CLOSED", closedReason: "CONNECTED", closedAt: at(-80), createdAt: at(-125) },
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
