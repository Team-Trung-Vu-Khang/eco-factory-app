import { Eye, Gauge, Handshake, Inbox } from "lucide-react";
import { StatCard, type DashboardStats as Stats } from "@/features/dashboard";

const GRID = "grid gap-2 sm:gap-4! [&>*]:min-w-0";

export function DashboardStats({ stats }: { stats: Stats }) {
  const { overview, latestPost } = stats;

  return (
    <div className="space-y-5 sm:space-y-6!">
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Tổng quan</h2>
        <div className={`${GRID} grid-cols-3`}>
          <StatCard
            icon={Eye}
            label="Tổng lượt xem thông tin"
            value={overview.totalViews}
            hint="mỗi đơn vị tối đa 1 lần/ngày"
          />
          <StatCard
            icon={Inbox}
            label="Tổng lượt nhận yêu cầu kết nối"
            value={overview.totalConnectionRequests}
            hint="mỗi đơn vị tối đa 1 yêu cầu/bài đăng"
          />
          <StatCard
            icon={Handshake}
            label="Tổng lượt kết nối thành công"
            value={overview.totalSuccessfulConnections}
            hint="mỗi đơn vị tối đa 1 thành công/bài đăng"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">
          Bài đăng mới nhất
          {latestPost && (
            <span className="ml-2 font-normal text-slate-500">
              · {latestPost.title}
            </span>
          )}
        </h2>
        {latestPost ? (
          <div className={`${GRID} grid-cols-2 xl:grid-cols-4!`}>
            <StatCard
              icon={Gauge}
              label="Công suất khả dụng"
              value={`${latestPost.availableCapacity} ${latestPost.capacityUnit}`}
            />
            <StatCard icon={Eye} label="Xem thông tin" value={latestPost.views} />
            <StatCard
              icon={Inbox}
              label="Nhận yêu cầu kết nối"
              value={latestPost.connectionRequests}
            />
            <StatCard
              icon={Handshake}
              label="Kết nối thành công"
              value={latestPost.successfulConnections}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500">Chưa có bài đăng nào.</p>
        )}
      </section>
    </div>
  );
}
