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
  return useQuery({
    queryKey: ["organizationWorkEntries", query],
    queryFn: async () => {
      const res = await api.get<IPaginatedResponseDto<IWorkEntryDto>>(
        "user/organization-work-entries",
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
