import { useCurrentUser } from "@/hooks/user/use-current-user";
import { JSX } from "react";
import { Navigate } from "react-router";
import { ROUTES } from "./routes";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isLoading, isError } = useCurrentUser();

  //   TODO better loading
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}
