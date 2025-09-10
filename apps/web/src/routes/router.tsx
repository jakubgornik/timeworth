import { createBrowserRouter } from "react-router";
import Layout from "@/components/layout";
import { ROUTES } from "./routes";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import { ProtectedRoute } from "./protected-route";
import { ManagerRouteGuard } from "./manager-route";
import { lazyWrap } from "./router.utils";
import HomePage from "@/pages";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.SIGN_UP,
    element: <SignupPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Layout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            lazy: lazyWrap(() => import("@/pages/dashboard")),
          },
          {
            path: ROUTES.DETAILS,
            lazy: lazyWrap(() => import("@/pages/details"), ManagerRouteGuard),
          },
          {
            path: ROUTES.ENTRIES,
            lazy: lazyWrap(() => import("@/pages/entries"), ManagerRouteGuard),
          },
          {
            path: ROUTES.SETTINGS,
            lazy: lazyWrap(() => import("@/pages/settings"), ManagerRouteGuard),
          },
        ],
      },
    ],
  },
]);
