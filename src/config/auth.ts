// BASE_URL is "/factory" (from vite `base`), without trailing slash handling
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const AUTH_PATHS = {
  callback: `${BASE}/auth/callback`,
  home: `${BASE}/`,
};

export const AUTH_STORAGE_KEYS = {
  redirectPath: "redirect_path",
};
