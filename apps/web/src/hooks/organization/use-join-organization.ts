import api from "@/lib/axios/axios";
import { IJoinOrganizationDto } from "@packages/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../use-notification";

export function useJoinOrganization() {
  const { showError } = useNotification();
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
    onError: () => {
      showError("Failed to join organization");
    },
  });
}
