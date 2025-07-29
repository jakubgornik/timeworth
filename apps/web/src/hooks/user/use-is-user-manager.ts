import { useMemo } from "react";
import { useCurrentUser } from "./use-current-user";

export const useIsUserManager = (): boolean => {
  const currentUser = useCurrentUser();

  return useMemo(
    () => currentUser.data?.organization?.managerId === currentUser.data?.id,
    [currentUser.data?.organization?.managerId, currentUser.data?.id]
  );
};
