import { useQuery } from "@tanstack/react-query";
import { IOrganizationDto } from "@packages/types";
import api from "@/lib/axios/axios";
import { useCurrentUser } from "@/hooks/user/use-current-user";

export const useGetOrganization = () => {
  const { data: currentUser } = useCurrentUser();
  return useQuery({
    queryKey: ["organization", currentUser?.id],
    queryFn: async () => {
      const res = await api.get<IOrganizationDto>("organization", {
        withCredentials: true,
      });

      return res.data;
    },
    enabled: currentUser?.role === "MANAGER",
  });
};
