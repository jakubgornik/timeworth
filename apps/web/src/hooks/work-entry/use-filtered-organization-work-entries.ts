import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  IGetFilteredWorkEntriesDto,
  IWorkEntryDtoWithUser,
} from "@packages/types";
import api from "@/lib/axios/axios";

interface IFilteredWorkEntriesQueryDto {
  managerId: string;
  selectedUserId?: string;
  from?: string;
  to?: string;
  year?: number;
}

export const useGetFilteredWorkEntries = (
  query: IGetFilteredWorkEntriesDto
) => {
  const { managerId, selectedUserId, filter } = query;

  const filteredQuery: IFilteredWorkEntriesQueryDto = {
    managerId,
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
    queryKey: ["filteredWorkEntries", filteredQuery],
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
      !!managerId && (filter.type === "dateRange" || filter.type === "year"),
    placeholderData: keepPreviousData,
  });
};
