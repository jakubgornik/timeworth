import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  IPaginatedOrganizationWorkEntriesQueryDto,
  IPaginatedResponseDto,
  IWorkEntryDto,
} from "@packages/types";
import api from "@/lib/axios/axios";

export const useOrganizationWorkEntries = (
  query: IPaginatedOrganizationWorkEntriesQueryDto
) => {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: ["organizationWorkEntries", currentUser?.id, query],
    queryFn: async () => {
      const res = await api.get<IPaginatedResponseDto<IWorkEntryDto>>(
        "work-entry/organization/work-entries",
        {
          params: query,
          withCredentials: true,
        }
      );

      return res.data;
    },
    enabled: currentUser?.role === "MANAGER" && query.page > 0,
    placeholderData: keepPreviousData,
  });
};
