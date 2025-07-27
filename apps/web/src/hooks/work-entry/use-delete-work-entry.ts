import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { useNotification } from "../use-notification";

export const useDeleteWorkEntry = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useNotification();

  return useMutation({
    mutationFn: async (workEntryId: string) => {
      const res = await api.delete(`work-entry/${workEntryId}`, {
        params: { workEntryId },
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      showSuccess("Successfully deleted work entry");
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
    },
  });
};
