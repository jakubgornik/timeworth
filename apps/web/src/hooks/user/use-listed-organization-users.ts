import api from "@/lib/axios/axios";
import { SelectedUser } from "@packages/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "./use-current-user";

export const useListedOrganizationUsers = () => {
  const { data: currentUser } = useCurrentUser();
  return useQuery({
    queryKey: ["listedOrganizationUsers", currentUser?.id],
    queryFn: async () => {
      const res = await api.get<SelectedUser[]>(
        "user/listed-organization-users",
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    enabled: currentUser?.role === "MANAGER",
    placeholderData: keepPreviousData,
  });
};
