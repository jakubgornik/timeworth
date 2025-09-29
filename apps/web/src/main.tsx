import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.ts";
import "./index.css";
import { router } from "./routes/router.tsx";
import { NotificationProvider } from "./hooks/use-notification.tsx";
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_NODE_ENV === "production") {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_NODE_ENV,
    tracesSampleRate: 0.7,
    integrations: [Sentry.browserTracingIntegration()],
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>
);
