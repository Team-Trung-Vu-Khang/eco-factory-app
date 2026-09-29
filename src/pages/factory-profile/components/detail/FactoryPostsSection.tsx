import {
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  CAPACITY_UNIT_LABELS,
  PROCESSING_SERVICE_LABELS,
  PRODUCT_GROUP_LABELS,
  type Factory,
} from "@/features/factory";
import { useSchedules, type ScheduleRow } from "@/features/processing-schedule";
import { scheduleColumns } from "@/pages/processing-schedule/components/schedule-columns";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d: string) => dayjs(d).format("DD/MM/YYYY");

/** "Tin đăng" tab — the factory's open processing posts, searchable */
export function FactoryPostsSection({ factory }: { factory: Factory }) {
  const [keyword, setKeyword] = useState("");
  const [viewing, setViewing] = useState<ScheduleRow | null>(null);
  const query = useSchedules({ page: 0, size: 100, keyword, status: "ACTIVE", factoryId: factory.id });

  // Farmer view: request counts and status are the factory's business — every row here is open
  const columns: Column<ScheduleRow>[] = [
    ...scheduleColumns.filter((c) => c.key !== "connections" && c.key !== "displayStatus"),
    {
      key: "actions",
      label: "",
      render: (_, s) => (
        <Button variant="outline" size="sm" className="h-7" onClick={() => setViewing(s)}>
          <Eye className="mr-1 h-3.5 w-3.5" />
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={query.data?.content ?? []}
        loading={query.isFetching}
        searchable
        searchPlaceholder="Tìm theo máy, ghi chú..."
        onSearch={setKeyword}
        columnToggleable={false}
        downloadable={false}
      />
      <PostDetailDialog factory={factory} post={viewing} onClose={() => setViewing(null)} />
    </>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[9rem_1fr] gap-3 py-2 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="min-w-0 text-slate-800">{children || "—"}</dd>
    </div>
  );
}

function PostDetailDialog({ factory, post, onClose }: { factory: Factory; post: ScheduleRow | null; onClose: () => void }) {
  if (!post) return null;
  const machine = factory.machines.find((m) => m.id === post.machineId);
  const chips = (items: string[]) =>
    items.length ? (
      <div className="flex flex-wrap gap-1">
        {items.map((label) => (
          <Badge key={label} variant="secondary" className="font-normal">
            {label}
          </Badge>
        ))}
      </div>
    ) : null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{post.note || `Nhận chế biến — ${post.machineName}`}</DialogTitle>
          <DialogDescription>{factory.name}</DialogDescription>
        </DialogHeader>
        <dl className="divide-y divide-slate-100">
          <Row label="Máy / dây chuyền">{post.machineName}</Row>
          <Row label="Dịch vụ">{chips((machine?.functions ?? []).map((f) => PROCESSING_SERVICE_LABELS[f] ?? f))}</Row>
          <Row label="Nhóm nông sản">{chips((machine?.productGroupIds ?? []).map((g) => PRODUCT_GROUP_LABELS[g] ?? g))}</Row>
          <Row label="Lịch nhận">
            <span className="tabular-nums">
              {date(post.fromDate)} → {date(post.toDate)}
            </span>
          </Row>
          <Row label="Công suất tối đa nhận">
            <span className="tabular-nums">
              {fmt.format(post.maxCapacity)} {CAPACITY_UNIT_LABELS[post.capacityUnit]}
            </span>
          </Row>
          <Row label="Ghi chú">{post.note}</Row>
          <Row label="Ngày đăng">{dayjs(post.createdAt).format("DD/MM/YYYY HH:mm")}</Row>
          <Row label="Liên hệ">
            {factory.representative.fullName} · {factory.representative.phone}
          </Row>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
