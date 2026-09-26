import { useIsMobile } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCallback, useState, type ReactNode } from "react";
import { ViewModeContext, type ViewMode } from "./view-mode-context";

const STORAGE_KEY = "factory_view_mode";

const read = (): ViewMode => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "FARMER" ? "FARMER" : "FACTORY";
  } catch {
    return "FACTORY";
  }
};

// TODO: derive from the user's roles once the BE exposes them; the switch mirrors MEVI Farms
export function ViewModeProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [mode, setModeState] = useState<ViewMode>(read);
  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage blocked — mode still applies for this session
    }
  }, []);

  // The switch only exists on mobile; desktop is always the factory / admin UI
  const effective: ViewMode = isMobile ? mode : "FACTORY";
  return <ViewModeContext.Provider value={{ mode: effective, setMode }}>{children}</ViewModeContext.Provider>;
}
