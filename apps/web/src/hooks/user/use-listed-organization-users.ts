import api from "@/lib/axios/axios";
import { SelectedUser } from "@packages/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useListedOrganizationUsers = (query: {
  organizationId: string;
}) => {
  return useQuery({
    queryKey: ["listedOrganizationUsers", query],
    queryFn: async () => {
      const res = await api.get<SelectedUser[]>(
        "user/listed-organization-users",
        {
          params: query,
          withCredentials: true,
        }
      );
      return res.data;
    },
    enabled: !!query.organizationId,
    placeholderData: keepPreviousData,
  });
};
