import { ROUTES } from "@/routes/routes";
import axios from "axios";
import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";

interface QueuedRequest {
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
  originalRequest: InternalAxiosRequestConfig;
}

let queuedRequests: QueuedRequest[] = [];
let ongoingRefreshRequest: Promise<AxiosResponse> | null = null;
let isTokenRefreshing = false;
let hasLoggedOut = false;

const MAX_RETRIES = 1;

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  timeout: 10000,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
  },
});

const processQueuedRequests = async (error: AxiosError | null) => {
  for (const { resolve, reject, originalRequest } of queuedRequests) {
    if (error) {
      reject(error);
    } else {
      try {
        const response = await api(originalRequest);
        resolve(response);
      } catch (err) {
        reject(err as AxiosError);
      }
    }
  }
  queuedRequests = [];
};

const logoutAndRedirect = async () => {
  if (hasLoggedOut) return;
  hasLoggedOut = true;

  try {
    await api.post("/auth/logout");
  } finally {
    window.location.replace(ROUTES.LOGIN);
  }
};

const refreshToken = async (): Promise<AxiosResponse> => {
  if (isTokenRefreshing && ongoingRefreshRequest) {
    return ongoingRefreshRequest;
  }

  isTokenRefreshing = true;

  ongoingRefreshRequest = api
    .post("/auth/refresh")
    .then((response) => {
      processQueuedRequests(null);
      return response;
    })
    .catch(async (error: AxiosError) => {
      processQueuedRequests(error);
      await logoutAndRedirect();
      throw error;
    })
    .finally(() => {
      isTokenRefreshing = false;
      ongoingRefreshRequest = null;
    });

  return ongoingRefreshRequest;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _retryCount?: number;
    };

    if (originalRequest?.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retryCount = originalRequest._retryCount || 0;

      if (originalRequest._retryCount >= MAX_RETRIES) {
        await logoutAndRedirect();
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest._retryCount += 1;

        if (isTokenRefreshing) {
          return new Promise<AxiosResponse>((resolve, reject) => {
            queuedRequests.push({ resolve, reject, originalRequest });
          });
        }

        try {
          await refreshToken();
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const resetLogoutState = () => {
  hasLoggedOut = false;
  queuedRequests = [];
};

export default api;
