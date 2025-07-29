import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "./routes";
export function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const location = useLocation();
  const currentPath = location.pathname;

  if (isLoading) {
    return;
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user.organization && currentPath !== ROUTES.DASHBOARD) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
