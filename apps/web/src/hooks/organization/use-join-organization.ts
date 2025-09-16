import api from "@/lib/axios/axios";
import { IJoinOrganizationDto } from "@packages/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useJoinOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: IJoinOrganizationDto) => {
      const res = await api.post("/organization/join-organization", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
