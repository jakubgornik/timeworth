import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { ICurrentUser } from "@packages/types";

export function useCurrentUser() {
  return useQuery<ICurrentUser, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get<ICurrentUser>("/user/me");
      return res.data;
    },
  });
}
