import { useSyncExternalStore } from "react";

/**
 * Giao diện theo vai trò (tạm thời, để demo trước khi BE trả role):
 * - "farmer" : nông dân — đầy đủ menu, có giao diện mobile
 * - "owner"  : chủ nhà máy — chỉ hồ sơ, đăng tin, nhu cầu kết nối; không có giao diện mobile
 * TODO: derive from the user's role once the BE exposes it
 */
export type LayoutRole = "farmer" | "owner";

const STORAGE_KEY = "eco-factory:layout-role";
const CHANGE_EVENT = "eco-factory:layout-role-change";
const DEFAULT_ROLE: LayoutRole = "owner";

// Fallback when localStorage is blocked (private mode): keep the choice for this session
let memoryRole: LayoutRole | null = null;

const readRole = (): LayoutRole => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "farmer" || value === "owner") return value;
  } catch {
    // ignore
  }
  return memoryRole ?? DEFAULT_ROLE;
};

export const setLayoutRole = (role: LayoutRole) => {
  memoryRole = role;
  try {
    window.localStorage.setItem(STORAGE_KEY, role);
  } catch {
    // ignore — memoryRole still applies this session
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

export function useLayoutRole() {
  return useSyncExternalStore(subscribe, readRole, () => DEFAULT_ROLE);
}
