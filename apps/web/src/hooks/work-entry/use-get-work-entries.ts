import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { IGetWorkEntriesQueryDto, IWorkEntryToEventDto } from "@packages/types";
import api from "@/lib/axios/axios";

export const useGetWorkEntries = (query: IGetWorkEntriesQueryDto) => {
  return useQuery({
    queryKey: ["workEntries", query],
    queryFn: async () => {
      const res = await api.get<IWorkEntryToEventDto[]>("work-entry", {
        params: query,
        withCredentials: true,
      });

      return res.data;
    },
    enabled: !!query.userId && !!query.currentWeek,
    placeholderData: keepPreviousData,
  });
};
