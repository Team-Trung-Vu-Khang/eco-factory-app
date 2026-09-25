import { StatsCard } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ClipboardList, Handshake, Search, UserRound } from "lucide-react";
import { FEMALE_REACH_TARGET, useDemandSummary } from "@/features/demand";

export function DemandStats() {
  const { data } = useDemandSummary();
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard title="Tổng nhu cầu" value={data?.total ?? "—"} icon={ClipboardList} />
      <StatsCard title="Đang xử lý" value={data?.open ?? "—"} icon={Search} />
      <StatsCard title="Có cơ sở phản hồi" value={data?.connected ?? "—"} icon={Handshake} />
      <StatsCard
        title="Nữ chủ DN tiếp cận cơ sở"
        value={data ? `${data.femaleReached} / ${FEMALE_REACH_TARGET}` : "—"}
        change="chỉ số dự án"
        changeType="neutral"
        icon={UserRound}
      />
    </div>
  );
}
