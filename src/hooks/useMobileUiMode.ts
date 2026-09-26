import { useSyncExternalStore } from "react";

/**
 * Giao diện trên điện thoại (giống MEVI Farms):
 * - "app"     : giao diện mobile mới (bottom navigation) — mặc định
 * - "classic" : giao diện đầy đủ (sidebar của AdminLayout)
 */
export type MobileUiMode = "app" | "classic";

const STORAGE_KEY = "eco-factory:mobile-ui-mode";
const CHANGE_EVENT = "eco-factory:mobile-ui-mode-change";
const DEFAULT_MODE: MobileUiMode = "app";

// Fallback when localStorage is blocked (private mode): keep the choice for this session
let memoryMode: MobileUiMode | null = null;

const readMode = (): MobileUiMode => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "classic" || value === "app") return value;
  } catch {
    // ignore
  }
  return memoryMode ?? DEFAULT_MODE;
};

export const setMobileUiMode = (mode: MobileUiMode) => {
  memoryMode = mode;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore — memoryMode still applies this session
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

export function useMobileUiMode() {
  return useSyncExternalStore(subscribe, readMode, () => DEFAULT_MODE);
}
