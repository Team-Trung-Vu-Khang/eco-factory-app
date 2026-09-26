import { Smartphone } from "lucide-react";
import { setMobileUiMode } from "@/hooks/useMobileUiMode";

/** Floating button in the classic (sidebar) UI on phones to go back to the mobile app UI */
export function SwitchToMobileAppButton() {
  return (
    <button
      type="button"
      onClick={() => setMobileUiMode("app")}
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-lg active:scale-95"
    >
      <Smartphone className="h-4 w-4" />
      Giao diện mobile
    </button>
  );
}
