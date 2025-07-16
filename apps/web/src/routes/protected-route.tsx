import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Navigate, Outlet } from "react-router";
import { ROUTES } from "./routes";

export function ProtectedRoute() {
  const { data: user, isLoading, isError } = useCurrentUser();

  //   TODO better loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
