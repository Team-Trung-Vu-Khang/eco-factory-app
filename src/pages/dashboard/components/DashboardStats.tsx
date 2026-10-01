import { Eye, Gauge, Handshake, Inbox, Calendar } from "lucide-react";
import { StatCard } from "@/features/dashboard";
import type { AdminFactoryDashboardSummaryResponse } from "@/features/dashboard";
import type { ProcessingScheduleItem } from "@/features/processing-schedule";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import dayjs from "dayjs";

const GRID = "grid gap-2 sm:gap-4! [&>*]:min-w-0";

interface DashboardStatsProps {
  summary?: AdminFactoryDashboardSummaryResponse;
  latestSchedule?: ProcessingScheduleItem | null;
}

export function DashboardStats({
  summary,
  latestSchedule,
}: DashboardStatsProps) {
  return (
    <div className="space-y-5 sm:space-y-6!">
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">Tổng quan</h2>
        <div className={`${GRID} grid-cols-1 sm:grid-cols-3!`}>
          <StatCard
            icon={Eye}
            label="Tổng lượt xem thông tin"
            value={summary?.totalProfileViews?.toLocaleString("vi-VN") ?? 0}
            hint="mỗi đơn vị tối đa 1 lần/ngày"
          />
          <StatCard
            icon={Inbox}
            label="Tổng lượt nhận yêu cầu kết nối"
            value={
              summary?.totalConnectionRequests?.toLocaleString("vi-VN") ?? 0
            }
            hint="mỗi đơn vị tối đa 1 yêu cầu/bài đăng"
          />
          <StatCard
            icon={Handshake}
            label="Tổng lượt kết nối thành công"
            value={
              summary?.totalAcceptedConnectionRequests?.toLocaleString(
                "vi-VN",
              ) ?? 0
            }
            hint="mỗi đơn vị tối đa 1 thành công/bài đăng"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900">
          Lịch nhận chế biến mới nhất
          {latestSchedule && (
            <span className="ml-2 font-normal text-slate-500">
              · {latestSchedule.title}
            </span>
          )}
        </h2>
        {latestSchedule ? (
          <div
            className={`${GRID} grid-cols-1 sm:grid-cols-2! xl:grid-cols-4!`}
          >
            <StatCard
              icon={Gauge}
              label="Công suất nhận chế biến"
              value={`${latestSchedule.maxCapacity?.toLocaleString("vi-VN")} ${
                CAPACITY_UNIT_LABELS[latestSchedule.capacityUnit] ||
                latestSchedule.capacityUnit ||
                ""
              }`}
            />
            <StatCard
              icon={Eye}
              label="Lượt xem thông tin"
              value={latestSchedule.totalViews?.toLocaleString("vi-VN") ?? 0}
            />
            <StatCard
              icon={Inbox}
              label="Yêu cầu kết nối"
              value={
                latestSchedule.connectionRequestCount?.toLocaleString(
                  "vi-VN",
                ) ?? 0
              }
            />
            <StatCard
              icon={Calendar}
              label="Thời gian áp dụng"
              value={`${dayjs(latestSchedule.startDate).format("DD/MM/YYYY")} - ${dayjs(
                latestSchedule.endDate,
              ).format("DD/MM/YYYY")}`}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Chưa có lịch nhận chế biến nào.
          </p>
        )}
      </section>
    </div>
  );
}
