import api from "@/lib/axios/axios";
import { ICreateOrganizationDto } from "@packages/types";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../use-notification";

export function useCreateOrganization() {
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: async (data: ICreateOrganizationDto) => {
      const res = await api.post("/organization/create-organization", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      showSuccess("Successfully created organization");
    },
    onError: () => {
      showError("Failed to create organization");
    },
  });
}
