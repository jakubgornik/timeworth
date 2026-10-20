import { useCurrentUser } from "@/hooks/user/use-current-user";
import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "./routes";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";

export function ProtectedRoute() {
  const {
    data: user,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useCurrentUser();
  const location = useLocation();
  const currentPath = location.pathname;

  if (isPending) {
    return;
  }

  if (isError && isAxiosError(error) && error.response?.status === 401) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isError && !user) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-6"
        role="alert"
      >
        <p>Unable to verify your login. Please try again.</p>
        <Button disabled={isFetching} onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  if (!user.organization && currentPath !== ROUTES.DASHBOARD) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
}
