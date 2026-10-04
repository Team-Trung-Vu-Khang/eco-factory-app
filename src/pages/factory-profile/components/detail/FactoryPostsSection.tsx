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
  type ScheduleRow,
} from "@/features/processing-schedule";
import {
  useFactorySearch,
  type MarketplaceScheduleItem,
} from "@/features/connection";
import { ConnectionStatusBadge } from "@/pages/connection/components/ConnectionStatusBadge";
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

  // Người tìm/gửi (không phải admin): đọc qua marketplace, không gửi X-Workspace-Id
  const memberQuery = useFactorySearch(
    !isAdmin && profileId
      ? {
          profileId,
          keyword: keyword.trim() || undefined,
          page: 0,
          size: 100,
        }
      : undefined,
  );

  // Tin marketplace có cùng các trường mà bảng/dialog dùng (title, machine, lịch, công suất, note)
  const rows = (
    isAdmin ? adminQuery.data?.content : memberQuery.data?.content
  ) as ScheduleRow[] | undefined;
  const loading = isAdmin ? adminQuery.isFetching : memberQuery.isFetching;

  // Farmer / public view: request counts and internal status are not relevant
  const columns: Column<ScheduleRow>[] = [
    // Chỉ tải tin OPEN nên cột trạng thái tin không có ý nghĩa ở đây
    ...scheduleColumns.filter(
      (c) => c.key !== "connections" && c.key !== "status",
    ),
    ...(!isAdmin
      ? [
          {
            key: "myConnection",
            label: "Kết nối của bạn",
            render: (_: unknown, s: ScheduleRow) => (
              <MyConnectionStatus schedule={s} />
            ),
          },
        ]
      : []),
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
        data={rows ?? []}
        loading={loading}
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
          {hasMyConnectionField(post) && (
            <Row label="Kết nối của bạn">
              <MyConnectionStatus schedule={post} />
            </Row>
          )}
          <Row label="Liên hệ">
            {repText === "·" || !repText ? "—" : repText}
          </Row>
        </dl>
      </DialogContent>
    </Dialog>
  );
}

type WithMyConnection = ScheduleRow & {
  myConnectionRequest?: MarketplaceScheduleItem["myConnectionRequest"];
};

/** Tin lấy từ admin API không có myConnectionRequest → không hiển thị dòng này */
const hasMyConnectionField = (post: ScheduleRow) =>
  "myConnectionRequest" in post;

/** Trạng thái yêu cầu kết nối của người đang xem với tin này (marketplace) */
function MyConnectionStatus({ schedule }: { schedule: ScheduleRow }) {
  const req = (schedule as WithMyConnection).myConnectionRequest;
  if (!req || req.status === "CANCELLED") {
    return <span className="text-sm text-slate-400">Chưa gửi yêu cầu</span>;
  }
  return <ConnectionStatusBadge status={req.status} />;
}
