import api from "@/lib/axios/axios";
import { IJoinOrganizationDto } from "@packages/types";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../use-notification";

export function useJoinOrganization() {
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: async (data: IJoinOrganizationDto) => {
      const res = await api.post("/organization/join-organization", {
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      showSuccess("Successfully joined organization");
    },
    onError: () => {
      showError("Failed to join organization");
    },
  });
}
