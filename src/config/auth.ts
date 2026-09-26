import { env } from "./env";

// BASE_URL comes from vite `base` ("/factory") and may end with "/"
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export const AUTH_PATHS = {
  callback: `${BASE}${env.auth.callbackPath}`,
  home: "/factory",
  /** Public app pages, rendered without the layout / auth guard */
  loginPage: "/factory/login",
  register: "/factory/register",
  login: "/auth/login",
  refresh: "/auth/refresh",
  postLogoutRedirect: env.auth.postLogoutRedirectUri,
};

export const AUTH_STORAGE_KEYS = {
  redirectPath: "redirect_path",
};
