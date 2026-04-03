import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios/axios";

export function useDownloadWorkEntriesTemplate() {
  return useMutation<string, AxiosError, void>({
    mutationFn: async () => {
      const response = await api.get("work-entry/import-template", {
        withCredentials: true,
      });
      return response.data.url;
    },
    onSuccess: (url: string) => {
      window.location.href = url;
    },
  });
}
