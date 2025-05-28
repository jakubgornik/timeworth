import axios from "axios";
import type {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

interface QueuedRequestCallbacks {
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
}

let queuedRequestCallbacks: QueuedRequestCallbacks[] = [];
let ongoingRefreshRequest: Promise<AxiosResponse> | null = null;
let isTokenRefreshing = false;
let hasLoggedOut = false;

const api = axios.create({
  baseURL: "/",
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

const processQueuedRequests = (
  error: AxiosError | null,
  response: AxiosResponse | null = null
) => {
  queuedRequestCallbacks.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (response) {
      resolve(response);
    }
  });

  queuedRequestCallbacks = [];
};

const logoutAndRedirect = async () => {
  if (hasLoggedOut) return;
  hasLoggedOut = true;

  try {
    await api.post("/auth/logout");
  } finally {
    window.location.href = "/login";
  }
};

const refreshToken = async (): Promise<AxiosResponse> => {
  if (isTokenRefreshing && ongoingRefreshRequest) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      queuedRequestCallbacks.push({ resolve, reject });
    });
  }

  isTokenRefreshing = true;

  ongoingRefreshRequest = api
    .post("/auth/refresh")
    .then((response) => {
      processQueuedRequests(null, response);
      return response;
    })
    .catch(async (error: AxiosError) => {
      processQueuedRequests(error, null);
      await logoutAndRedirect();
      throw new Error("Token refresh failed");
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
    };

    if (originalRequest?.url?.includes("/auth/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isTokenRefreshing) {
        return new Promise<AxiosResponse>((resolve, reject) => {
          queuedRequestCallbacks.push({
            resolve: (response) => resolve(response),
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;

      try {
        await refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const resetLogoutState = () => {
  hasLoggedOut = false;
  queuedRequestCallbacks = [];
};

export default api;
