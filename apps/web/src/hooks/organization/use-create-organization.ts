import api from "@/lib/axios/axios";
import { ICreateOrganizationDto } from "@packages/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ICreateOrganizationDto) => {
      const res = await api.post("/organization/create-organization", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
