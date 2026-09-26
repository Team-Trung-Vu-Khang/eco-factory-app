import { Factory, Sprout } from "lucide-react";
import {
  setLayoutRole,
  useLayoutRole,
  type LayoutRole,
} from "@/hooks/useLayoutRole";

const OPTIONS: { value: LayoutRole; label: string; icon: typeof Factory }[] = [
  { value: "farmer", label: "Nông dân", icon: Sprout },
  { value: "owner", label: "Chủ nhà máy", icon: Factory },
];

/** Floating switch between the farmer and factory-owner layouts */
export function LayoutRoleSwitch() {
  const role = useLayoutRole();

  return (
    <div
      role="radiogroup"
      aria-label="Đổi giao diện"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-2 z-50 flex gap-0.5 rounded-full border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = role === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLayoutRole(value)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
