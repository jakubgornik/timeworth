import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./protected-route";

export const router = createBrowserRouter([
  { path: "/", element: <SignupPage /> }, // temporary, should be welocme page
  // { path: "/signup", element: <SignupPage /> },
  { path: "/login", element: <LoginPage /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);
