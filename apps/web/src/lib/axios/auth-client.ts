import axios, { CanceledError } from "axios";
import type {
  AxiosError,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import type { AuthLock } from "./auth-lock.ts";

const AUTH_ENDPOINT_PATTERN = /\/auth\/(login|logout|refresh)(?:[?#]|$)/;

interface AuthEnvironment {
  lock: AuthLock;
  getRevision: () => string;
  advanceRevision: () => void;
  redirectToLogin: () => void;
  wait?: (milliseconds: number) => Promise<void>;
}

type AuthRequest = InternalAxiosRequestConfig & {
  _authRevision?: string;
  _retry?: boolean;
};

export function createAuthClient(
  config: CreateAxiosDefaults,
  authContext: AuthEnvironment,
) {
  const api = axios.create(config);
  // Authentication probes must not recursively enter the response interceptor.
  const auth = axios.create(config);
  const pending = new Map<string, Promise<void>>();
  let hasRedirected = false;
  const wait =
    authContext.wait ??
    ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const isAuthRequest = (request: AuthRequest) =>
    AUTH_ENDPOINT_PATTERN.test(request.url ?? "");
  const isUnauthorized = (error: unknown) =>
    axios.isAxiosError(error) && error.response?.status === 401;
  const assertRevision = (revision: string | undefined) => {
    if (revision !== authContext.getRevision())
      throw new CanceledError("Authentication changed during request");
  };
  const assertRequest = (request: AuthRequest) => {
    assertRevision(request._authRevision);
    if (request.signal?.aborted) throw new CanceledError("Request canceled");
  };
  const redirect = () => {
    if (hasRedirected) return;
    hasRedirected = true;
    authContext.redirectToLogin();
  };

  const ensureAccessToken = (revision: string): Promise<void> => {
    const existing = pending.get(revision);
    if (existing) return existing;
    const task = authContext
      .lock(async () => {
        assertRevision(revision);
        try {
          // Another tab may already have updated the shared cookies.
          await auth.get("/user/me");
          assertRevision(revision);
          return;
        } catch (error) {
          if (!isUnauthorized(error)) throw error;
        }
        assertRevision(revision);
        try {
          await auth.post("/auth/refresh");
          assertRevision(revision);
        } catch (error) {
          if (!isUnauthorized(error)) throw error;
          // Without Web Locks, the winner's Set-Cookie may arrive after the loser's
          // 401. Allow bounded time for it; keep the winner's credentials intact.
          for (const delay of [0, 100, 250, 500]) {
            if (delay) await wait(delay);
            assertRevision(revision);
            try {
              await auth.get("/user/me");
              assertRevision(revision);
              return;
            } catch (probeError) {
              if (!isUnauthorized(probeError) || delay === 500)
                throw probeError;
            }
          }
        }
      })
      .finally(() => pending.delete(revision));
    pending.set(revision, task);
    return task;
  };

  api.interceptors.request.use((request: AuthRequest) => {
    if (!isAuthRequest(request)) {
      request._authRevision ??= authContext.getRevision();
      assertRequest(request);
    }
    return request;
  });
  api.interceptors.response.use(
    (response) => {
      const request = response.config as AuthRequest;
      if (!isAuthRequest(request)) assertRequest(request);
      return response;
    },
    async (error: AxiosError) => {
      const request = error.config as AuthRequest | undefined;
      if (!request || isAuthRequest(request)) throw error;
      assertRequest(request);
      if (!isUnauthorized(error)) throw error;
      if (request._retry) {
        redirect();
        throw error;
      }
      request._retry = true;
      try {
        await ensureAccessToken(request._authRevision!);
      } catch (refreshError) {
        assertRequest(request);
        // Temporary server/network failures allow a later authentication retry.
        if (isUnauthorized(refreshError)) redirect();
        throw refreshError;
      }
      // Never replay a mutation after login/logout or after its caller canceled it.
      assertRequest(request);
      return api(request);
    },
  );

  const withAuthMutation: AuthLock = (operation) =>
    authContext.lock(async () => {
      const result = await operation();
      authContext.advanceRevision();
      return result;
    });
  return {
    api,
    withAuthMutation,
    resetAuthRedirect: () => {
      hasRedirected = false;
    },
  };
}
