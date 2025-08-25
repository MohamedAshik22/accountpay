// src/api/authClient.ts
import axios, { AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';

const apiUrl = import.meta.env.VITE_API_BASE_URL as string;

// ---- Token state (in-memory + localStorage) ----
let accessToken: string | null = localStorage.getItem('token');
let refreshTimeout: number | undefined;

export function setAccessToken(token: string) {
  accessToken = token;
  localStorage.setItem('token', token);
  scheduleProactiveRefresh(token).catch(() => {});
}

export function setRefreshToken(token: string) {
  localStorage.setItem('refresh_token', token);
}

export function clearTokens() {
  accessToken = null;
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  if (refreshTimeout) window.clearTimeout(refreshTimeout);
}

type Jwt = { exp: number };

// Proactive: refresh AT ~2 minutes before it expires
async function scheduleProactiveRefresh(token: string) {
  try {
    const { exp } = jwtDecode<Jwt>(token);
    const msToExpiry = exp * 1000 - Date.now();
    const msToRefresh = Math.max(5_000, msToExpiry - 2 * 60 * 1000);
    if (refreshTimeout) window.clearTimeout(refreshTimeout);
    refreshTimeout = window.setTimeout(() => refreshAccessToken().catch(() => {}), msToRefresh);
  } catch {
    // ignore decode errors
  }
}

// ---- Axios client ----
export const authClient = axios.create({
  baseURL: apiUrl,
  // If you move RT to httpOnly cookie, enable this and configure CORS on server:
  // withCredentials: true,
});

authClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let waiters: Array<(t: string) => void> = [];

// Centralized refresh call
async function refreshAccessToken(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve) => waiters.push(resolve));
  }
  isRefreshing = true;
  try {
    // If using cookie for RT later:
    // const { data } = await axios.post(`${apiUrl}/auth/refresh`, {}, { withCredentials: true });

    const rt = localStorage.getItem('refresh_token');
    if (!rt) throw new Error('No refresh token available');

    const { data } = await axios.post(`${apiUrl}/auth/refresh`, { refresh_token: rt });

    const newAT: string = data.access_token;
    setAccessToken(newAT);

    // If backend rotates and returns a new RT:
    if (data.refresh_token) setRefreshToken(data.refresh_token);

    waiters.forEach((w) => w(newAT));
    waiters = [];
    return newAT;
  } finally {
    isRefreshing = false;
  }
}

authClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original: AxiosRequestConfig & { _retry?: boolean } = error.config ?? {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newAT = await refreshAccessToken();
        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>).Authorization = `Bearer ${newAT}`;
        return authClient(original);
      } catch {
        clearTokens();
        // optional: redirect here
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// On app boot, schedule refresh if a token exists
if (accessToken) scheduleProactiveRefresh(accessToken).catch(() => {});
