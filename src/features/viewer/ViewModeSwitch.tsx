import { Factory, Sprout } from "lucide-react";
import { useLocation } from "wouter";
import { ROUTES } from "@/config/routes";
import { useViewMode } from "./use-view-mode";

/** Header toggle between the factory UI and the farmer (nông hộ) UI */
export function ViewModeSwitch() {
  const { isFarmer, setMode } = useViewMode();
  const [, navigate] = useLocation();

  const toggle = () => {
    setMode(isFarmer ? "FACTORY" : "FARMER");
    navigate(isFarmer ? ROUTES.dashboard : ROUTES.connectionSearch);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm active:bg-slate-50"
      aria-label={isFarmer ? "Chuyển sang giao diện nhà máy" : "Chuyển sang giao diện nông hộ"}
    >
      {isFarmer ? <Sprout className="h-4 w-4 text-emerald-600" /> : <Factory className="h-4 w-4 text-emerald-600" />}
      {isFarmer ? "Nông hộ" : "Nhà máy"}
    </button>
  );
}
