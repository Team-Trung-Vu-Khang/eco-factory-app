import { ThumbnailLabel } from "@/components/common/Thumbnail";
import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import type { ScheduleRow } from "@/features/processing-schedule";
import { ScheduleConnectionsButton } from "./ScheduleConnectionsButton";
import { ScheduleStatusBadge } from "./ScheduleStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "—");

export const scheduleColumns: Column<ScheduleRow>[] = [
  {
    key: "title",
    label: "Tiêu đề tin",
    render: (_, s) => (
      <div className="min-w-48">
        <p className="font-medium text-slate-900">{s.title}</p>
      </div>
    ),
  },
  {
    key: "machine",
    label: "Máy / dây chuyền",
    render: (_, s) => (
      <div className="min-w-44">
        <ThumbnailLabel src={s.machine?.imageUrl} label={s.machine?.name ?? "—"}>
          <p className="font-medium text-slate-900">{s.machine?.name ?? "—"}</p>
          {s.profile?.name && (
            <p className="text-xs text-slate-500">{s.profile.name}</p>
          )}
        </ThumbnailLabel>
      </div>
    ),
  },
  {
    key: "scheduleDate",
    label: "Lịch nhận",
    render: (_, s) => (
      <span className="whitespace-nowrap text-sm tabular-nums">
        {date(s.startDate)} → {date(s.endDate)}
      </span>
    ),
  },
  {
    key: "maxCapacity",
    label: "Công suất tối đa",
    render: (_, s) => (
      <span className="whitespace-nowrap text-sm tabular-nums">
        {fmt.format(s.maxCapacity)}{" "}
        {CAPACITY_UNIT_LABELS[s.capacityUnit] ?? s.capacityUnit}
      </span>
    ),
  },
  {
    key: "note",
    label: "Ghi chú",
    render: (_, s) => (
      <span className="text-sm text-slate-600 line-clamp-2">
        {s.note || "—"}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Ngày đăng",
    render: (_, s) => (
      <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">
        {dayjs(s.createdAt).format("DD/MM/YYYY HH:mm")}
      </span>
    ),
  },
  {
    key: "connections",
    label: "Yêu cầu kết nối",
    render: (_, s) => <ScheduleConnectionsButton schedule={s} />,
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, s) => (
      <div className="space-y-0.5">
        <ScheduleStatusBadge status={s.status} />
      </div>
    ),
  },
];
