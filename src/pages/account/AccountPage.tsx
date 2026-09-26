import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, LogOut, Phone, Smartphone, UserCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { authApi, useCurrentUser } from "@/features/auth";
import { SELECTED_WORKSPACE_STORAGE_KEY, getSelectedWorkspaceIdFromStorage } from "@/features/workspace";
import { useWorkspaces } from "@/features/workspace/api/workspace.api";
import { setMobileUiMode, useMobileUiMode } from "@/hooks/useMobileUiMode";

const InfoRow = ({ icon, label, value }: { icon: ReactNode; label: string; value?: string | null }) => (
  <div className="flex items-center gap-3 py-2.5">
    <span className="text-slate-400">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="truncate text-sm font-medium text-slate-900">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

/** The shared layout keeps the workspace in memory → persist + reload so every request picks it up */
const selectWorkspace = (id: string) => {
  sessionStorage.setItem(SELECTED_WORKSPACE_STORAGE_KEY, id);
  window.location.reload();
};

/** Trang tài khoản (tab "Tài khoản" của giao diện mobile) — same as MEVI Farms */
export default function AccountPage() {
  const { data: user } = useCurrentUser();
  const { data: workspaces = [] } = useWorkspaces();
  const mobileUiMode = useMobileUiMode();
  const selectedWorkspaceId = getSelectedWorkspaceIdFromStorage();

  const displayName = user?.fullName || user?.username || "";

  return (
    <div className="space-y-4">
      <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
          {displayName ? displayName.trim().charAt(0).toUpperCase() : <UserRound className="h-6 w-6" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900">{displayName || "Người dùng"}</p>
          {user?.username && <p className="truncate text-xs text-slate-500">@{user.username}</p>}
        </div>
      </section>

      <section className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-4 py-1">
        <InfoRow icon={<Phone className="h-4 w-4" />} label="Số điện thoại" value={user?.phoneNumber} />
        <InfoRow
          icon={<UserCheck className="h-4 w-4" />}
          label="Người giới thiệu"
          value={user?.referrer ? [user.referrer.fullName, user.referrer.phoneNumber].filter(Boolean).join(" · ") : null}
        />
      </section>

      {workspaces.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          <Label className="flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-4 w-4 text-slate-400" /> Đơn vị đang làm việc
          </Label>
          <Select value={selectedWorkspaceId ?? ""} onValueChange={selectWorkspace} disabled={workspaces.length === 1}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn đơn vị" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((w) => (
                <SelectItem key={w.id} value={String(w.id)}>
                  {w.brandName || w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>
      )}

      <section className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <div>
            <Label htmlFor="mobile-ui-mode" className="text-sm font-semibold">
              Giao diện mobile mới
            </Label>
            <p className="text-xs text-slate-500">Tắt để dùng giao diện đầy đủ (menu bên trái)</p>
          </div>
        </div>
        <Switch
          id="mobile-ui-mode"
          checked={mobileUiMode === "app"}
          onCheckedChange={(checked) => setMobileUiMode(checked ? "app" : "classic")}
        />
      </section>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={() => authApi.logout()}
      >
        <LogOut className="h-4 w-4" /> Đăng xuất
      </Button>
    </div>
  );
}
