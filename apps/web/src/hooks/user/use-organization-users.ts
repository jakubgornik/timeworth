import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  IPaginatedOrganizationUsersQueryDto,
  IPaginatedResponseDto,
  ICurrentUserDto as IUserDto,
} from "@packages/types";
import api from "@/lib/axios/axios";

export const useOrganizationUsers = (
  query: IPaginatedOrganizationUsersQueryDto
) => {
  return useQuery({
    queryKey: ["managedUsers", query],
    queryFn: async () => {
      const res = await api.get<IPaginatedResponseDto<IUserDto>>("user", {
        params: query,
        withCredentials: true,
      });

      return res.data;
    },
    enabled: !!query.managerId && query.page > 0,
    placeholderData: keepPreviousData,
  });
};
