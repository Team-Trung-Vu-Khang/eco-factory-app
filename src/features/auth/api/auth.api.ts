import { AUTH_PATHS } from "@/config/auth";
import { env } from "@/config/env";
import type { AuthProvider } from "../types";

// Same key eco-shared-ui reads, so its layout (workspaces, current user)
// sends the token too.
const TOKEN_KEY = "accessToken";

export const authStorage = {
  getToken: () => sessionStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
  clearToken: () => sessionStorage.removeItem(TOKEN_KEY),
};

export const authApi = {
  ...authStorage,

  getDefaultProvider: (): AuthProvider => env.auth.provider,

  /** Backend redirects back to `callback_url?token=...` after SSO login */
  startLogin: (provider: AuthProvider) => {
    const callbackUrl = new URL(AUTH_PATHS.callback, window.location.origin);
    const url = new URL(
      `${AUTH_PATHS.login}/${encodeURIComponent(provider)}`,
      env.apiBaseUrl || window.location.origin,
    );
    url.searchParams.set("callback_url", callbackUrl.toString());
    window.location.replace(url.toString());
  },

  getCallbackToken: () =>
    new URLSearchParams(window.location.search).get("token"),

  logout: () => {
    authStorage.clearToken();
    window.location.replace(AUTH_PATHS.postLogoutRedirect);
  },
};
