import api from "@/lib/axios/axios";
import { ICreateOrganizationDto } from "@packages/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateOrganization() {
  return useMutation({
    mutationFn: async (data: ICreateOrganizationDto) => {
      const res = await api.post("/organization/create-organization", {
        ...data,
      });
      return res.data;
    },
  });
}
