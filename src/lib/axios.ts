import axios, { AxiosError } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) useAuthStore.getState().logout();
    const apiError: ApiError = {
      message: error.response?.data?.message ?? error.message,
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  },
);
