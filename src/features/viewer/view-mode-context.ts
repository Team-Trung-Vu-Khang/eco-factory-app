import { createContext } from "react";

/** FACTORY = nhà máy / quản trị (sees every farmer); FARMER = nông hộ (sees own connections) */
export type ViewMode = "FACTORY" | "FARMER";

export const ViewModeContext = createContext<{ mode: ViewMode; setMode: (mode: ViewMode) => void } | null>(null);
