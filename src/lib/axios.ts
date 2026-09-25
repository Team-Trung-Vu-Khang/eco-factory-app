import axios, { type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { AUTH_PATHS } from "@/config/auth";
import { authApi } from "@/features/auth/api/auth.api";
import { getSelectedWorkspaceIdFromStorage } from "@/features/workspace";
import { getApiErrorMessage } from "./api-error";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = authApi.getToken();
    const workspaceId = getSelectedWorkspaceIdFromStorage();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Skip X-Workspace-Id header if skipWorkspaceHeader is explicitly set
    const skipWorkspace = Boolean(config.headers?.skipWorkspaceHeader);

    if (skipWorkspace) {
      delete config.headers["X-Workspace-Id"];
      delete config.headers.skipWorkspaceHeader;
    } else if (workspaceId && !config.headers["X-Workspace-Id"]) {
      config.headers["X-Workspace-Id"] = workspaceId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryConfig;

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 401 && originalRequest && !originalRequest._retry) {
        if (originalRequest.url?.includes(AUTH_PATHS.refresh)) {
          authApi.clearToken();
          window.location.replace(AUTH_PATHS.postLogoutRedirect);
          return Promise.reject(error);
        }

        if (isRefreshing) {
          try {
            const token = await new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            });

            if (!originalRequest.headers["X-Workspace-Id"]) {
              const workspaceId = getSelectedWorkspaceIdFromStorage();
              originalRequest.headers["X-Workspace-Id"] = workspaceId;
            }

            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          } catch (err) {
            return Promise.reject(err);
          }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const oldToken = authApi.getToken();
          const { data } = await axios.post<string | { access_token?: string }>(
            AUTH_PATHS.refresh,
            null,
            {
              baseURL: env.apiBaseUrl,
              headers: {
                Authorization: `Bearer ${oldToken}`,
              },
            },
          );

          const newToken = typeof data === "string" ? data : data.access_token;

          if (!newToken) {
            throw new Error("Invalid token response");
          }

          authApi.setToken(newToken);
          processQueue(null, newToken);

          if (!originalRequest.headers["X-Workspace-Id"]) {
            const workspaceId = getSelectedWorkspaceIdFromStorage();
            originalRequest.headers["X-Workspace-Id"] = workspaceId;
          }

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          authApi.clearToken();

          console.warn("[apiClient] Refresh token failed — redirect to login");
          window.location.replace(AUTH_PATHS.postLogoutRedirect);

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) {
        console.warn("[apiClient] 403 Forbidden");
      }

      if (!error.response) {
        console.error("[apiClient] Network error:", error.message);
      }

      // Keep the backend payload intact for field-level handling, while making
      // the standard Error message safe to show in generic UI toasts.
      // Ưu tiên liệt kê lỗi từng trường (fieldErrors) rồi mới tới message chung,
      // nhờ đó mọi toast đọc `error.message` đều có thông báo chi tiết.
      error.message = getApiErrorMessage(error);
    }

    return Promise.reject(error);
  },
);
