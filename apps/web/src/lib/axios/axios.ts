import { ROUTES } from "@/routes/routes";
import qs from "qs";
import { createAuthClient } from "./auth-client";
import { createAuthLock } from "./auth-lock";
import { createAuthRevision } from "./auth-revision";

const revisionKey = `timeworth:auth:v1:${import.meta.env.VITE_API_URL ?? ""}`;
const revision = createAuthRevision(revisionKey, () => window.localStorage);
const lock = createAuthLock(
  navigator.locks
    ? async (operation) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
          return await navigator.locks.request(
            revisionKey,
            { signal: controller.signal },
            () => {
              clearTimeout(timeout);
              return operation();
            },
          );
        } finally {
          clearTimeout(timeout);
        }
      }
    : undefined,
);

// Other tabs must discard the previous account's rendered data and query cache.
window.addEventListener("storage", (event) => {
  if (event.key === revisionKey && event.newValue !== event.oldValue)
    window.location.reload();
});

const client = createAuthClient(
  {
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10000,
    paramsSerializer: {
      serialize: (params: Record<string, unknown>) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    },
  },
  {
    lock,
    getRevision: revision.getRevision,
    advanceRevision: () => {
      revision.advanceRevision(
        window.crypto?.randomUUID?.() ?? `${Date.now()}:${Math.random()}`,
      );
    },
    redirectToLogin: () => window.location.replace(ROUTES.LOGIN),
  },
);

export const { withAuthMutation, resetAuthRedirect } = client;
export default client.api;
