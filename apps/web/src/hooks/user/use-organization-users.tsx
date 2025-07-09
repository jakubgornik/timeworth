import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  IOrganizationUsersQueryDto,
  ICurrentUserDto as IUserDto,
  PaginatedResponse,
} from "@packages/types";
import api from "@/lib/axios/axios";

export const useOrganizationUsers = (query: IOrganizationUsersQueryDto) => {
  return useQuery({
    queryKey: ["managedUsers", query],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<IUserDto>>(
        "user/organization-users",
        {
          params: query,
          withCredentials: true,
        }
      );

      return res.data;
    },
    enabled: !!query.managerId && query.page > 0,
    placeholderData: keepPreviousData,
  });
};
