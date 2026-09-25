const read = (value: string | undefined, fallback = "") =>
  value?.trim() || fallback;

export const env = {
  apiBaseUrl: read(import.meta.env.VITE_API_BASE_URL),
  goongApiKey: read(import.meta.env.VITE_GOONG_API_KEY),
  auth: {
    provider: read(import.meta.env.VITE_AUTH_PROVIDER, "factory"),
    callbackPath: read(import.meta.env.VITE_AUTH_CALLBACK_PATH, "/auth/callback"),
    postLogoutRedirectUri: read(import.meta.env.VITE_AUTH_POST_LOGOUT_REDIRECT_URI),
  },
};
