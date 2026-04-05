import { Navigate, useLocation } from "react-router";
import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useIsUserEmployee } from "@/hooks/user/use-is-user-employee";
import { ROUTES } from "./routes";

export const EmployeeRouteGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: user, isLoading, isError } = useCurrentUser();
  const isEmployee = useIsUserEmployee();
  const location = useLocation();

  if (isLoading) {
    return;
  }

  if (isError || !user || !user.organization || !isEmployee) {
    return (
      <Navigate to={ROUTES.DASHBOARD} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
