import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { CAPACITY_UNIT_LABELS } from "@/features/factory";
import { SCHEDULE_STATUS_OPTIONS, type ScheduleRow } from "@/features/processing-schedule";
import { ScheduleStatusBadge } from "./ScheduleStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "");

export const scheduleColumns: Column<ScheduleRow>[] = [
  {
    key: "machineName",
    label: "Máy / dây chuyền",
    render: (_, s) => (
      <div className="min-w-44">
        <p className="font-medium text-slate-900">{s.machineName}</p>
        <p className="text-xs text-slate-500">{s.factoryName}</p>
      </div>
    ),
  },
  {
    key: "fromDate",
    label: "Lịch nhận",
    render: (_, s) => (
      <span className="whitespace-nowrap text-sm tabular-nums">
        {date(s.fromDate)} → {date(s.toDate)}
      </span>
    ),
  },
  {
    key: "maxCapacity",
    label: "Công suất tối đa",
    render: (_, s) => (
      <span className="whitespace-nowrap text-sm tabular-nums">
        {fmt.format(s.maxCapacity)} {CAPACITY_UNIT_LABELS[s.capacityUnit]}
      </span>
    ),
  },
  { key: "note", label: "Ghi chú", render: (_, s) => <span className="text-sm text-slate-600">{s.note || "—"}</span> },
  {
    key: "createdAt",
    label: "Ngày đăng",
    render: (_, s) => <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">{dayjs(s.createdAt).format("DD/MM/YYYY HH:mm")}</span>,
  },
  {
    key: "displayStatus",
    label: "Trạng thái",
    render: (_, s) => (
      <div className="space-y-0.5">
        <ScheduleStatusBadge status={s.displayStatus} />
        {s.closedReason === "CONNECTED" && <p className="text-xs text-slate-500">Đã kết nối thành công</p>}
      </div>
    ),
  },
];

export const scheduleFilters = [{ key: "status", label: "Trạng thái", options: SCHEDULE_STATUS_OPTIONS }];
