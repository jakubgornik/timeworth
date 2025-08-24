import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios/axios";

export function useDownloadWorkEntriesTemplate() {
  return useMutation<Blob, AxiosError, void>({
    mutationFn: async () => {
      const response = await api.get("work-entry/import-template", {
        responseType: "blob",
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "import-work-entries-template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}
