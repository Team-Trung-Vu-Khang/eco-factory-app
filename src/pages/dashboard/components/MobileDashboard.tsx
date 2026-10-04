import dayjs from "dayjs";
import {
  Award,
  Building2,
  CalendarRange,
  ChevronRight,
  Eye,
  Gauge,
  Handshake,
  History,
  Inbox,
  RefreshCw,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  DemandTrendChart,
  GroupConnectionChart,
  RecentDemandsCard,
  useAdminProcessingServiceChart,
  useAdminProductGroupChart,
  type AdminFactoryDashboardSummaryResponse,
} from "@/features/dashboard";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import type { ProcessingScheduleItem } from "@/features/processing-schedule";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { LeafWatermark } from "@/pages/connection/components/landing-art";
import { TileImage, WizardHeader } from "@/pages/connection/mobile/wizard-ui";

const n = (v?: number) => (v ?? 0).toLocaleString("vi-VN");

/** Existing desktop chart cards, restyled to the mobile card look */
const CHART_WRAP =
  "fsl-card-in [&>*]:rounded-3xl [&>*]:border-0 [&>*]:shadow-[0_2px_12px_rgba(20,83,45,0.06)] [&>*]:ring-1 [&>*]:ring-emerald-900/5";

function Kpi({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15">
      <span className="text-white/70">{icon}</span>
      <p className="mt-1 text-xl font-extrabold tabular-nums leading-tight">
        {value}
      </p>
      <p className="line-clamp-2 text-[11px] leading-snug text-white/75">
        {label}
      </p>
    </div>
  );
}

function Shortcut({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5 active:scale-[0.98]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d]">
        {icon}
      </span>
      <span className="min-w-0 flex-1 text-[13px] font-semibold leading-tight text-slate-800">
        {label}
      </span>
    </Link>
  );
}

interface Props {
  summary?: AdminFactoryDashboardSummaryResponse;
  latestSchedule?: ProcessingScheduleItem | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

/** Mobile-app admin dashboard (`/factory`) */
export function MobileDashboard({
  summary,
  latestSchedule: s,
  isLoading,
  isError,
  onRetry,
}: Props) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const yearStart = dayjs().startOf("year").format("YYYY-MM-DD");
  const yearEnd = dayjs().endOf("year").format("YYYY-MM-DD");
  const services = useAdminProcessingServiceChart({
    fromDate: yearStart,
    toDate: yearEnd,
    limit: 5,
  });
  const groups = useAdminProductGroupChart({
    fromDate: yearStart,
    toDate: yearEnd,
    limit: 5,
  });

  const requests = summary?.totalConnectionRequests ?? 0;
  const accepted = summary?.totalAcceptedConnectionRequests ?? 0;
  const rate = requests ? Math.round((accepted / requests) * 100) : 0;

  return (
    <div
      ref={fillRef}
      style={{ minHeight: fillHeight }}
      className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))]"
    >
      <WizardHeader />
      <div className="relative -mt-14 space-y-4">
        <div>
          <h1 className="text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
            Tổng quan
          </h1>
          <p className="text-sm text-slate-600">
            Công suất, nhu cầu và kết nối trên MEVI Factories
          </p>
        </div>

        {isError ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-8 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            Không tải được số liệu tổng quan.
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-full bg-[#14532d] px-4 py-2 text-sm font-semibold text-white"
            >
              <RefreshCw className="h-4 w-4" /> Thử lại
            </button>
          </div>
        ) : isLoading ? (
          <div className="h-48 animate-pulse rounded-3xl bg-emerald-900/10" />
        ) : (
          <section className="fsl-card-in relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#14532d] to-[#1f7a45] p-4 text-white shadow-lg shadow-emerald-900/25">
            <LeafWatermark className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rotate-12 text-white/10" />
            <div className="relative flex items-end justify-between gap-3">
              <div>
                <p className="text-xs text-white/75">
                  Tỷ lệ kết nối thành công
                </p>
                <p className="text-4xl font-extrabold tabular-nums leading-none">
                  {rate}%
                </p>
              </div>
              <p className="text-right text-[11px] text-white/70">
                {n(accepted)}/{n(requests)} yêu cầu
              </p>
            </div>
            <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-lime-300"
                style={{ width: `${rate}%` }}
              />
            </div>
            <div className="relative mt-4 grid grid-cols-3 gap-2">
              <Kpi
                icon={<Eye className="h-4 w-4" />}
                label="Lượt xem thông tin"
                value={n(summary?.totalProfileViews)}
              />
              <Kpi
                icon={<Inbox className="h-4 w-4" />}
                label="Yêu cầu kết nối"
                value={n(requests)}
              />
              <Kpi
                icon={<Handshake className="h-4 w-4" />}
                label="Kết nối thành công"
                value={n(accepted)}
              />
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <Shortcut
            href={ROUTES.profile}
            icon={<Building2 className="h-5 w-5" />}
            label="Hồ sơ nhà máy"
          />
          <Shortcut
            href={ROUTES.processingSchedules}
            icon={<CalendarRange className="h-5 w-5" />}
            label="Lịch nhận chế biến"
          />
          <Shortcut
            href={ROUTES.certificates}
            icon={<Award className="h-5 w-5" />}
            label="Chứng nhận"
          />
          <Shortcut
            href={ROUTES.connectionHistory}
            icon={<History className="h-5 w-5" />}
            label="Lịch sử kết nối"
          />
        </div>

        {!isLoading && !isError && (
          <section className="fsl-card-in rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-[15px] font-bold text-slate-900">
                Lịch nhận chế biến mới nhất
              </h2>
              <Link
                href={ROUTES.processingSchedules}
                className="flex items-center text-xs font-semibold text-emerald-700"
              >
                Tất cả <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            {s ? (
              <>
                <div className="flex items-center gap-3">
                  <TileImage
                    src={s.machine?.imageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">
                      {s.title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {[s.profile?.name, s.machine?.name]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                  <div className="rounded-2xl bg-emerald-50/70 px-3 py-2 ring-1 ring-emerald-100">
                    <p className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Gauge className="h-3.5 w-3.5" /> Công suất
                    </p>
                    <p className="font-extrabold text-[#14532d]">
                      {n(s.maxCapacity)}{" "}
                      {CAPACITY_UNIT_LABELS[s.capacityUnit] ?? s.capacityUnit}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/70">
                    <p className="flex items-center gap-1 text-[11px] text-slate-500">
                      <CalendarRange className="h-3.5 w-3.5" /> Thời gian
                    </p>
                    <p className="font-semibold text-slate-800">
                      {dayjs(s.startDate).format("DD/MM")} →{" "}
                      {dayjs(s.endDate).format("DD/MM/YY")}
                    </p>
                  </div>
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <Eye className="h-4 w-4 text-slate-400" /> {n(s.totalViews)}{" "}
                    lượt xem
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-600">
                    <Inbox className="h-4 w-4 text-slate-400" />{" "}
                    {n(s.connectionRequestCount)} yêu cầu
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Chưa có lịch nhận chế biến nào.
              </p>
            )}
          </section>
        )}

        <div className={CHART_WRAP}>
          <DemandTrendChart />
        </div>
        <div className={CHART_WRAP}>
          <RecentDemandsCard />
        </div>
        <div className={CHART_WRAP}>
          <GroupConnectionChart
            title="Theo nhóm dịch vụ chế biến"
            items={services.data?.items}
            isLoading={services.isLoading}
          />
        </div>
        <div className={CHART_WRAP}>
          <GroupConnectionChart
            title="Theo nhóm nông sản"
            items={groups.data?.items}
            isLoading={groups.isLoading}
          />
        </div>
      </div>
    </div>
  );
}
