let isRefreshing = false;
let ongoingRefresh: Promise<Response> | null = null;

async function fetchWithCredentials(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  return fetch(input, {
    ...init,
    credentials: "include",
  });
}

async function logoutAndRedirect(): Promise<void> {
  try {
    await fetchWithCredentials("/auth/logout", { method: "POST" });
  } finally {
    window.location.href = "/login";
  }
}

async function waitForRefreshIfNeeded(): Promise<void> {
  if (isRefreshing && ongoingRefresh) {
    await ongoingRefresh;
  }
}

async function refreshToken(): Promise<void> {
  if (!isRefreshing) {
    isRefreshing = true;
    ongoingRefresh = fetchWithCredentials("/auth/refresh", { method: "POST" });

    try {
      const refreshRes = await ongoingRefresh;
      if (!refreshRes.ok) {
        throw new Error("Token refresh failed");
      }
    } finally {
      isRefreshing = false;
      ongoingRefresh = null;
    }
  } else if (ongoingRefresh) {
    await ongoingRefresh;
  }
}

export async function fetchWithRefresh(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  await waitForRefreshIfNeeded();

  let response = await fetchWithCredentials(input, init);

  if (response.status !== 401) {
    return response;
  }

  await refreshToken();

  response = await fetchWithCredentials(input, init);

  if (response.status === 401) {
    await logoutAndRedirect();
    throw new Error("Unauthorized after token refresh. User logged out.");
  }

  return response;
}
