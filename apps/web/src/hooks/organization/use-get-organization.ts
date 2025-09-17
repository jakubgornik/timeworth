import { useQuery } from "@tanstack/react-query";
import { IOrganizationDto } from "@packages/types";
import api from "@/lib/axios/axios";

export const useGetOrganization = (managerId: string) => {
  return useQuery({
    queryKey: ["organization", managerId],
    queryFn: async () => {
      const res = await api.get<IOrganizationDto>("organization", {
        params: { managerId },
        withCredentials: true,
      });

      return res.data;
    },
    enabled: !!managerId,
  });
};
