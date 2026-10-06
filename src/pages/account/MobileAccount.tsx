import {
  Building2,
  Check,
  ChevronRight,
  History,
  LogOut,
  Phone,
  Search,
  UserCheck,
  UserRound,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { ROUTES } from "@/config/routes";
import { authApi, useCurrentUser } from "@/features/auth";
import {
  formatWorkspaceDisplayName,
  getSelectedWorkspaceIdFromStorage,
} from "@/features/workspace";
import { useWorkspaces } from "@/features/workspace/api/workspace.api";
import { useFillViewportHeight } from "@/hooks/useFillViewportHeight";
import { WizardHeader } from "@/pages/connection/mobile/wizard-ui";

function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(20,83,45,0.06)] ring-1 ring-emerald-900/5">
      {title && (
        <h2 className="mb-2 text-[15px] font-bold text-slate-900">{title}</h2>
      )}
      {children}
    </section>
  );
}

function Row({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  href?: string;
}) {
  const body = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-slate-500">{label}</span>
        <span
          className={`block truncate text-[15px] font-medium ${value ? "text-slate-900" : "text-slate-400"}`}
        >
          {value || "Chưa cập nhật"}
        </span>
      </span>
    </>
  );
  return href && value ? (
    <a href={href} className="flex items-center gap-3 py-2.5">
      {body}
    </a>
  ) : (
    <div className="flex items-center gap-3 py-2.5">{body}</div>
  );
}

function LinkRow({
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
      className="flex items-center gap-3 py-2.5 active:opacity-70"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#14532d]">
        {icon}
      </span>
      <span className="flex-1 text-[15px] font-medium text-slate-900">
        {label}
      </span>
      <ChevronRight className="h-5 w-5 text-slate-400" />
    </Link>
  );
}

const fold = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

type WorkspaceItem = ReturnType<typeof useWorkspaces>["data"] extends
  | (infer U)[]
  | undefined
  ? U
  : never;

/** Searchable, scrollable unit list — the selected one is pinned on top */
function WorkspacePicker({
  workspaces,
  selectedId,
  onSelect,
}: {
  workspaces: WorkspaceItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const label = (w: WorkspaceItem) =>
    formatWorkspaceDisplayName({
      facilityName: w.metadataJson?.factoryDisplayName || w.brandName || w.name,
      ownerName: w.owner?.fullName,
      ownerPhoneNumber: w.owner?.phoneNumber,
    });
  const list = useMemo(() => {
    const k = fold(keyword.trim());
    const filtered = k
      ? workspaces.filter((w) => fold(label(w)).includes(k))
      : workspaces;
    return [...filtered].sort(
      (a, b) =>
        Number(String(b.id) === selectedId) -
        Number(String(a.id) === selectedId),
    );
  }, [workspaces, keyword, selectedId]);

  return (
    <Card title={`Đơn vị đang làm việc (${workspaces.length})`}>
      {workspaces.length > 4 && (
        <label className="mb-2.5 flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/15">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm đơn vị..."
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
      )}
      <div
        role="radiogroup"
        className="-mx-1 max-h-80 space-y-2 overflow-y-auto overscroll-contain px-1 py-0.5"
      >
        {list.map((w) => {
          const on = String(w.id) === selectedId || workspaces.length === 1;
          return (
            <button
              key={w.id}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={on}
              onClick={() => onSelect(String(w.id))}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                on
                  ? "bg-emerald-50 ring-2 ring-[#1f7a45]"
                  : "bg-slate-50 ring-1 ring-slate-200 active:scale-[0.99]"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#14532d] ring-1 ring-emerald-100">
                <Building2 className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-slate-900">
                {label(w)}
              </span>
              {on && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1f7a45] text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
        {list.length === 0 && (
          <p className="py-4 text-center text-sm text-slate-500">
            Không tìm thấy đơn vị.
          </p>
        )}
      </div>
    </Card>
  );
}

/** Mobile-app "Tài khoản" tab in the search flow's visual style */
export function MobileAccount({
  onSelectWorkspace,
}: {
  onSelectWorkspace: (id: string) => void;
}) {
  const [fillRef, fillHeight] = useFillViewportHeight<HTMLDivElement>();
  const { data: user, isLoading } = useCurrentUser();
  const { data: workspaces = [] } = useWorkspaces();
  const selectedId = getSelectedWorkspaceIdFromStorage();
  const name = user?.fullName || user?.username || "";
  const initial = name.trim().split(/\s+/).pop()?.charAt(0).toUpperCase();
  // Usernames are often the phone in 84xxxxxxxxx form — show it as a local number
  const raw = user?.phoneNumber || user?.username || "";
  const phone = /^84\d{9}$/.test(raw)
    ? `0${raw.slice(2)}`
    : user?.phoneNumber || "";

  return (
    <div
      ref={fillRef}
      style={{ minHeight: fillHeight }}
      className="-mx-4 -mt-4 -mb-[calc(5.5rem+env(safe-area-inset-bottom))] flex flex-col overflow-x-clip bg-[#f7f5ee] px-4 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))]"
    >
      <WizardHeader />

      {/* Centered avatar sitting on the banner's fade */}
      <section className="fsl-card-in relative -mt-20 flex flex-col items-center text-center">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1f7a45] to-[#14532d] text-4xl font-bold text-white shadow-xl shadow-emerald-900/25 ring-4 ring-[#f7f5ee]">
          {initial || <UserRound className="h-10 w-10" />}
        </span>
        {isLoading ? (
          <span className="mt-3 block h-7 w-40 animate-pulse rounded-lg bg-slate-200" />
        ) : (
          <p className="mt-3 max-w-full truncate text-2xl font-extrabold tracking-tight text-[#0f3d22]">
            {name || "Người dùng"}
          </p>
        )}
        {phone && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
            <Phone className="h-3.5 w-3.5 text-emerald-700" />
            {phone}
          </p>
        )}
      </section>

      <div className="mt-4 space-y-3">
        <Card title="Thông tin cá nhân">
          <div className="divide-y divide-slate-100">
            <Row
              icon={<Phone className="h-5 w-5" />}
              label="Số điện thoại"
              value={user?.phoneNumber}
              href={user?.phoneNumber ? `tel:${user.phoneNumber}` : undefined}
            />
            <Row
              icon={<UserCheck className="h-5 w-5" />}
              label="Người giới thiệu"
              value={
                user?.referrer
                  ? [user.referrer.fullName, user.referrer.phoneNumber]
                      .filter(Boolean)
                      .join(" · ")
                  : null
              }
            />
          </div>
        </Card>

        {workspaces.length > 0 && (
          <WorkspacePicker
            workspaces={workspaces}
            selectedId={selectedId}
            onSelect={onSelectWorkspace}
          />
        )}

        <Card title="Tiện ích">
          <div className="divide-y divide-slate-100">
            <LinkRow
              href={ROUTES.connectionSearch}
              icon={<Search className="h-5 w-5" />}
              label="Tìm nhà máy"
            />
            <LinkRow
              href={ROUTES.connectionHistory}
              icon={<History className="h-5 w-5" />}
              label="Lịch sử kết nối"
            />
          </div>
        </Card>

        <button
          type="button"
          onClick={() => authApi.logout()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white text-[15px] font-semibold text-rose-600 active:scale-[0.99]"
        >
          <LogOut className="h-5 w-5" /> Đăng xuất
        </button>
      </div>
    </div>
  );
}
