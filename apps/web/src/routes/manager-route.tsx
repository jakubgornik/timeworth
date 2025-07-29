import { Navigate, useLocation } from "react-router";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useIsUserManager } from "@/hooks/user/use-is-user-manager";
import { ROUTES } from "./routes";

export const ManagerRouteGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const isManager = useIsUserManager();
  const location = useLocation();

  if (isLoading) {
    return;
  }

  if (isError || !user || !user.organization || !isManager) {
    return (
      <Navigate to={ROUTES.DASHBOARD} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
