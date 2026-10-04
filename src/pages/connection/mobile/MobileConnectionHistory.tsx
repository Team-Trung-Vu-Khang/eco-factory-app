import dayjs from "dayjs";
import {
  CalendarClock,
  ChevronRight,
  Inbox,
  Loader2,
  MessageSquareText,
  Scale,
  Search,
  Sprout,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  CONNECTION_STATUS_OPTIONS,
  useInfiniteMyConnectionRequests,
  type ConnectionRequestItem,
} from "@/features/connection";
import { MATERIAL_CONDITION_LABELS } from "@/features/demand/constants";
import { CAPACITY_UNIT_LABELS } from "@/features/machine";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { ConnectionStatusBadge } from "../components/ConnectionStatusBadge";
import { Pill } from "./result-ui";
import { TileImage, WizardHeader } from "./wizard-ui";

const fmt = new Intl.NumberFormat("vi-VN");
const STATUS_CHIPS = [
  { value: "", label: "Tất cả" },
  ...CONNECTION_STATUS_OPTIONS,
];

/** Mobile-app "Lịch sử kết nối": search + status chips, infinite card list */
export function MobileConnectionHistory({
  onCancel,
}: {
  onCancel: (c: ConnectionRequestItem) => void;
}) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(keyword.trim()), 400);
    return () => window.clearTimeout(t);
  }, [keyword]);

  const query = useInfiniteMyConnectionRequests({
    keyword: debounced || undefined,
    status: status || undefined,
  });
  const items = useMemo(
    () => query.data?.pages.flatMap((p) => p.content) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.totalElements ?? 0;

  // Header collapses once its top sentinel scrolls under the app bar
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

  // Infinite scroll
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
        <div className="flex items-baseline justify-between gap-2">
          <h1
            className={`font-extrabold leading-tight tracking-tight text-[#0f3d22] transition-[font-size] duration-300 ease-out ${
              compact ? "text-lg" : "text-[1.625rem]"
            }`}
          >
            Lịch sử kết nối
          </h1>
          {!query.isLoading && (
            <span className="shrink-0 text-xs text-slate-500">
              <b className="text-slate-800">{total}</b> yêu cầu
            </span>
          )}
        </div>
        {!compact && (
          <p className="text-sm text-slate-600">
            Các nhà máy bạn đã gửi yêu cầu và phản hồi
          </p>
        )}

        <label className="mt-2.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm nhà máy, máy, cây trồng..."
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

        <div className="-mx-4 mt-2 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STATUS_CHIPS.map((c) => (
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
      </header>

      <div className="mt-2 space-y-3">
        {query.isLoading ? (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-3xl bg-white/70"
            />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 px-6 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            <Inbox className="h-7 w-7" />
            {debounced || status
              ? "Không có yêu cầu phù hợp với bộ lọc."
              : "Bạn chưa gửi yêu cầu kết nối nào."}
            {!debounced && !status && (
              <Link
                href={ROUTES.connectionSearch}
                className="rounded-full bg-[#14532d] px-4 py-2 text-sm font-semibold text-white"
              >
                Tìm nhà máy
              </Link>
            )}
          </div>
        ) : (
          items.map((c, i) => (
            <RequestCard key={c.id} c={c} index={i} onCancel={onCancel} />
          ))
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
          Đã hiển thị tất cả {total} yêu cầu
        </p>
      )}
    </div>
  );
}

function RequestCard({
  c,
  index,
  onCancel,
}: {
  c: ConnectionRequestItem;
  index: number;
  onCancel: (c: ConnectionRequestItem) => void;
}) {
  const canCancel = c.status === "PENDING" || c.status === "SUCCESS";
  const unit = c.capacityUnit
    ? (CAPACITY_UNIT_LABELS[c.capacityUnit] ?? c.capacityUnit)
    : "";
  const condition = c.materialCondition
    ? (MATERIAL_CONDITION_LABELS[
        c.materialCondition as keyof typeof MATERIAL_CONDITION_LABELS
      ] ?? c.materialCondition)
    : undefined;
  const detailHref =
    c.profile?.id !== undefined
      ? `${ROUTES.profileDetail(String(c.profile.id))}?scheduleId=${c.scheduleId}`
      : undefined;

  return (
    <article
      style={{ animationDelay: `${(index % 10) * 40}ms` }}
      className="fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.08)] ring-1 ring-emerald-900/5"
    >
      <div className="flex gap-3 p-3.5">
        <TileImage
          src={c.schedule?.machine?.imageUrl}
          alt={c.profile?.name ?? ""}
          className="h-16 w-16 shrink-0 rounded-2xl"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 font-bold leading-snug text-slate-900">
              {c.profile?.name ?? "—"}
            </p>
            <span className="shrink-0">
              <ConnectionStatusBadge status={c.status} />
            </span>
          </div>
          <p className="truncate text-xs text-slate-500">
            {c.schedule?.title ||
              c.schedule?.machine?.name ||
              "Lịch nhận chế biến"}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
            <CalendarClock className="h-3.5 w-3.5" />
            {dayjs(c.requestedAt || c.createdAt).format("DD/MM/YYYY HH:mm")}
          </p>
        </div>
      </div>

      <div className="space-y-2 border-t border-slate-100 px-3.5 py-3 text-sm">
        {(c.crops?.length || c.maxCapacity != null) && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
            {c.crops?.length ? (
              <span className="flex items-center gap-1">
                <Sprout className="h-4 w-4 text-emerald-600" />
                {c.crops.join(", ")}
              </span>
            ) : null}
            {c.maxCapacity != null && (
              <span className="flex items-center gap-1">
                <Scale className="h-4 w-4 text-slate-400" />
                {fmt.format(c.maxCapacity)} {unit}
              </span>
            )}
            {condition && (
              <span className="text-xs text-slate-500">· {condition}</span>
            )}
          </p>
        )}
        {c.processingServices?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {c.processingServices.map((s) => (
              <Pill key={s.id}>{s.name}</Pill>
            ))}
          </div>
        ) : null}
        {c.message && (
          <p className="flex gap-1.5 text-[13px] text-slate-600">
            <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <span className="line-clamp-2">{c.message}</span>
          </p>
        )}
        {(c.resultNote || c.rejectReason) && (
          <div
            className={`rounded-xl px-3 py-2 text-[13px] ${
              c.rejectReason
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-800"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
              Phản hồi của nhà máy
            </p>
            {c.resultNote && <p className="line-clamp-3">{c.resultNote}</p>}
            {c.rejectReason && (
              <p className="line-clamp-3">
                <span className="font-semibold">Lý do từ chối:</span>{" "}
                {c.rejectReason}
              </p>
            )}
          </div>
        )}
      </div>

      {(detailHref || canCancel) && (
        <div className="flex gap-2 border-t border-slate-100 px-3.5 py-2.5">
          {detailHref && (
            <Link
              href={detailHref}
              className="flex h-9 flex-1 items-center justify-center gap-1 rounded-xl border border-slate-300 bg-white text-[13px] font-semibold text-slate-800 active:scale-[0.98]"
            >
              Xem nhà máy <ChevronRight className="h-4 w-4" />
            </Link>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={() => onCancel(c)}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 text-[13px] font-semibold text-rose-600 active:scale-[0.98]"
            >
              <XCircle className="h-4 w-4" />
              {c.status === "SUCCESS" ? "Hủy kết nối" : "Hủy yêu cầu"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
