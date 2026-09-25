import { AUTH_PATHS } from "@/config/auth";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthProvider } from "../types";

// TODO: replace with real Authentik flow when the API is ready.
// Dummy: "login" just redirects straight to the callback route with a fake token.
const DUMMY_LOGIN_DELAY_MS = 800;

export const authApi = {
  getDefaultProvider: (): AuthProvider => env.auth.provider,

  startLogin: (provider: AuthProvider) => {
    setTimeout(() => {
      const url = new URL(AUTH_PATHS.callback, window.location.origin);
      url.searchParams.set("token", `dummy-${provider}-${Date.now()}`);
      window.location.replace(url.toString());
    }, DUMMY_LOGIN_DELAY_MS);
  },

  getCallbackToken: () =>
    new URLSearchParams(window.location.search).get("token"),

  getToken: () => useAuthStore.getState().accessToken,

  setToken: (token: string) => useAuthStore.getState().setAccessToken(token),

  clearToken: () => useAuthStore.getState().logout(),

  logout: () => useAuthStore.getState().logout(),
};
