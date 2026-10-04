import {
  Building2,
  Inbox,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import {
  useInfiniteAdminFactoryProfiles,
  type FactoryProfile,
} from "@/features/factory";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { Pill } from "@/pages/connection/mobile/result-ui";
import { TileImage, WizardHeader } from "@/pages/connection/mobile/wizard-ui";
import { FACTORY_REVIEW_STATUS_OPTIONS } from "./factory-filters";

const CHIPS = [
  { value: "", label: "Tất cả" },
  ...FACTORY_REVIEW_STATUS_OPTIONS,
];
const REVIEW_CLS: Record<string, string> = {
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  PENDING_REVIEW: "bg-amber-50 text-amber-700 ring-amber-100",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-100",
};
const reviewLabel = (s: string) =>
  FACTORY_REVIEW_STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s;

/** Mobile-app factory profile list (admin view): review chips + infinite cards */
export function MobileFactoryList() {
  const [, navigate] = useLocation();
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(keyword.trim()), 400);
    return () => window.clearTimeout(t);
  }, [keyword]);

  const query = useInfiniteAdminFactoryProfiles({
    keyword: debounced || undefined,
    reviewStatus: (reviewStatus || undefined) as
      FactoryProfile["reviewStatus"] | undefined,
  });
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
            Hồ sơ nhà máy
          </h1>
          {!query.isLoading && (
            <span className="shrink-0 text-xs text-slate-500">
              <b className="text-slate-800">{total}</b> cơ sở
            </span>
          )}
          <button
            type="button"
            onClick={() => navigate(ROUTES.profileCreate)}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#14532d] px-3 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className={compact ? "sr-only" : ""}>Thêm</span>
          </button>
        </div>
        {!compact && (
          <p className="text-sm text-slate-600">
            Cơ sở chế biến đăng ký trên MEVI Factories
          </p>
        )}

        <label className="mt-2.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tên cơ sở, người đại diện, MST..."
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
          {CHIPS.map((c) => (
            <button
              key={c.value || "all"}
              type="button"
              aria-pressed={reviewStatus === c.value}
              onClick={() => setReviewStatus(c.value)}
              className={`h-8 shrink-0 snap-start rounded-full px-3.5 text-[13px] font-semibold transition ${
                reviewStatus === c.value
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
              className="h-40 animate-pulse rounded-3xl bg-white/70"
            />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 px-6 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            <Inbox className="h-7 w-7" />
            {debounced || reviewStatus
              ? "Không có cơ sở phù hợp với bộ lọc."
              : "Chưa có cơ sở nào."}
          </div>
        ) : (
          items.map((f, i) => (
            <article
              key={f.id}
              style={{ animationDelay: `${(i % 10) * 40}ms` }}
              className="fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.08)] ring-1 ring-emerald-900/5"
            >
              <button
                type="button"
                onClick={() => navigate(ROUTES.profileDetail(String(f.id)))}
                className="flex w-full gap-3 p-3.5 text-left"
              >
                {f.logoUrl ? (
                  <TileImage
                    src={f.logoUrl}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-2xl bg-white ring-1 ring-slate-200"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Building2 className="h-6 w-6" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 font-bold leading-snug text-slate-900">
                      {f.name}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${REVIEW_CLS[f.reviewStatus] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}
                    >
                      {reviewLabel(f.reviewStatus)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {f.code} · {f.organizationType?.name ?? "Chưa phân loại"}
                    {f.taxCode ? ` · MST ${f.taxCode}` : ""}
                  </p>
                </div>
              </button>

              <div className="space-y-2 border-t border-slate-100 px-3.5 py-3 text-[13px] text-slate-700">
                {(f.representativeName || f.representativePhone) && (
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {f.representativeName && (
                      <span className="flex items-center gap-1">
                        <UserRound className="h-4 w-4 text-slate-400" />{" "}
                        {f.representativeName}
                      </span>
                    )}
                    {f.representativePhone && (
                      <a
                        href={`tel:${f.representativePhone}`}
                        className="flex items-center gap-1 text-emerald-700"
                      >
                        <Phone className="h-4 w-4" /> {f.representativePhone}
                      </a>
                    )}
                  </p>
                )}
                {f.province && (
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {[f.ward, f.province].filter(Boolean).join(", ")}
                  </p>
                )}
                {(f.processingServices?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {f.processingServices.slice(0, 4).map((s) => (
                      <Pill key={s.id}>{s.name}</Pill>
                    ))}
                    {f.processingServices.length > 4 && (
                      <Pill tone="slate">
                        +{f.processingServices.length - 4}
                      </Pill>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t border-slate-100 px-3.5 py-2.5">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.profileDetail(String(f.id)))}
                  className="flex h-9 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white text-[13px] font-semibold text-slate-800 active:scale-[0.98]"
                >
                  Xem chi tiết
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.profileEdit(String(f.id)))}
                  className="flex h-9 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-800 active:scale-95"
                >
                  <Pencil className="h-3.5 w-3.5" /> Sửa
                </button>
              </div>
            </article>
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
          Đã hiển thị tất cả {total} cơ sở
        </p>
      )}
    </div>
  );
}
