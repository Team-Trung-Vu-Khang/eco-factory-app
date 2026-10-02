import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { DataTable, type Column } from "@/components/common/DataTable";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useState, type ReactNode } from "react";
import { type FactoryProfile } from "@/features/factory";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import {
  useAdminSchedules,
  useSchedules,
  type ScheduleRow,
} from "@/features/processing-schedule";
import { useIsFactoryAdmin } from "@/features/viewer";
import { scheduleColumns } from "@/pages/processing-schedule/components/schedule-columns";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "—");

/** "Tin đăng" tab — the factory's open processing posts, searchable */
export function FactoryPostsSection({ factory }: { factory: FactoryProfile }) {
  const [keyword, setKeyword] = useState("");
  const [viewing, setViewing] = useState<ScheduleRow | null>(null);
  const isAdmin = useIsFactoryAdmin();
  const profileId = factory?.id ? Number(factory.id) : undefined;

  const adminQuery = useAdminSchedules(
    {
      page: 0,
      size: 100,
      keyword: keyword.trim() || undefined,
      profileId,
      status: "OPEN",
    },
    { enabled: isAdmin && !!profileId },
  );

  const memberQuery = useSchedules(
    {
      page: 0,
      size: 100,
      keyword: keyword.trim() || undefined,
      profileId,
      status: "OPEN",
    },
    { enabled: !isAdmin },
  );

  const query = isAdmin ? adminQuery : memberQuery;

  // Farmer / public view: request counts and internal status are not relevant
  const columns: Column<ScheduleRow>[] = [
    ...scheduleColumns.filter(
      (c) => c.key !== "connections" && c.key !== "displayStatus",
    ),
    {
      key: "actions",
      label: "",
      render: (_, s) => (
        <Button
          variant="outline"
          size="sm"
          className="h-7"
          onClick={() => setViewing(s)}
        >
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
        searchPlaceholder="Tìm theo tiêu đề, máy, ghi chú..."
        onSearch={setKeyword}
        columnToggleable={false}
        downloadable={false}
      />
      <PostDetailDialog
        factory={factory}
        post={viewing}
        onClose={() => setViewing(null)}
      />
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

function PostDetailDialog({
  factory,
  post,
  onClose,
}: {
  factory: FactoryProfile;
  post: ScheduleRow | null;
  onClose: () => void;
}) {
  if (!post) return null;

  const repText = factory.representativeName
    ? `${factory.representativeName}${factory.representativePhone ? ` · ${factory.representativePhone}` : ""}`
    : "—";

  const services = post.machine?.processingServices?.map((s) => s.name) ?? [];
  const productGroups = post.machine?.productGroups?.map((g) => g.name) ?? [];

  const chips = (items: string[]) =>
    items.length ? (
      <div className="flex flex-wrap gap-1">
        {items.map((label) => (
          <Badge key={label} variant="secondary" className="font-normal">
            {label}
          </Badge>
        ))}
      </div>
    ) : (
      <span className="text-slate-400">—</span>
    );

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {post.title || `Nhận chế biến — ${post.machine?.name || "Máy móc"}`}
          </DialogTitle>
          <DialogDescription>{factory.name}</DialogDescription>
        </DialogHeader>
        <dl className="divide-y divide-slate-100">
          <Row label="Máy / dây chuyền">{post.machine?.name || "—"}</Row>
          <Row label="Dịch vụ">{chips(services)}</Row>
          <Row label="Nhóm nông sản">{chips(productGroups)}</Row>
          <Row label="Lịch nhận">
            <span className="tabular-nums">
              {date(post.startDate)} → {date(post.endDate)}
            </span>
          </Row>
          <Row label="Công suất tối đa nhận">
            <span className="tabular-nums">
              {fmt.format(post.maxCapacity)}{" "}
              {CAPACITY_UNIT_LABELS[post.capacityUnit] ?? post.capacityUnit}
            </span>
          </Row>
          <Row label="Ghi chú">{post.note || "—"}</Row>
          <Row label="Ngày đăng">
            {dayjs(post.createdAt).format("DD/MM/YYYY HH:mm")}
          </Row>
          <Row label="Liên hệ">
            {repText === "·" || !repText ? "—" : repText}
          </Row>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
