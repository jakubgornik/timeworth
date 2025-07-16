import { createBrowserRouter } from "react-router";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import { ROUTES } from "./routes";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import { ProtectedRoute } from "./protected-route";
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
            element: <Dashboard />,
            lazy: lazyWrap(() => import("@/pages/dashboard")),
          },
        ],
      },
    ],
  },
]);
