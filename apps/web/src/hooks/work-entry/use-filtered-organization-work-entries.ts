import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  IGetFilteredWorkEntriesDto,
  IWorkEntryDtoWithUser,
} from "@packages/types";
import api from "@/lib/axios/axios";
import { useCurrentUser } from "@/hooks/user/use-current-user";

interface IFilteredWorkEntriesQueryDto {
  selectedUserId?: string;
  from?: string;
  to?: string;
  year?: number;
}

export const useGetFilteredWorkEntries = (
  query: IGetFilteredWorkEntriesDto
) => {
  const { selectedUserId, filter } = query;
  const { data: currentUser } = useCurrentUser();

  const filteredQuery: IFilteredWorkEntriesQueryDto = {
    selectedUserId,
  };

  switch (filter.type) {
    case "dateRange":
      filteredQuery.from = filter.from.toISOString();
      filteredQuery.to = filter.to.toISOString();
      break;
    case "year":
      filteredQuery.year = filter.year;
      break;
  }

  return useQuery({
    queryKey: ["filteredWorkEntries", currentUser?.id, filteredQuery],
    queryFn: async () => {
      const res = await api.get<IWorkEntryDtoWithUser[]>(
        "work-entry/filtered",
        {
          params: filteredQuery,
          withCredentials: true,
        }
      );

      return res.data;
    },
    enabled:
      currentUser?.role === "MANAGER" &&
      (filter.type === "dateRange" || filter.type === "year"),
    placeholderData: keepPreviousData,
  });
};
