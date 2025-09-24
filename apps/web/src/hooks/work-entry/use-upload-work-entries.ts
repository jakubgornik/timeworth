import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { useNotification } from "../use-notification";

export function useUploadWorkEntries() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  return useMutation({
    mutationFn: async (file: File) => {
      const data = new FormData();
      data.append("file", file);

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      data.append("timezone", timezone);
      const res = await api.post("/work-entry/import", data, {
        withCredentials: true,
      });

      return res.data;
    },
    onSuccess: () => {
      showSuccess("Successfully imported work entries");
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
    },
    onError: () => {
      showError("Failed to import work entries");
    },
  });
}
