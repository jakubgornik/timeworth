import axios from "axios";
import type { AxiosResponse } from "axios";

let isRefreshing = false;
let refreshPromise: Promise<AxiosResponse> | null = null;
let hasLoggedOut = false;

const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

const logoutAndRedirect = async () => {
  if (hasLoggedOut) return;
  hasLoggedOut = true;

  try {
    await api.post("/auth/logout");
  } finally {
    window.location.href = "/login";
  }
};

const refreshToken = async () => {
  if (isRefreshing) return refreshPromise;

  isRefreshing = true;

  refreshPromise = api
    .post("/auth/refresh")
    .catch(async () => {
      await logoutAndRedirect();
      throw new Error("Token refresh failed");
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

export const resetLogoutState = () => {
  hasLoggedOut = false;
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const req = err.config;

    if (err.response?.status === 401 && !req._retry) {
      req._retry = true;

      try {
        await refreshToken();
        return api(req);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
