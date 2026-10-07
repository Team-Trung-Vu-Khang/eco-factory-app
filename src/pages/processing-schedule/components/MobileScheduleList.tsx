import type { ReactNode } from "react";
import dayjs from "dayjs";
import {
  CalendarRange,
  Eye,
  Factory,
  Inbox,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Search,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import {
  SCHEDULE_HISTORY_FILTER_OPTIONS,
  useInfiniteSchedules,
  type ScheduleRow,
} from "@/features/processing-schedule";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { Pill } from "@/pages/connection/mobile/result-ui";
import { TileImage, WizardHeader } from "@/pages/connection/mobile/wizard-ui";
import { ScheduleConnectionsButton } from "./ScheduleConnectionsButton";
import { ScheduleStatusBadge } from "./ScheduleStatusBadge";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : "—");

/** Days until the window ends (negative once past) */
const daysLeft = (end: string) => dayjs(end).endOf("day").diff(dayjs(), "day");

const HISTORY_CHIPS = SCHEDULE_HISTORY_FILTER_OPTIONS.map((o) =>
  o.value ? o : { ...o, label: "Tất cả" },
);

interface Props {
  /** "open" = posts still accepting requests (manage); "history" = every post, filterable */
  variant?: "open" | "history";
  /** Open variant only */
  onCreate?: () => void;
  onEdit?: (s: ScheduleRow) => void;
  /** Factory: close an open post */
  onClose?: (s: ScheduleRow) => void;
  /** Admin: every factory's posts; delete instead of edit/close */
  admin?: boolean;
  onDelete?: (s: ScheduleRow) => void;
  /** Shown under the header, e.g. why posting is locked */
  notice?: ReactNode;
}

/** Mobile-app schedule posts (factory member) as cards — open posts or full history */
export function MobileScheduleList({
  variant = "open",
  onCreate,
  onEdit,
  onClose,
  admin,
  onDelete,
  notice,
}: Props) {
  const history = variant === "history";
  const [status, setStatus] = useState("");
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(keyword.trim()), 400);
    return () => window.clearTimeout(t);
  }, [keyword]);

  const query = useInfiniteSchedules(
    {
      keyword: debounced || undefined,
      status: history ? status || undefined : "OPEN",
    },
    { admin },
  );
  const items = useMemo(
    () => query.data?.pages.flatMap((p) => p.content) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.totalElements ?? 0;

  const topRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setCompact(!e.isIntersecting),
      {
        rootMargin: "-56px 0px 0px 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const endRef = useRef<HTMLDivElement>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  useEffect(() => {
    const el = endRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && fetchNextPage(),
      {
        rootMargin: "0px 0px 400px 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      ref={fillRef}
      style={{ minHeight: fillHeight }}
      className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))]"
    >
      <WizardHeader />
      <div ref={topRef} aria-hidden className="-mt-14 h-px" />

      <header
        className={`sticky top-14 z-20 -mx-4 px-4 transition-[padding,box-shadow,background-color] duration-300 ease-out ${
          compact
            ? "bg-[#f7f5ee]/95 pb-2 pt-2 shadow-[0_6px_16px_-10px_rgba(20,83,45,0.35)] backdrop-blur"
            : "bg-transparent pb-1"
        }`}
      >
        <div className="flex items-center gap-2">
          <h1
            className={`min-w-0 flex-1 truncate font-extrabold leading-tight tracking-tight text-[#0f3d22] transition-[font-size] duration-300 ease-out ${
              compact ? "text-lg" : "text-[1.625rem]"
            }`}
          >
            {history ? "Lịch sử đăng tin" : "Lịch nhận chế biến"}
          </h1>
          {onCreate && (
            <button
              type="button"
              onClick={onCreate}
              className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#14532d] px-3 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/20 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className={compact ? "sr-only" : ""}>Đăng tin</span>
            </button>
          )}
        </div>
        {!compact && (
          <p className="text-sm text-slate-600">
            {query.isLoading ? (
              "Đang tải..."
            ) : (
              <>
                <b className="text-slate-900">{total}</b>{" "}
                {history ? "tin đã đăng" : "tin đang mở nhận kết nối"}
              </>
            )}
          </p>
        )}

        <label className="mt-2.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo máy, tiêu đề..."
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-slate-400"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => setKeyword("")}
              aria-label="Xóa tìm kiếm"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </label>

        {history && (
          <div className="-mx-4 mt-2 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {HISTORY_CHIPS.map((c) => (
              <button
                key={c.value || "all"}
                type="button"
                aria-pressed={status === c.value}
                onClick={() => setStatus(c.value)}
                className={`h-8 shrink-0 snap-start rounded-full px-3.5 text-[13px] font-semibold transition ${
                  status === c.value
                    ? "bg-[#14532d] text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </header>
      {notice && <div className="mt-3">{notice}</div>}

      <div className="mt-3 space-y-3">
        {query.isLoading ? (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-3xl bg-white/70"
            />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 px-6 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            <Inbox className="h-7 w-7" />
            {debounced || status
              ? "Không có tin phù hợp."
              : history
                ? "Chưa đăng tin nhận chế biến nào."
                : "Chưa có tin nhận chế biến nào đang mở."}
            {!debounced && !status && onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="rounded-full bg-[#14532d] px-4 py-2 text-sm font-semibold text-white"
              >
                Đăng tin ngay
              </button>
            )}
          </div>
        ) : (
          items.map((s, i) => {
            const left = daysLeft(s.endDate);
            const notStarted = dayjs(s.startDate).isAfter(dayjs(), "day");
            return (
              <article
                key={s.id}
                style={{ animationDelay: `${(i % 10) * 40}ms` }}
                className="fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.08)] ring-1 ring-emerald-900/5"
              >
                <div className="flex gap-3 p-3.5">
                  <TileImage
                    src={s.machine?.imageUrl}
                    alt={s.machine?.name ?? ""}
                    className="h-16 w-16 shrink-0 rounded-2xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 font-bold leading-snug text-slate-900">
                        {s.title}
                      </p>
                      <span className="shrink-0">
                        <ScheduleStatusBadge status={s.status} />
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500">
                      {admin && s.profile?.name
                        ? `${s.profile.name} · ${s.machine?.name ?? ""}`
                        : s.machine?.name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 px-3.5">
                  <div className="rounded-2xl bg-emerald-50/70 px-3 py-2 ring-1 ring-emerald-100">
                    <p className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Factory className="h-3.5 w-3.5" /> Công suất nhận
                    </p>
                    <p className="text-base font-extrabold text-[#14532d]">
                      {fmt.format(s.maxCapacity)}{" "}
                      <span className="text-xs font-semibold">
                        {CAPACITY_UNIT_LABELS[s.capacityUnit] ?? s.capacityUnit}
                      </span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200/70">
                    <p className="flex items-center gap-1 text-[11px] text-slate-500">
                      <CalendarRange className="h-3.5 w-3.5" /> Lịch nhận
                    </p>
                    <p className="text-[13px] font-semibold text-slate-800">
                      {dayjs(s.startDate).format("DD/MM")} →{" "}
                      {dayjs(s.endDate).format("DD/MM/YY")}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${left <= 3 ? "text-amber-600" : "text-slate-500"}`}
                    >
                      {notStarted
                        ? `Bắt đầu ${date(s.startDate)}`
                        : left >= 0
                          ? `Còn ${left} ngày`
                          : "Đã hết hạn"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 px-3.5 pt-2.5">
                  {(s.machine?.processingServices?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {s.machine.processingServices!.map((sv) => (
                        <Pill key={sv.id}>{sv.name}</Pill>
                      ))}
                    </div>
                  )}
                  {s.note && (
                    <p className="flex gap-1.5 text-[13px] text-slate-600">
                      <StickyNote className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span className="line-clamp-2">{s.note}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>
                      Đăng {dayjs(s.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                    {s.totalViews !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />{" "}
                        {fmt.format(s.totalViews)}
                      </span>
                    )}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center gap-2 border-t border-slate-100 px-3.5 py-2.5">
                  <span className="flex-1">
                    <ScheduleConnectionsButton schedule={s} />
                  </span>
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(s)}
                      className="flex h-9 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-800 active:scale-95"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Sửa
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(s)}
                      aria-label="Xóa tin đăng"
                      className="flex h-9 items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[13px] font-semibold text-rose-600 active:scale-95"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Xóa
                    </button>
                  )}
                  {onClose && s.status === "OPEN" && (
                    <button
                      type="button"
                      onClick={() => onClose(s)}
                      className="flex h-9 items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[13px] font-semibold text-rose-600 active:scale-95"
                    >
                      <Lock className="h-3.5 w-3.5" /> Đóng tin
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      <div ref={endRef} aria-hidden />
      {isFetchingNextPage && (
        <p className="flex items-center justify-center gap-2 py-5 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải thêm...
        </p>
      )}
      {!query.isLoading && !hasNextPage && items.length > 0 && (
        <p className="py-5 text-center text-xs text-slate-400">
          Đã hiển thị tất cả {total} tin
        </p>
      )}
    </div>
  );
}
