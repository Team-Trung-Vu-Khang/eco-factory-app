import { type ReactNode, useEffect, useState } from "react";
import { AUTH_PATHS, AUTH_STORAGE_KEYS } from "@/config/auth";
import { authApi } from "../api/auth.api";
import { AuthLoadingState } from "./AuthLoadingState";

const isSafeRedirect = (path: string | null): path is string =>
  !!path &&
  path.startsWith("/") &&
  !path.startsWith("//") &&
  path !== "/" &&
  !path.startsWith(AUTH_PATHS.callback);

function handleCallback() {
  const token = authApi.getCallbackToken();
  if (!token) {
    authApi.startLogin(authApi.getDefaultProvider());
    return;
  }

  authApi.setToken(token);

  const params = new URLSearchParams(window.location.search);
  const redirectParam = params.get("redirect") || params.get("redirect_url");
  const savedPath = sessionStorage.getItem(AUTH_STORAGE_KEYS.redirectPath);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.redirectPath);

  const target = [redirectParam, savedPath].find(isSafeRedirect);
  window.location.replace(target ?? AUTH_PATHS.home);
}

const isCallbackRoute = () =>
  window.location.pathname.startsWith(AUTH_PATHS.callback);

function redirectToLogin() {
  const currentPath =
    window.location.pathname + window.location.search + window.location.hash;
  if (isSafeRedirect(currentPath)) {
    sessionStorage.setItem(AUTH_STORAGE_KEYS.redirectPath, currentPath);
  }
  authApi.startLogin(authApi.getDefaultProvider());
}

export function AuthWrapper({ children }: { children: ReactNode }) {
  const [isReady] = useState(
    () => !isCallbackRoute() && !!authApi.getToken(),
  );

  useEffect(() => {
    if (isReady) return;
    if (isCallbackRoute()) handleCallback();
    else redirectToLogin();
  }, [isReady]);

  if (!isReady) return <AuthLoadingState />;

  return <>{children}</>;
}
