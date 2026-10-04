import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Switch } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Building2,
  Check,
  Inbox,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  EMPTY_FACTORY_ACCOUNT,
  FACTORY_ACCOUNT_STATUS_LABELS,
  factoryAccountSchema,
  useInfiniteFactoryAccounts,
  type AdminFactoryAccountItem,
  type FactoryAccountFormValues,
} from "@/features/factory-account";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import {
  WizardFooter,
  WizardHeader,
} from "@/pages/connection/mobile/wizard-ui";
import { FactoryAccountFormFields } from "./FactoryAccountFormFields";

const SHELL =
  "-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4";

interface ListProps {
  formatPhone: (phone?: string | null) => string;
  /** Admin/system accounts can't be edited or toggled */
  isLocked: (a: AdminFactoryAccountItem) => boolean;
  togglePending: boolean;
  onCreate: () => void;
  onEdit: (a: AdminFactoryAccountItem) => void;
  onToggle: (a: AdminFactoryAccountItem, active: boolean) => void;
}

/** Mobile-app factory owner accounts: search + infinite cards with status switch */
export function MobileFactoryAccountList({
  formatPhone,
  isLocked,
  togglePending,
  onCreate,
  onEdit,
  onToggle,
}: ListProps) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const [keyword, setKeyword] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(keyword.trim()), 400);
    return () => window.clearTimeout(t);
  }, [keyword]);

  const query = useInfiniteFactoryAccounts({
    keyword: debounced || undefined,
    roleCode: "MEVI_FACTORY_MEMBER",
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
      className={`${SHELL} pb-[calc(7rem+env(safe-area-inset-bottom))]`}
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
            Tài khoản nhà máy
          </h1>
          {!query.isLoading && (
            <span className="shrink-0 text-xs text-slate-500">
              <b className="text-slate-800">{total}</b> tài khoản
            </span>
          )}
          <button
            type="button"
            onClick={onCreate}
            className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#14532d] px-3 text-[13px] font-semibold text-white shadow-md shadow-emerald-900/20 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className={compact ? "sr-only" : ""}>Tạo</span>
          </button>
        </div>
        {!compact && (
          <p className="text-sm text-slate-600">
            Tạo, tạm dừng và gán tài khoản quản lý nhà máy
          </p>
        )}

        <label className="mt-2.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên, SĐT, email..."
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
      </header>

      <div className="mt-3 space-y-3">
        {query.isLoading ? (
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-3xl bg-white/70"
            />
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/70 px-6 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
            <Inbox className="h-7 w-7" />
            {debounced
              ? "Không có tài khoản phù hợp."
              : "Chưa có tài khoản nhà máy nào."}
          </div>
        ) : (
          items.map((a, i) => {
            const ws = a.workspaces?.[0];
            const factory = ws?.factoryProfile?.name || ws?.name;
            const active = a.status === "active";
            const locked = isLocked(a);
            const phone = formatPhone(a.phoneNumber) || a.username;
            return (
              <article
                key={a.id}
                style={{ animationDelay: `${(i % 10) * 40}ms` }}
                className={`fsl-card-in overflow-hidden rounded-3xl bg-white shadow-[0_4px_18px_rgba(20,83,45,0.08)] ring-1 ring-emerald-900/5 ${active ? "" : "opacity-80"}`}
              >
                <div className="flex items-start gap-3 p-3.5">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                      active
                        ? "bg-emerald-100 text-[#14532d]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {a.fullName
                      .trim()
                      .split(/\s+/)
                      .pop()
                      ?.charAt(0)
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900">
                      {a.fullName}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <Phone className="h-3.5 w-3.5" /> {phone}
                    </p>
                    {a.email && (
                      <p className="flex items-center gap-1 truncate text-xs text-slate-500">
                        <Mail className="h-3.5 w-3.5" /> {a.email}
                      </p>
                    )}
                  </div>
                  <label className="flex shrink-0 flex-col items-end gap-1">
                    <Switch
                      checked={active}
                      disabled={togglePending || locked}
                      onCheckedChange={(checked) => onToggle(a, checked)}
                      aria-label="Kích hoạt / tạm dừng"
                    />
                    <span
                      className={`text-[11px] font-semibold ${active ? "text-emerald-700" : "text-slate-500"}`}
                    >
                      {FACTORY_ACCOUNT_STATUS_LABELS[a.status] || a.status}
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-2 border-t border-slate-100 px-3.5 py-2.5">
                  <p
                    className={`flex min-w-0 flex-1 items-center gap-1.5 truncate text-[13px] ${factory ? "font-medium text-slate-800" : "text-slate-400"}`}
                  >
                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                    {factory || "Chưa gán nhà máy"}
                  </p>
                  {!locked && (
                    <button
                      type="button"
                      onClick={() => onEdit(a)}
                      className="flex h-9 shrink-0 items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 text-[13px] font-semibold text-slate-800 active:scale-95"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Sửa
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
          Đã hiển thị tất cả {total} tài khoản
        </p>
      )}
    </div>
  );
}

/** Full-screen create/edit account form for the mobile app */
export function MobileFactoryAccountForm({
  initialValues,
  initialWorkspaceOption,
  isSubmitting,
  onSubmit,
  onClose,
}: {
  initialValues?: FactoryAccountFormValues;
  initialWorkspaceOption?: { value: string; label: string };
  isSubmitting?: boolean;
  onSubmit: (values: FactoryAccountFormValues) => void;
  onClose: () => void;
}) {
  const isEdit = !!initialValues;
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLFormElement>();
  const form = useForm<FactoryAccountFormValues>({
    resolver: zodResolver(factoryAccountSchema),
    defaultValues: initialValues ?? EMPTY_FACTORY_ACCOUNT,
    mode: "onTouched",
  });
  const initialOptions = useMemo(
    () => (initialWorkspaceOption?.value ? [initialWorkspaceOption] : []),
    [initialWorkspaceOption],
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <Form {...form}>
      <form
        ref={fillRef}
        style={{ minHeight: fillHeight }}
        onSubmit={(e) => e.preventDefault()}
        className={SHELL}
      >
        <WizardHeader onBack={onClose} />
        <div className="relative -mt-14 flex-1">
          <h1 className="text-[1.625rem] font-extrabold leading-tight tracking-tight text-[#0f3d22]">
            {isEdit ? "Sửa tài khoản" : "Tạo tài khoản chủ nhà máy"}
          </h1>
          <p className="mb-4 text-sm text-slate-600">
            Tài khoản đăng nhập MEVI và nhà máy được gán quyền quản lý
          </p>
          <div className="fsl-card-in rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
            <FactoryAccountFormFields
              control={form.control}
              isEdit={isEdit}
              initialOptions={initialOptions}
            />
          </div>
        </div>

        <WizardFooter>
          <button
            type="button"
            onClick={onClose}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white text-base font-semibold text-slate-800 shadow-sm active:scale-[0.98]"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className="flex h-14 flex-[1.6] items-center justify-center gap-2 rounded-2xl bg-[#14532d] text-base font-semibold text-white shadow-lg shadow-emerald-900/25 active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
            {isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
          </button>
        </WizardFooter>
      </form>
    </Form>
  );
}
