import { factoryApi, type PageResponse } from "@/features/factory";
import type { ScheduleStatus } from "../constants";
import type { ScheduleFormValues } from "../schema";
import type { ProcessingSchedule, ScheduleListParams, ScheduleRow } from "../types";
import { isActiveSchedule, scheduleStore, today } from "./schedule.store";

export const scheduleKeys = {
  all: ["processing-schedules"] as const,
  list: (params: ScheduleListParams) => [...scheduleKeys.all, "list", params] as const,
};

// ─── In-memory mock ─────────────────────────────────────────────────────────
// TODO: replace with apiClient calls, e.g. apiClient.post("/api/factory/processing-schedules", values)

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const displayStatus = (s: ProcessingSchedule, on = today()): ScheduleStatus =>
  isActiveSchedule(s, on) ? "ACTIVE" : "EXPIRED";

async function machineIndex() {
  const { content } = await factoryApi.listMachines({ page: 0, size: 1000 });
  return new Map(content.map((m) => [m.id, m]));
}

async function toRows(items: ProcessingSchedule[]): Promise<ScheduleRow[]> {
  const machines = await machineIndex();
  return items.map((s) => ({
    ...s,
    displayStatus: displayStatus(s),
    factoryName: machines.get(s.machineId)?.factoryName ?? "—",
    machineName: machines.get(s.machineId)?.name ?? "—",
  }));
}

const overlaps = (a: { fromDate: string; toDate: string }, b: { fromDate: string; toDate: string }) =>
  a.fromDate <= b.toDate && b.fromDate <= a.toDate;

export const scheduleApi = {
  async list(params: ScheduleListParams): Promise<PageResponse<ScheduleRow>> {
    await delay();
    const keyword = params.keyword?.trim().toLowerCase();
    const rows = (await toRows(scheduleStore.all()))
      .filter(
        (s) =>
          (!params.status || s.displayStatus === params.status) &&
          (!params.factoryId || s.factoryId === params.factoryId) &&
          (!keyword || [s.machineName, s.factoryName].some((v) => v.toLowerCase().includes(keyword))),
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

  /** Posts a processing window for each selected machine — all-or-nothing */
  async create({ machineIds, ...values }: ScheduleFormValues): Promise<ProcessingSchedule[]> {
    await delay();
    const machines = await machineIndex();
    for (const machineId of machineIds) {
      const machine = machines.get(machineId);
      if (!machine) throw new Error("Không tìm thấy máy / dây chuyền.");
      if (machine.status !== "ACTIVE") throw new Error(`"${machine.name}" đang không hoạt động, không thể đăng lịch.`);
      // Only comparable when both use the same unit
      if (values.capacityUnit === machine.capacityUnit && values.maxCapacity > machine.maxCapacity) {
        throw new Error(`Công suất nhận vượt công suất tối đa của "${machine.name}".`);
      }
      const clash = scheduleStore
        .all()
        .find((s) => s.machineId === machineId && s.status === "OPEN" && s.toDate >= today() && overlaps(s, values));
      if (clash) throw new Error(`"${machine.name}" đã có lịch đang mở trùng khoảng thời gian này.`);
    }

    const createdAt = new Date().toISOString();
    const created: ProcessingSchedule[] = machineIds.map((machineId) => ({
      ...values,
      machineId,
      capacityUnit: values.capacityUnit as ProcessingSchedule["capacityUnit"],
      status: "OPEN",
      id: crypto.randomUUID(),
      createdAt,
    }));
    scheduleStore.set([...created, ...scheduleStore.all()]);
    return created;
  },

  async close(id: string, reason: "MANUAL" | "CONNECTED" = "MANUAL"): Promise<void> {
    await delay(200);
    scheduleStore.set(
      scheduleStore
        .all()
        .map((s) => (s.id === id && s.status === "OPEN" ? { ...s, status: "CLOSED", closedReason: reason, closedAt: new Date().toISOString() } : s)),
    );
  },
};
