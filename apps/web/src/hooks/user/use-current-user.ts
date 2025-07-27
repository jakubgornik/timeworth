import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { ICurrentUserDto } from "@packages/types";

export function useCurrentUser() {
  return useQuery<ICurrentUserDto, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await api.get<ICurrentUserDto>("/user/me", {
        withCredentials: true,
      });
      return res.data;
    },
  });
}
