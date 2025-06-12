import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./protected-route";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <SignupPage /> }, // temporary
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  {
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);
