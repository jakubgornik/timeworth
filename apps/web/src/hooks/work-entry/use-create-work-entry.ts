import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { ICreateWorkEntryDto } from "@packages/types";
import { useNotification } from "../use-notification";

export function useCreateWorkEntry() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: async (data: ICreateWorkEntryDto) => {
      const res = await api.post("/work-entry", {
        ...data,
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      showSuccess("Successfully created work entry");
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
    },
    onError: () => {
      showError("Failed to create work entry");
    },
  });
}
