import { createBrowserRouter } from "react-router";
import Layout from "@/components/layout";
import { ROUTES } from "./routes";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import { ProtectedRoute } from "./protected-route";
import { ManagerRouteGuard } from "./manager-route";
import { lazyWrap } from "./router.utils";

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    // Temporary signup on home route
    path: ROUTES.HOME,
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
        ],
      },
    ],
  },
]);
