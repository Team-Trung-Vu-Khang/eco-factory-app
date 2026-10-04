import {
  Factory,
  FileText,
  History,
  Loader2,
  MapPin,
  SearchX,
  Send,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import type { MarketplaceScheduleItem } from "@/features/connection";
import { ConnectionStatusBadge } from "../components/ConnectionStatusBadge";
import { TileImage } from "./wizard-ui";
import { Pill, VerifiedBadge } from "./result-ui";
import { capacityText } from "./result-format";

interface Props {
  results: MarketplaceScheduleItem[];
  total: number;
  loading: boolean;
  connectingId?: number;
  onDetail: (s: MarketplaceScheduleItem) => void;
  onConnect: (s: MarketplaceScheduleItem) => void;
  onCancel: (s: MarketplaceScheduleItem) => void;
  onEditCriteria: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

/** Step 3 — result cards, in the order the API returns */
export function MobileResultList({
  results,
  total,
  loading,
  connectingId,
  onDetail,
  onConnect,
  onCancel,
  onEditCriteria,
  hasMore,
  loadingMore,
  onLoadMore,
}: Props) {
  // Header collapses once its top sentinel scrolls out of view
  const topRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setCompact(!e.isIntersecting),
      {
        rootMargin: "-56px 0px 0px 0px", // below the layout's sticky app bar (h-14)
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Infinite scroll: load the next page shortly before reaching the end
  const endRef = useRef<HTMLDivElement>(null);
  const loadMore = useRef(onLoadMore);
  useEffect(() => {
    loadMore.current = onLoadMore;
  });
  useEffect(() => {
    const el = endRef.current;
    if (!el || !hasMore || loadingMore) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && loadMore.current(),
      { rootMargin: "0px 0px 400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadingMore]);

  return (
    <div className="pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <div ref={topRef} aria-hidden className="h-px" />
      <header
        className={`sticky top-14 z-20 -mx-4 px-4 transition-[padding,background-color,box-shadow] duration-300 ease-out ${
          compact
            ? "bg-[#f7f5ee]/95 py-2 shadow-[0_6px_16px_-10px_rgba(20,83,45,0.35)] backdrop-blur"
            : "bg-transparent py-0"
        }`}
      >
        <div
          className={`flex gap-x-2 ${compact ? "items-center" : "flex-col"}`}
        >
          <h1
            className={`min-w-0 truncate font-extrabold leading-tight tracking-tight text-[#0f3d22] transition-[font-size] duration-300 ease-out ${
              compact ? "flex-1 text-lg" : "text-[1.625rem]"
            }`}
          >
            Nhà máy phù hợp
          </h1>
          <div className={`flex items-center gap-1.5 ${compact ? "" : "mt-1"}`}>
            <p
              className={`text-slate-600 ${compact ? "sr-only" : "flex-1 text-sm"}`}
            >
              <b className="text-slate-900">{total}</b> nhà máy phù hợp
            </p>
            <Link
              href={ROUTES.connectionHistory}
              aria-label="Lịch sử kết nối"
              className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-white px-2.5 text-xs font-semibold text-emerald-800 ring-1 ring-slate-200 active:scale-95"
            >
              <History className="h-3.5 w-3.5" />
              <span className={compact ? "sr-only" : ""}>Lịch sử</span>
            </Link>
            <button
              type="button"
              onClick={onEditCriteria}
              aria-label="Thay đổi tiêu chí tìm kiếm"
              className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-[#14532d] px-2.5 text-xs font-semibold text-white active:scale-95"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className={compact ? "sr-only" : ""}>Sửa tiêu chí</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mt-3 space-y-3">
        {loading ? (
          [0, 1].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-3xl bg-white/70"
            />
          ))
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl bg-white/70 px-6 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            <SearchX className="h-6 w-6" />
            Chưa có nhà máy đang nhận chế biến phù hợp. Thử mở rộng phạm vi hoặc
            bỏ bớt điều kiện.
          </div>
        ) : (
          results.map((s, i) => {
            const req = s.myConnectionRequest;
            const canConnect = !req || req.status === "CANCELLED";
            const services = s.machine.processingServices ?? [];
            const groups = s.machine.productGroups ?? [];
            return (
              <article
                key={s.id}
                // New cards (incl. each loaded page) slide in with a short stagger
                style={{ animationDelay: `${(i % 10) * 40}ms` }}
                className="fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.08)] ring-1 ring-emerald-900/5"
              >
                <button
                  type="button"
                  onClick={() => onDetail(s)}
                  className="relative block w-full"
                >
                  <TileImage
                    src={s.machine.imageUrl ?? s.profile.logoUrl}
                    alt={s.profile.name}
                    className="h-32 w-full"
                  />
                  <VerifiedBadge className="absolute right-2.5 top-2.5" />
                  {!canConnect && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 shadow-sm [&>*]:border-0">
                      <ConnectionStatusBadge status={req.status} />
                    </span>
                  )}
                </button>

                <div className="space-y-2.5 p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-base font-bold leading-snug text-slate-900">
                        {s.profile.name}
                      </h2>
                      <p className="truncate text-xs text-slate-500">
                        {s.title}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-600">
                      {s.profile.province && (
                        <p className="flex items-center justify-end gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {s.profile.province}
                        </p>
                      )}
                    </div>
                  </div>

                  {services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {services.map((sv) => (
                        <Pill key={sv.id}>{sv.name}</Pill>
                      ))}
                    </div>
                  )}

                  <p className="flex items-center gap-1.5 text-[13px] text-slate-700">
                    <Factory className="h-3.5 w-3.5 text-slate-500" />
                    Còn nhận:{" "}
                    <b className="text-slate-900">{capacityText(s)}</b>
                  </p>

                  {groups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {groups.slice(0, 4).map((g) => (
                        <Pill
                          key={g.id}
                          tone="slate"
                          lead={
                            <TileImage
                              src={g.imageUrl}
                              alt=""
                              className="h-4 w-4 rounded-full"
                            />
                          }
                        >
                          {g.name}
                        </Pill>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => onDetail(s)}
                      className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 active:scale-[0.98]"
                    >
                      <FileText className="h-4 w-4" /> Xem chi tiết
                    </button>
                    {canConnect ? (
                      <button
                        type="button"
                        onClick={() => onConnect(s)}
                        disabled={connectingId === s.id}
                        className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#14532d] text-sm font-semibold text-white shadow-md shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70"
                      >
                        <Send className="h-4 w-4" /> Gửi yêu cầu
                      </button>
                    ) : (
                      // Status sits on the image; here only the action that's still possible
                      (req.status === "PENDING" ||
                        req.status === "SUCCESS") && (
                        <button
                          type="button"
                          onClick={() => onCancel(s)}
                          className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 text-sm font-semibold text-rose-600 active:scale-[0.98]"
                        >
                          <XCircle className="h-4 w-4" />
                          {req.status === "SUCCESS"
                            ? "Hủy kết nối"
                            : "Hủy yêu cầu"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <div ref={endRef} aria-hidden />
      {loadingMore && (
        <p className="flex items-center justify-center gap-2 py-5 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải thêm...
        </p>
      )}
      {!loading && !hasMore && results.length > 0 && (
        <p className="py-5 text-center text-xs text-slate-400">
          Đã hiển thị tất cả {total} nhà máy
        </p>
      )}
    </div>
  );
}
