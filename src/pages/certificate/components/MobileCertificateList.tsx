import dayjs from "dayjs";
import {
  Award,
  Building2,
  CalendarRange,
  ChevronRight,
  Hash,
  Inbox,
  Landmark,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePreview } from "@/components/common/ImagePreview";
import {
  useInfiniteCertificates,
  type Certificate,
  type CertificateSummary,
} from "@/features/certificate";
import { CERTIFICATION_TYPE_LABELS } from "@/features/factory";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { TileImage, WizardHeader } from "@/pages/connection/mobile/wizard-ui";
import { ValidityBadge } from "./ValidityBadge";

const typeLabel = (t: string) =>
  (CERTIFICATION_TYPE_LABELS as Record<string, string>)[t] ?? t;
const date = (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY") : undefined);

interface Props {
  summary?: CertificateSummary;
  /** Admin: every factory's certificates, read + delete only */
  admin?: boolean;
  onCreate?: () => void;
  onView: (c: Certificate) => void;
  onEdit?: (c: Certificate) => void;
  onDelete: (c: Certificate) => void;
}

/** Mobile-app certificate list (factory member): status chips with counts, infinite cards */
export function MobileCertificateList({
  summary,
  admin,
  onCreate,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(keyword.trim()), 400);
    return () => window.clearTimeout(t);
  }, [keyword]);

  const query = useInfiniteCertificates(
    {
      keyword: debounced || undefined,
      status: (status || undefined) as Certificate["status"] | undefined,
    },
    { admin },
  );
  const items = useMemo(
    () => query.data?.pages.flatMap((p) => p.content) ?? [],
    [query.data],
  );

  // Status chips double as the summary stats
  const chips = [
    { value: "", label: "Tất cả", count: summary?.total, dot: "bg-slate-400" },
    {
      value: "ACTIVE",
      label: "Còn hiệu lực",
      count: summary?.active,
      dot: "bg-emerald-500",
    },
    {
      value: "EXPIRING_SOON",
      label: "Sắp hết hạn",
      count: summary?.expiringSoon,
      dot: "bg-amber-500",
    },
    {
      value: "EXPIRED",
      label: "Hết hạn",
      count: summary?.expired,
      dot: "bg-rose-500",
    },
  ];

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

  const total = query.data?.pages[0]?.totalElements ?? 0;

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
            Chứng nhận sản xuất
          </h1>
          {onCreate && (
            <button
              type="button"
              onClick={onCreate}
              className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#14532d] px-3 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/20 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className={compact ? "sr-only" : ""}>Thêm</span>
            </button>
          )}
        </div>
        {!compact && (
          <p className="text-sm text-slate-600">
            {admin
              ? "Chứng nhận của tất cả nhà máy"
              : "ATTP, HACCP, ISO, VietGAP… và thời hạn hiệu lực"}
          </p>
        )}

        <label className="mt-2.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm số chứng nhận, loại chứng nhận..."
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
          {chips.map((c) => {
            const on = status === c.value;
            return (
              <button
                key={c.value || "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setStatus(c.value)}
                className={`flex h-8 shrink-0 snap-start items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition ${
                  on
                    ? "bg-[#14532d] text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${on ? "bg-white" : c.dot}`}
                />
                {c.label}
                {c.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 text-[11px] ${on ? "bg-white/20" : "bg-slate-100"}`}
                  >
                    {c.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      <div className="mt-2 space-y-3">
        {query.isLoading ? (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-3xl bg-white/70"
            />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 px-6 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            <Inbox className="h-7 w-7" />
            {debounced || status
              ? "Không có chứng nhận phù hợp với bộ lọc."
              : "Chưa có chứng nhận nào."}
            {!debounced && !status && onCreate && (
              <button
                type="button"
                onClick={onCreate}
                className="rounded-full bg-[#14532d] px-4 py-2 text-sm font-semibold text-white"
              >
                Thêm chứng nhận
              </button>
            )}
          </div>
        ) : (
          items.map((c, i) => (
            <article
              key={c.id}
              style={{ animationDelay: `${(i % 10) * 40}ms` }}
              className="fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.08)] ring-1 ring-emerald-900/5"
            >
              <div className="flex gap-3 p-3.5">
                {c.imageUrl ? (
                  <ImagePreview
                    src={c.imageUrl}
                    alt={typeLabel(c.certificateType)}
                    className="rounded-2xl"
                  >
                    <TileImage
                      src={c.imageUrl}
                      alt=""
                      className="block h-20 w-20 rounded-2xl"
                    />
                  </ImagePreview>
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Award className="h-8 w-8" />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onView(c)}
                  className="min-w-0 flex-1 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 font-bold leading-snug text-slate-900">
                      {typeLabel(c.certificateType)}
                    </p>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                  <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                    {admin && c.profile?.name && (
                      <p className="flex items-center gap-1 truncate font-medium text-emerald-800">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        {c.profile.name}
                      </p>
                    )}
                    {c.certificateNumber && (
                      <p className="flex items-center gap-1 truncate">
                        <Hash className="h-3.5 w-3.5 shrink-0" />{" "}
                        {c.certificateNumber}
                      </p>
                    )}
                    {c.issuer && (
                      <p className="flex items-center gap-1 truncate">
                        <Landmark className="h-3.5 w-3.5 shrink-0" /> {c.issuer}
                      </p>
                    )}
                    {(c.issuedDate || c.expiryDate) && (
                      <p className="flex items-center gap-1">
                        <CalendarRange className="h-3.5 w-3.5 shrink-0" />
                        {date(c.issuedDate) ?? "—"} →{" "}
                        {date(c.expiryDate) ?? "Không thời hạn"}
                      </p>
                    )}
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 px-3.5 py-2.5">
                <span className="flex-1">
                  <ValidityBadge
                    validity={c.status}
                    daysToExpiry={c.daysUntilExpiry ?? null}
                  />
                </span>
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(c)}
                    className="flex h-9 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-800 active:scale-95"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Sửa
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(c)}
                  aria-label="Xóa chứng nhận"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
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
          Đã hiển thị tất cả {total} chứng nhận
        </p>
      )}
    </div>
  );
}
