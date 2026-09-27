import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useIsMobile,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { LogOut, Monitor, Smartphone } from "lucide-react";
import { authApi } from "@/features/auth";
import { setMobileUiMode, useMobileUiMode, type MobileUiMode } from "@/hooks/useMobileUiMode";

const MODES: Record<MobileUiMode, { label: string; icon: typeof Monitor }> = {
  app: { label: "Giao diện mobile", icon: Smartphone },
  classic: { label: "Giao diện web", icon: Monitor },
};

/** Floating button: switch mobile / web UI (phones only), or sign out */
export function LayoutRoleSwitch() {
  const isMobile = useIsMobile();
  const mode = useMobileUiMode();
  // Desktop always uses the web UI
  const current = isMobile ? mode : "classic";
  const Current = MODES[current].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={MODES[current].label}
          title={MODES[current].label}
          className={`fixed right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-white/70 transition hover:scale-105 active:scale-95 ${
            // Sit above the mobile bottom navigation
            isMobile && mode === "app" ? "bottom-[calc(6.5rem+env(safe-area-inset-bottom))]" : "bottom-[calc(1.25rem+env(safe-area-inset-bottom))]"
          }`}
        >
          <Current className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-52">
        {isMobile && (
          <>
            <DropdownMenuLabel className="text-xs font-medium text-slate-500">Giao diện</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMobileUiMode(v as MobileUiMode)}>
              {(Object.entries(MODES) as [MobileUiMode, (typeof MODES)[MobileUiMode]][]).map(([value, { label, icon: Icon }]) => (
                <DropdownMenuRadioItem key={value} value={value} className="gap-2">
                  <Icon className="h-4 w-4 text-slate-500" />
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onSelect={() => authApi.logout()} className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700">
          <LogOut className="h-4 w-4" />
          Thoát
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
