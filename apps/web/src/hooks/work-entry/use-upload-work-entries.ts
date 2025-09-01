import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios/axios";
import { useNotification } from "../use-notification";

export function useUploadWorkEntries() {
  const queryClient = useQueryClient();
  const { showSuccess } = useNotification();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/work-entry/import", formData, {
        withCredentials: true,
      });

      return res.data;
    },
    onSuccess: () => {
      showSuccess("Successfully imported work entries");
      queryClient.invalidateQueries({ queryKey: ["workEntries"] });
    },
  });
}
