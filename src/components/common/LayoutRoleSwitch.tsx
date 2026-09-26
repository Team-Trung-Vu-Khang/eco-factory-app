import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Factory, LogOut, Sprout } from "lucide-react";
import { authApi } from "@/features/auth";
import { setLayoutRole, useLayoutRole, type LayoutRole } from "@/hooks/useLayoutRole";

const ROLES: Record<LayoutRole, { label: string; icon: typeof Factory }> = {
  farmer: { label: "Nông dân", icon: Sprout },
  owner: { label: "Chủ nhà máy", icon: Factory },
};

/** Floating button: switch farmer / factory-owner layout, or sign out */
export function LayoutRoleSwitch() {
  const role = useLayoutRole();
  const Current = ROLES[role].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Giao diện: ${ROLES[role].label}`}
          title={`Giao diện: ${ROLES[role].label}`}
          className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-white/70 transition hover:scale-105 active:scale-95"
        >
          <Current className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" sideOffset={8} className="w-48">
        <DropdownMenuLabel className="text-xs font-medium text-slate-500">Giao diện</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={role} onValueChange={(v) => setLayoutRole(v as LayoutRole)}>
          {(Object.entries(ROLES) as [LayoutRole, (typeof ROLES)[LayoutRole]][]).map(([value, { label, icon: Icon }]) => (
            <DropdownMenuRadioItem key={value} value={value} className="gap-2">
              <Icon className="h-4 w-4 text-slate-500" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => authApi.logout()} className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700">
          <LogOut className="h-4 w-4" />
          Thoát
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
