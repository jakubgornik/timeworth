import { useCurrentUser } from "@/hooks/user/use-current-user";
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
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: ["managedUsers", currentUser?.id, query],
    queryFn: async () => {
      const res = await api.get<IPaginatedResponseDto<IUserDto>>("user", {
        params: query,
        withCredentials: true,
      });

      return res.data;
    },
    enabled: currentUser?.role === "MANAGER" && query.page > 0,
    placeholderData: keepPreviousData,
  });
};
