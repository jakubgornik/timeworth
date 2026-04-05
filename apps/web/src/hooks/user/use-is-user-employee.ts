import { useMemo } from "react";
import { useCurrentUser } from "./use-current-user";

export const useIsUserEmployee = (): boolean => {
  const currentUser = useCurrentUser();

  return useMemo(() => {
    const user = currentUser.data;

    if (!user || !user.organization) return false;

    return user.organization.managerId !== user.id;
  }, [currentUser.data?.organization?.managerId, currentUser.data?.id]);
};
