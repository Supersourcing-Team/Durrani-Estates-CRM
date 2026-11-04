import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokens";
import { ApiError, type ApiResponse } from "./types";
import { apiEndpoints } from "./apiEndpoint";

/** Host only (no /v1) — paths live in apiEndpoints. */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";

const useProxy =
  import.meta.env.DEV &&
  import.meta.env.VITE_API_USE_PROXY === "true" &&
  /^https?:\/\//i.test(API_BASE_URL);

/**
 * Dev + proxy: empty base so requests hit same-origin /v1/... (Vite forwards).
 * Otherwise: remote host; paths already include /v1/...
 */
const baseURL = useProxy ? "" : API_BASE_URL;

const AUTH_SKIP_REFRESH = [
  apiEndpoints.auth.login,
  apiEndpoints.auth.refresh,
  apiEndpoints.auth.logout,
  apiEndpoints.auth.forgotPassword,
  apiEndpoints.auth.acceptInvite,
  apiEndpoints.auth.resetPassword,
];

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(!useProxy && API_BASE_URL.includes("ngrok")
      ? { "ngrok-skip-browser-warning": "true" }
      : {}),
  },
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");

  const refreshUrl = `${baseURL}${apiEndpoints.auth.refresh}`;
  const { data } = await axios.post<ApiResponse<{ access: string }>>(
    refreshUrl,
    { refresh },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(!useProxy && API_BASE_URL.includes("ngrok")
          ? { "ngrok-skip-browser-warning": "true" }
          : {}),
      },
    },
  );

  if (!data?.success || !data.data?.access) {
    throw new Error(data?.message || "Token refresh failed");
  }

  setTokens(data.data.access);
  return data.data.access;
}

function isAuthSkipRefresh(url?: string): boolean {
  if (!url) return false;
  return AUTH_SKIP_REFRESH.some((endpoint) => url.includes(endpoint));
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url || "";

    if (status === 401 && original && !original._retry && !isAuthSkipRefresh(url)) {
      original._retry = true;
      try {
        refreshPromise =
          refreshPromise ??
          refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        const access = await refreshPromise;
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      } catch {
        clearTokens();
        if (!location.hash.startsWith("#login")) {
          location.hash = "#login";
        }
      }
    }

    const body = error.response?.data as any;
    if (body && body.success === false) {
      throw new ApiError(
        body.message || "Request failed",
        body.error?.code || "UNKNOWN",
        body.error?.details ?? body.message ?? "Request failed",
        status || 0,
      );
    }

    if (!error.response) {
      throw new ApiError(
        "Cannot reach the server. Check your connection and API URL.",
        "NETWORK_ERROR",
        "Cannot reach the server.",
        0,
      );
    }

    throw new ApiError(
      error.message || "Request failed",
      "HTTP_ERROR",
      error.message || "Request failed",
      status || 0,
    );
  },
);

export function getApiBaseUrl(): string {
  return baseURL || API_BASE_URL;
}
