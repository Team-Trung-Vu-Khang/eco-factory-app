import dayjs from "dayjs";
import {
  CalendarClock,
  Factory,
  Hash,
  Inbox,
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
  CAPACITY_UNIT_LABELS,
  useInfiniteFactoryMachines,
  type FactoryMachineItem,
  type MachineStatus,
} from "@/features/machine";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { Pill } from "@/pages/connection/mobile/result-ui";
import { TileImage, WizardHeader } from "@/pages/connection/mobile/wizard-ui";
import { MACHINE_STATUS_CONFIG } from "./machine-columns";
import { MACHINE_STATUS_OPTIONS } from "./machine-form-schema";

const fmt = new Intl.NumberFormat("vi-VN");
const date = (d: string) => dayjs(d).format("DD/MM");
const CHIPS = [{ value: "", label: "Tất cả" }, ...MACHINE_STATUS_OPTIONS];

interface Props {
  onCreate: () => void;
  onEdit: (m: FactoryMachineItem) => void;
  onDelete: (m: FactoryMachineItem) => void;
}

/** Mobile-app machine list (factory member): search, status chips, infinite cards */
export function MobileMachineList({ onCreate, onEdit, onDelete }: Props) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(keyword.trim()), 400);
    return () => window.clearTimeout(t);
  }, [keyword]);

  const query = useInfiniteFactoryMachines({
    keyword: debounced || undefined,
    status: (status || undefined) as MachineStatus | undefined,
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
            Máy & dây chuyền
          </h1>
          {!query.isLoading && (
            <span className="shrink-0 text-xs text-slate-500">
              <b className="text-slate-800">{total}</b> máy
            </span>
          )}
          <button
            type="button"
            onClick={onCreate}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#14532d] px-3 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className={compact ? "sr-only" : ""}>Thêm</span>
          </button>
        </div>
        {!compact && (
          <p className="text-sm text-slate-600">
            Thiết bị, dịch vụ chế biến và công suất
          </p>
        )}

        <label className="mt-2.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo mã, tên máy..."
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
              ? "Không có máy phù hợp với bộ lọc."
              : "Chưa có máy / dây chuyền nào."}
            {!debounced && !status && (
              <button
                type="button"
                onClick={onCreate}
                className="rounded-full bg-[#14532d] px-4 py-2 text-sm font-semibold text-white"
              >
                Thêm máy
              </button>
            )}
          </div>
        ) : (
          items.map((m, i) => {
            const st = MACHINE_STATUS_CONFIG[m.status];
            const schedules = m.openSchedules ?? [];
            return (
              <article
                key={m.id}
                style={{ animationDelay: `${(i % 10) * 40}ms` }}
                className="fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.08)] ring-1 ring-emerald-900/5"
              >
                <div className="flex gap-3 p-3.5">
                  {m.imageUrl ? (
                    <ImagePreview
                      src={m.imageUrl}
                      alt={m.name}
                      className="rounded-2xl"
                    >
                      <TileImage
                        src={m.imageUrl}
                        alt=""
                        className="block h-20 w-20 rounded-2xl"
                      />
                    </ImagePreview>
                  ) : (
                    <TileImage
                      alt={m.name}
                      className="h-20 w-20 shrink-0 rounded-2xl"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 font-bold leading-snug text-slate-900">
                        {m.name}
                      </p>
                      {st && (
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${st.className}`}
                        >
                          {st.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <Hash className="h-3.5 w-3.5" /> {m.code}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-700">
                      <Factory className="h-4 w-4 text-slate-400" />
                      <b className="text-slate-900">
                        {fmt.format(m.maxCapacity)}
                      </b>
                      {CAPACITY_UNIT_LABELS[m.capacityUnit] ?? m.capacityUnit}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 px-3.5 py-3">
                  {m.processingServices?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.processingServices.map((s) => (
                        <Pill key={s.id}>{s.name}</Pill>
                      ))}
                    </div>
                  )}
                  {m.productGroups?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.productGroups.map((g) => (
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
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarClock className="h-4 w-4" />
                    {schedules.length
                      ? schedules
                          .slice(0, 2)
                          .map((s) => `${date(s.startDate)}→${date(s.endDate)}`)
                          .join(" · ") +
                        (schedules.length > 2
                          ? ` +${schedules.length - 2}`
                          : "")
                      : "Chưa có lịch nhận chế biến"}
                  </p>
                </div>

                <div className="flex gap-2 border-t border-slate-100 px-3.5 py-2.5">
                  <button
                    type="button"
                    onClick={() => onEdit(m)}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white text-[13px] font-semibold text-slate-800 active:scale-[0.98]"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(m)}
                    aria-label={`Xóa ${m.name}`}
                    className="flex h-9 w-12 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
          Đã hiển thị tất cả {total} máy
        </p>
      )}
    </div>
  );
}
