import { useCurrentUser } from "@/hooks/user/use-current-user";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { IGetWorkEntriesQueryDto, IWorkEntryToEventDto } from "@packages/types";
import api from "@/lib/axios/axios";

export const useGetWorkEntries = (query: IGetWorkEntriesQueryDto) => {
  const { data: currentUser } = useCurrentUser();

  return useQuery({
    queryKey: ["workEntries", currentUser?.id, query],
    queryFn: async () => {
      const res = await api.get<IWorkEntryToEventDto[]>("work-entry", {
        params: query,
        withCredentials: true,
      });

      return res.data;
    },
    enabled: !!currentUser?.organization && !!query.currentWeek,
    placeholderData: keepPreviousData,
  });
};
