import api from "@/lib/axios/axios";
import { IJoinOrganizationDto } from "@packages/types";
import { useMutation } from "@tanstack/react-query";

export function useJoinOrganization() {
  return useMutation({
    mutationFn: async (data: IJoinOrganizationDto) => {
      const res = await api.post("/organization/join-organization", {
        ...data,
      });
      return res.data;
    },
  });
}
